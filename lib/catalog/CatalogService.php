<?php

namespace NP\catalog;

use NP\core\AbstractService;
use NP\core\db\Expression;
use NP\core\db\Select;
use NP\core\Exception;
use NP\property\PropertyGateway;
use NP\util\Util;
use NP\catalog\VcOrderGateway;

/**
 * Service class for operations related to Vendor Catalog
 *
 * @author Thomas Messier
 */
class CatalogService extends AbstractService {

	const CATALOG_ACTIVE     = 1;
	const CATALOG_INACTIVE   = 0;
	const CATALOG_PENDING    = -1;
	const CATALOG_PROCESSING = -2;

	protected $configService, $vcOrderGateway, $propertyGateway;

	public function __construct(VcOrderGateway $vcOrderGateway, PropertyGateway $propertyGateway) {
		$this->vcOrderGateway = $vcOrderGateway;
		$this->propertyGateway = $propertyGateway;
	}
	
	public function setConfigService(\NP\system\ConfigService $configService) {
		$this->configService = $configService;
	}

	/**
	 * Returns a catalog
	 * 
	 * @param  int     $vc_id                Id of the catalog to retrieve
	 * @param  boolean [$includeAssignment]  Whether or not you want to include assignment data for the catalog
	 * @return array                         A catalog record
	 * 
	 */
	public function get($vc_id) {
		$data = $this->vcGateway->findById($vc_id);
		$data['vc_categories'] = Util::valueList($this->getAssignedCategories($vc_id), 'vccat_id');
		$assignedVendors       = $this->getAssignedVendors($vc_id);
		$data['vc_vendors']    = Util::valueList($assignedVendors, 'vendor_id');
		$data['vendor']        = $assignedVendors[0];
		$data['vc_properties'] = Util::valueList($this->getAssignedProperties($vc_id), 'property_id');

		$pdfPath = $this->getPdfPath() . $vc_id . '.pdf';
		$data['vc_has_pdf'] = file_exists($pdfPath);

		return $data;
	}

	/**
	 * Returns vendor catalogs
	 * 
	 * @param  string|int $vc_status A status or list of statuses; valid statuses are 1 (active), 0 (inactive), and -1 (pending)
	 * @param  int        $pageSize  The number of records per page; if null, all records are returned
	 * @param  int        $page      The page for which to return records
	 * @param  string     $sort      Field(s) by which to sort the result; defaults to vendor_name
	 * @return array                 Array of catalog records
	 */
	public function getRegister($vc_status=null, $pageSize=null, $page=1, $sort='vc_vendorname') {
		$this->validateCatalogStatus($vc_status);
		return $this->vcGateway->findRegister($vc_status, $pageSize, $page, $sort);
	}

	/**
	 * Sets the status for a catalog record
	 * 
	 * @param int $vc_id     The ID of the catalog whose status will change
	 * @param int $vc_status The status to change to; valid statuses are 1 (active), 0 (inactive), and -1 (pending)
	 */
	public function setCatalogStatus($vc_id, $vc_status) {
		$this->validateCatalogStatus($vc_status);
		$this->vcGateway->update(
			array('vc_status'=>$vc_status),
			array('vc_id'=>'?'),
			array($vc_id)
		);
	}

	/**
	 * Deletes a catalog (can only be used on pending catalogs)
	 *
	 * @param  int $vc_id The ID of the catalog to delete
	 */
	public function deleteCatalog($vc_id) {
		// Begin transaction
		$this->vcGateway->beginTransaction();
		
		try {
			$this->linkVcPropertyGateway->delete(array('vc_id'=>$vc_id));
			$this->linkVcVccatGateway->delete(array('vc_id'=>$vc_id));
			$this->linkVcVendorGateway->delete(array('vc_id'=>$vc_id));
			$this->linkVcitemcatGlGateway->delete(array('vc_id'=>$vc_id));
			$this->vcGateway->delete(array('vc_id'=>$vc_id));

			$this->vcGateway->commit();
		} catch (Exception $e) {
			$this->vcGateway->rollback();
			throw $e;
		}
	}

