<?php

namespace NP\catalog;

use NP\core\AbstractService;
use NP\core\validation\EntityValidator;
use NP\vendor\VendorGateway;
use NP\util\Util;

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

	protected $vcGateway;
	protected $linkVcitemcatGlGateway;
	protected $linkVcPropertyGateway;
	protected $linkVcVccatGateway;
	protected $linkVcVendorGateway;
	protected $vcItemGateway;
	protected $vcCatGateway;
	protected $vendorGateway;

	/**
	 * @var \NP\system\ConfigService The config service singleton
	 */
	protected $configService;

	/**
	 * @param \NP\catalog\VcGateway              $vcGateway              VcGateway object injected
	 * @param \NP\catalog\LinkVcitemcatGlGateway $linkVcitemcatGlGateway LinkVcitemcatGlGateway object injected
	 * @param \NP\catalog\LinkVcPropertyGateway  $linkVcPropertyGateway  LinkVcPropertyGateway object injected
	 * @param \NP\catalog\LinkVcVccatGateway     $linkVcVccatGateway     LinkVcVccatGateway object injected
	 * @param \NP\catalog\LinkVcVendorGateway    $linkVcVendorGateway    LinkVcVendorGateway object injected
	 * @param \NP\catalog\VcItemGateway          $vcItemGateway          VcItemGateway object injected
	 * @param \NP\catalog\VcCatGateway          $vcItemGateway          VcItemGateway object injected
	 * @param \NP\vendor\VendorGateway           $vendorGateway          VendorGateway object injected
	 */
	public function __construct(VcGateway $vcGateway, LinkVcitemcatGlGateway $linkVcitemcatGlGateway,
								LinkVcPropertyGateway $linkVcPropertyGateway, LinkVcVccatGateway $linkVcVccatGateway,
								LinkVcVendorGateway $linkVcVendorGateway, VcItemGateway $vcItemGateway,
								VcCatGateway $vcCatGateway, VendorGateway $vendorGateway) {
		$this->vcGateway              = $vcGateway;
		$this->linkVcitemcatGlGateway = $linkVcitemcatGlGateway;
		$this->linkVcPropertyGateway  = $linkVcPropertyGateway;
		$this->linkVcVccatGateway     = $linkVcVccatGateway;
		$this->linkVcVendorGateway    = $linkVcVendorGateway;
		$this->vcItemGateway          = $vcItemGateway;
		$this->vcCatGateway           = $vcCatGateway;
		$this->vendorGateway          = $vendorGateway;
	}
	
	/**
	 * Setter function required by DI to set the config service via setter injection
	 * @param \NP\system\ConfigService $configService
	 */
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
		$data['vc_vendors']    = Util::valueList($this->getAssignedVendors($vc_id), 'vendor_id');
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

		// Create an implementation class
		$vcImpl = '\NP\catalog\types\\' . ucfirst($vc->vc_catalogtype);
		$vcImpl = new $vcImpl($this->configService, $vc, $data);

		$vcImpl->isValid();
		$errors = $vcImpl->getErrors();

		// If the data is valid, save it
		if (!count($errors)) {
			// Begin transaction
			$this->vcGateway->beginTransaction();

			try {
				// Add vendor name, tax ID, and created date to the model only if dealing with a new catalog
				if ($vc->vc_id === null) {
					$vendor = $this->vendorGateway->findById($data['vendor_id']);
					$vc->vc_vendorname = $vendor['vendor_name'];
					$vc->vc_unique_id = $vendor['vendor_fedid'];
				}

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
					foreach ($data['vc_vendors'] as $vendor_id) {
						$this->linkVcVendorGateway->save(array(
							'vc_id'     =>$vc->vc_id,
							'vendor_id' =>$vendor_id
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

				// Commit the transaction if there were no errors
				if (!count($errors)) {
					$this->vcGateway->commit();
				// Otherwise rollback
				} else {
					$this->vcGateway->rollback();
				}
			} catch(\Exception $e) {
				// If there was an unexpected error, rollback the transaction
				$this->vcGateway->rollback();
				// Add a global error to the error array
				$errors[] = array('field'=>'global', 'msg'=>"Unexpected error: {$e->getMessage()}; File: {$e->getFile()}; Line: {$e->getLine()}", 'extra'=>null);
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
				$errors[] = 'There was an unexpected error saving the catalog vendor logo.';
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
	 * @param  array  $vc               A data set based on a catalog entity
	 * @param  int    $userprofile_id   Id of the user requesting the Url 
	 * @param  string $property_id_alt  Id of the property the request is being made for
	 * @param  int    $purchaseorder_id An optional purchase order Id that will be used when checking out of catalog to redirect to the appropriate PO
	 * @return array  Status information on the operation
	 */
	public function getPunchoutUrl($vc, $userprofile_id, $property_id_alt, $purchaseorder_id=0) {
		// Define the path of the XML file that will be used as a template
		$appRoot = $this->configService->getAppRoot();
		$xmlPath = $appRoot . '/lib/catalog/punchout/punchout.php';

		// Define some local variables to be used by the XML file
		$now = new \DateTime();
		$payloadID = $now->format('YMd') . $now->format('His') . time();
		$timestamp = $now->format('Y-M-d') . $now->format('H:i:s') . '-05:00';
		foreach ($vc as $key=>$value) {
			$$key = $value;
		}
		$asp_client_id = $this->configService->getClientId();
		$loginUrl = $this->configService->getloginUrl();

		// Include the XML file and store results in a string
		$xmlRequest = include $xmlPath;
		$response = \NP\util\Util::httpRequest($vc['vc_punchout_url'], $xmlRequest, array(
            "Content-type: text/xml;charset=\"utf-8\"",
            "Cache-Control: no-cache",
            "Pragma: no-cache",
            "Content-length: ".strlen($data)
        ));

		return $response;
	}
}

?>