	protected function validateCatalogStatus($vc_status) {
		$statusList = explode(',', $vc_status);
		$validStatuses = array(self::CATALOG_ACTIVE, self::CATALOG_INACTIVE, self::CATALOG_PENDING, self::CATALOG_PROCESSING);
		foreach($statusList as $val) {
			if (!in_array($val, $validStatuses)) {
				throw new \NP\core\Exception('Invalid vendor status passed. Valid values are: ' . implode(' ,', $validStatuses));
			}
		}
	}

	/**
	 * Saves a catalog
	 *
	 * @param  array $data A data set of catalog information to be saved 
	 * @return array       Array with status info on the operation
	 */
	public function saveCatalog($data) {
		// Get entity
		$vc = new VcEntity($data['vc']);
		
		// Add vendor name, tax ID, and created date to the model only if dealing with a new catalog
		if ($vc->vc_id === null) {
			$vendor = $this->vendorGateway->findById($data['vendor_id']);
			$vc->vc_vendorname = $vendor['vendor_name'];
			$vc->vc_unique_id = $vendor['vendor_fedid'];
		}

		// Create an implementation class
		$vcImpl = '\NP\catalog\types\\' . ucfirst($vc->vc_catalogtype);
		$vcImpl = new $vcImpl($this->configService, $this->entityValidator, $vc, $data);

		$vcImpl->isValid();
		$errors = $vcImpl->getErrors();

		// If the data is valid, save it
		if (!count($errors)) {
			// Begin transaction
			$this->vcGateway->beginTransaction();

			try {
				// Run implementation-specific code
				$errors = $vcImpl->beforeSave();

				if (!count($errors)) {
					// Save the userprofile record								
					$this->vcGateway->save($vc);
					
					// Save the category assignments
					$this->linkVcVccatGateway->delete(array('vc_id'=>$vc->vc_id));
					foreach ($data['vc_categories'] as $vccat_id) {
						$this->linkVcVccatGateway->save(array(
							'vc_id'    =>$vc->vc_id,
							'vccat_id' =>$vccat_id
						));
					}

					// Save the vendor assignments
					$this->linkVcVendorGateway->delete(array('vc_id'=>$vc->vc_id));
					if ( in_array('vendors', $vcImpl->getAssignmentFields()) ) {
						foreach ($data['vc_vendors'] as $vendor_id) {
							$this->linkVcVendorGateway->save(array(
								'vc_id'     =>$vc->vc_id,
								'vendor_id' =>$vendor_id
							));
						}
					// If there are no vendor assignments, it's because it's a catalog type that doesn't use them
					// In that case, just assign the vendor selected
					} else {
						$this->linkVcVendorGateway->save(array(
							'vc_id'     => $vc->vc_id,
							'vendor_id' => $data['vendor_id']
						));
					}

					// Save the property assignments
					$this->linkVcPropertyGateway->delete(array('vc_id'=>$vc->vc_id));
					foreach ($data['vc_properties'] as $property_id) {
						$this->linkVcPropertyGateway->save(array(
							'vc_id'       =>$vc->vc_id,
							'property_id' =>$property_id
						));
					}

					// Run implementation-specific code
					$errors = $vcImpl->afterSave();
				}

				
			} catch(\Exception $e) {
				// Add a global error to the error array
				$errors[] = array(
								'field' => 'global',
								'msg'   => $this->handleUnexpectedError($e),
								'extra' => null
							);
			}

			// Commit the transaction if there were no errors
			if (!count($errors)) {
				$this->vcGateway->commit();
			// Otherwise rollback
			} else {
				$this->vcGateway->rollback();
			}
		}

		// return the status of the save along with the errors if any
		return array(
			'success'    => (count($errors)) ? false : true,
			'errors'     => $errors,
			'vc'         => $vc->toArray()
		);
	}

	/**
	 * Returns list of vendor catalog categories
	 * 
	 * @return array Array of catalog categories
	 */
	public function getCategories() {
		return $this->vcCatGateway->find(null, array(), 'vccat_name ASC');
	}

	/**
	 * Returns list of catalog categories assigned to a catalog
	 *
	 * @param  int $vc_id Id of the catalog to get categories for 
	 * @return array      Array of catalog categories
	 */
	public function getAssignedCategories($vc_id) {
		return $this->linkVcVccatGateway->find(array('vc_id'=>'?'), array($vc_id), 'vc.vccat_name', array('vccat_id'));
	}

	/**
	 * Returns list of vendors assigned to a catalog
	 *
	 * @param  int $vc_id Id of the catalog to get vendors for 
	 * @return array      Array of vendor
	 */
	public function getAssignedVendors($vc_id) {
		return $this->linkVcVendorGateway->find(array('vc_id'=>'?'), array($vc_id), 'v.vendor_name', array('vendor_id'));
	}

	/**
	 * Returns list of properties assigned to a catalog
	 *
	 * @param  int $vc_id Id of the catalog to get properties for 
	 * @return array      Array of property Ids
	 */
	public function getAssignedProperties($vc_id) {
		return $this->linkVcPropertyGateway->find(array('vc_id'=>'?'), array($vc_id), 'p.property_name', array('property_id'));
	}

	/**
	 * Returns the path where catalog logos are stored
	 *
	 * @return string The full path to the directory where logos are stored
	 */
	protected function getLogoPath() {
		return "{$this->configService->getAppRoot()}/clients/{$this->configService->getAppName()}/web/images/logos/";
	}

	/**
	 * Returns the path where catalog information PDFs are stored
	 *
	 * @return string The full path to the directory where info PDFs are stored
	 */
	protected function getPdfPath() {
		return "{$this->configService->getAppRoot()}/clients/{$this->configService->getAppName()}/web/exim_uploads/catalog/pdf/";
	}

	/**
	 * Saves a catalog logo
	 *
	 * @param  array $vc A data set based on a catalog entity
	 * @return array     Array with status info on the operation
	 */
	public function saveCatalogLogo($vc) {
		$fileName = null;

		// Create entity// Get entity
		$vc = new VcEntity($vc);

		$destPath = $this->getLogoPath();
		
		// If destination directory doesn't exist, create it
		if (!is_dir($destPath)) {
			mkdir($destPath, 0777, true);
		}

		$this->removeCatalogLogo($vc);

		// Create the upload object
		$fileUpload = new \NP\core\io\FileUpload(
			'logo_file', 
			$destPath, 
			array(
				'allowedTypes'=>array(
					'image/gif',
					'image/jpeg',
					'image/png',
					'image/pjpeg'
				)
			)
		);

		// Do the file upload
		$fileUpload->upload();
		$errors = $fileUpload->getErrors();

		// If there are no errors, run the resize operations and DB updates
		if (!count($errors)) {
			// Resize the image if necessary
			$fileName = $fileUpload->getFile();
			$fileName = $fileName['uploaded_name'];
			\NP\util\Util::resizeImage($this->getLogoPath() . $fileName, 400, 90);

			$this->vcGateway->beginTransaction();

			try {
				$vc->vc_logo_filename = $fileName;

				$this->vcGateway->update($vc);

				$this->vcGateway->commit();
			} catch(\Exception $e) {
				$this->vcGateway->rollback();
				$errors[] = $this->handleUnexpectedError($e);
			}
		}

		return array(
			'success'          => (count($errors)) ? false : true,
			'vc_logo_filename' => $fileName,
			'errors'           => $errors
		);
	}

	/**
	 * Removes a catalog logo
	 *
	 * @param  array $vc A data set based on a catalog entity
	 */
	public function removeCatalogLogo($vc) {
		if (!$vc instanceOf VcEntity) {
			$vc = new VcEntity($vc);
		}
		$old_logo_filename = $vc->vc_logo_filename;

		if ($vc->vc_logo_filename !== null && $vc->vc_logo_filename != '') {
			$logoFilePath = $this->getLogoPath() . $vc->vc_logo_filename;
			unlink($logoFilePath);
		}

		$vc->vc_logo_filename = null;

		$this->vcGateway->update($vc);
	}

	/**
	 * Saves a catalog information PDF
	 *
	 * @param  array $vc A data set based on a catalog entity
	 * @return array     Array with status info on the operation
	 */
	public function saveCatalogPdf($vc) {
		$destPath = $this->getPdfPath();
		
		// If destination directory doesn't exist, create it
		if (!is_dir($destPath)) {
			mkdir($destPath, 0777, true);
		}

		// Create the upload object
		$fileUpload = new \NP\core\io\FileUpload(
			'pdf_file', 
			$destPath, 
			array(
				'fileName'=>"{$vc['vc_id']}.pdf",
				'allowedTypes'=>array('application/pdf')
			)
		);

		// Do the file upload
		$fileUpload->upload();
		$errors = $fileUpload->getErrors();

		return array(
			'success'          => (count($errors)) ? false : true,
			'errors'           => $errors
		);
	}

	/**
	 * Removes a catalog information PDF
	 *
	 * @param  array $vc A data set based on a catalog entity
	 */
	public function removeCatalogPdf($vc) {
		$path = $this->getPdfPath() . $vc['vc_id'] . '.pdf';
		unlink($path);
	}

	/**
	 * Gets items for a specified catalog
	 *
	 * @param  int    $vc_id       Id of the catalog to retrieve items for
	 * @param  string $filter_type How to filter the items (valid values are 'active','inactive','all', and 'category')
	 * @param  string $category    Category to filter by if $filter_type is set to 'category'
	 * @param  int    $pageSize    The number of records per page; if null, all records are returned
	 * @param  int    $page        The page for which to return records
	 * @param  string $sort        Field(s) by which to sort the result; defaults to vendor_category_name
	 * @return array               Array of catalog item records
	 */
	public function getItems($vc_id, $filter_type=null, $category=null, $pageSize=null, $page=1, $sort='vcitem_category_name') {
		return $this->vcItemGateway->findCatalogItems($vc_id, $filter_type, $category, $pageSize, $page, $sort);
	}

	/**
	 * Gets item categories for a specified catalog
	 *
	 * @param  int   $vc_id Id of the catalog to retrieve items categories for
	 * @return array        Array of catalog item categories
	 */
	public function getItemCategories($vc_id) {
		return $this->vcItemGateway->getCategories($vc_id);
	}

	/**
	 * Gets the URL that can be used to view a catalog when using Punchout type
	 *
	 * @param  int  $vc_id              Id of the catalog to retrieve
	 * @param  int    $userprofile_id   Id of the user requesting the Url 
	 * @param  string $property_id_alt  Id of the property the request is being made for
	 * @param  int    $purchaseorder_id An optional purchase order Id that will be used when checking out of catalog to redirect to the appropriate PO
	 * @return array  Status information on the operation
	 */
	public function getPunchoutUrl($vc_id, $userprofile_id, $property_id, $purchaseorder_id=0) {
		// Define the path of the XML file that will be used as a template
		$appRoot = $this->configService->getAppRoot();
		$xmlPath = $appRoot . '/lib/catalog/punchout/punchout.php';

		// Define some local variables to be used by the XML file
		$now = new \DateTime();
		$payloadID = $now->format('YMd') . $now->format('His') . time();
		$timestamp = $now->format('Y-M-d') . $now->format('H:i:s') . '-05:00';

		$vc = $this->vcGateway->findById($vc_id);
		foreach ($vc as $key=>$value) {
			$$key = $value;
		}
		$asp_client_id = $this->configService->getClientId();
		$loginUrl = $this->configService->getloginUrl();
		$property_id_alt = $this->propertyGateway->findById($property_id);
		$property_id_alt = $property_id_alt['property_id_alt'];

		// Include the XML file and store results in a string
		$xmlRequest = include $xmlPath;

		// Do the HTTP POST
		$response = \NP\util\Util::httpRequest($vc['vc_punchout_url'], 'POST', $xmlRequest, array(
            "Content-type: text/xml;charset=\"utf-8\"",
            "Cache-Control: no-cache",
            "Pragma: no-cache",
            "Content-length: ".strlen($xmlRequest)
        ));

		// Initialize some variables
		$url = null;
		$success = $response['success'];
		$errorMsg = "Error running punchout for this URL: {$vc['vc_punchout_url']};\n";

		// If HTTP request was successful, proceed
		if ($success) {
			// Create an XML object with the content of the HTTP request
			$punchoutXML = simplexml_load_string($response['content']);

			// If the content of the request is not XML, log the error
			if (!$punchoutXML) {
				$success = false;
				$errors = libxml_get_errors();
				$errorMsg .= "HTTP request content was as follows:\n{$response['content']}";
			    $this->loggingService->log('catalog', $errorMsg);
			    libxml_clear_errors();
			// If the content of the request is valid XML, proceed
			} else {
				// Get the Status node from the XML document
				$status = $punchoutXML->xpath('/cXML/Response/Status');
				// If the Status node is not found, then the cXML is not valid, log the error 
				if (!count($status)) {
					$success = false;
					$errorMsg .= "Invalid cXML, Status node was not found. cXML was as follows:\n{$response['content']}";
					$this->loggingService->log('catalog', $errorMsg);
				// If the Status node is found, proceed
				} else {
					// Get the status code from the Status node
					$status = $status[0];
					$statusCode = $status->xpath('//@code');
					$statusCode = (string)$statusCode[0];

					// If the code returned is 200, proceed
					if ($statusCode == '200') {
						// Get the punchout session URL from the cXML
						$url = $punchoutXML->xpath('/cXML/Response/PunchOutSetupResponse/StartPage/URL');
						$url = (string)$url[0];
					// If the code returned is not 200, log the error
					} else {
						// Get an error message and/or error details from the cXML
						$success = false;
						$error = $status->xpath('//@text');
						$error = (string)$error[0];
						$errorDetails = (string)$status;
						
						$errorMsg .= "Error: {$error};";
						if ($errorDetails !== '') {
							$errorMsg .= "\nError Details: {$errorDetails}";
						}
						$this->loggingService->log('catalog', $errorMsg);
					}
				}
			}
		// If HTTP Request failed, log the error
		} else {
			$errorMsg .= "Connection failed. This is the connection error: {$reponse['error']}";
			$this->loggingService->log('catalog', $errorMsg);
		}

		// Return the results of the operation
		return array(
			'success' => $success,
			'url'     => $url
		);
	}

	/**
	 * Retrieve catalogs
	 *
	 * @param null $catalog_type
	 * @return mixed
	 */
	public function getCatalogs($catalogType = null) {
		return $this->vcGateway->getCatalogs($catalogType);
	}

	/**
	 * Retrieve categories list
	 *
	 * @param null $userprofile_id
	 * @return mixed
	 */
	public function getCategoriesList($userprofile_id = null) {
		$result = $this->vcCatGateway->getCatalogCategories($userprofile_id);

		return $result;
	}

	/**
	 * Retrieve user's cart summary
	 *
	 * @param bool $userprofile_id
	 * @return array|bool
	 */
	public function getUserCartSummary($userprofile_id = false) {
		return $this->vcOrderGateway->getOrderSummary($userprofile_id);
	}

	/**
	 * Retrieve user's orders
	 *
	 * @param bool $userprofile_id
	 * @return array|bool
	 */
	public function getOrders($userprofile_id = false) {
		return $this->vcOrderGateway->getOrders($userprofile_id);
	}

	/**
	 * Remove order
	 *
	 * @param null $order_id
	 * @return bool
	 */
	public function removeOrder($order_id = null, $userprofile_id = null) {
		return $this->vcOrderGateway->delete(['vcorder_id' => '?', 'userprofile_id' => '?'], [$order_id, $userprofile_id]);
	}

	/**
	 * Update vcorder params (quantity)
	 *
	 * @param null $vcorder
	 * @param null $quantity
	 * @param null $userprofile_id
	 * @return bool
	 */
	public function updateOrders($vcorders = null, $userprofile_id = null) {
		$vcorders = (array)json_decode($vcorders);

		foreach ($vcorders as $vcorder_id => $item) {
			if ($item->value == 0) {
				$result = $this->vcOrderGateway->delete(['vcorder_id' => '?', 'userprofile_id' => '?'], [$vcorder_id, $userprofile_id]);
				if (!$result) {
					throw new \Exception('Can not delete order');
				}
			} else {
				$result = $this->vcOrderGateway->updateQuantity($vcorder_id, $userprofile_id, $item->value);
				if (!$result) {
					throw new \Exception('Can not update order');
				}
			}
		}

		return true;
	}

	/**
	 * Retrieve order's properties list
	 *
	 * @param null $vc_id
	 * @param null $userprofile_id
	 * @param null $delegation_to_userprofile_id
	 * @return array|bool
	 */
	public function getOrderProperties($vc_id = null, $userprofile_id = null, $delegation_to_userprofile_id = null) {
		return $this->propertyGateway->getOrderProperties($vc_id, $userprofile_id, $delegation_to_userprofile_id);
	}

	/**
	 * Retrieve order vendors
	 *
	 * @param null $vc_id
	 * @param null $property_id
	 * @return mixed
	 */
	public function getOrderVendors($vc_id = null, $property_id = null) {
		$result = $this->vcGateway->getOrderVendors($vc_id, $property_id);
		return $result;
	}

	/**
	 * Retrieve order items
	 *
	 * @param null $userprofile_id
	 * @param null $vc_id
	 * @param null $property_id
	 * @param null $vcorder_id
	 * @return array
	 */
	public function getOrderItems($userprofile_id = null, $vc_id = null, $property_id = null, $vcorder_id = null) {
		$usePropGL = $this->configService->getConfig('CP.PROPERTYGLACCOUNT_USE');

		if (!$userprofile_id || !$vc_id || !$property_id) {
			return [];
		}
		$catalog = $this->get($vc_id);

		$items = $this->vcItemGateway->getOrderItems($userprofile_id, $vc_id, $property_id, $vcorder_id, $usePropGL, $catalog['vc_catalogtype']);

		return $items;
	}

	/**
	 * Retrieve vctitem details
	 *
	 * @param null $userprofile_id
	 * @param null $vcitem_id
	 * @return array
	 */
	public function getOrderItemInformation($userprofile_id = null, $vcitem_id = null) {
		if (!$userprofile_id || !$vcitem_id) {
			return [];
		}

		return $this->vcItemGateway->getItemDetails($vcitem_id, $userprofile_id);
	}

	/**
	 * toggle favorites
	 *
	 * @param null $vcitem_id
	 * @param null $userprofile_id
	 * @param bool $add
	 * @return array|bool
	 */
	public function toggleFavorites($vcitem_id = null, $userprofile_id = null, $add = true) {
		if ($add) {
			return $this->vcOrderGateway->addToFavorites($vcitem_id, $userprofile_id);
		} else {
			return $this->vcOrderGateway->deleteFromFavorites($vcitem_id, $userprofile_id);
		}
	}

	/**
	 * Retrieve user's favorite items
	 *
	 * @param null $userprofile_id
	 * @param string $order
	 * @param int $pageSize
	 * @param null $page
	 * @return mixed
	 */
	public function getFavorites($userprofile_id = null, $order = 'vcitem_number', $pageSize = 25, $page = null) {
		return $this->vcItemGateway->getFavorites($userprofile_id, $order, $pageSize, $page);
	}

	/**
	 * Add to order
	 *
	 * @param null $userprofile_id
	 * @param null $vcitem_id
	 * @param int $quantity
	 * @return array|bool
	 */
	public function addToOrder($userprofile_id = null, $vcitem_id = null, $quantity = 1) {
		if (!$userprofile_id ||!$vcitem_id) {
			return [
				'success'	=> false,
				'error'		=> ['field'=>'global', 'msg'=>'Can not add to order', 'extra'=>null]
			];
		}

		return $this->vcOrderGateway->addToOrder($userprofile_id, $vcitem_id, $quantity);
	}

	public function searchItems($userprofile_id = null, $catalogs = null, $field = null, $property = null, $keyword = null, $pageSize = null, $page = 1, $sort = 'vcitem_number') {
		$result = $this->vcItemGateway->searchItems($userprofile_id, $catalogs, $field, $keyword, $property, $pageSize, $page, $sort);

		return $result;
	}

	/**
	 * Return categories list with items count
	 *
	 * @param null $vc_id
	 * @return array
	 */
	public function getCategoriesWithItemsCount($vc_id = null) {
		if (!$vc_id) {
			return [];
		}

		return $this->vcItemGateway->getCategoriesWithItemsCount($vc_id);
	}

	/**
	 * Return brands with items count
	 *
	 * @param null $vc_id
	 * @return array
	 */
	public function getBrandsWithItemsCount($vc_id = null) {
		if (!$vc_id) {
			return [];
		}

		return $this->vcItemGateway->getBrandsWithItemsCount($vc_id);
	}

	/**
	 * Return brands
	 *
	 * @return mixed
	 */
	public function getBrands() {
		$result = $this->vcItemGateway->getBrands();

		return $result;
	}

	public function getItemsByCategoryOrBrand($field = false, $value = false) {
		if (!$field || !$value) {
			return [];
		}


	}
}

?>