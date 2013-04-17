<?php

namespace NP\catalog;

use NP\core\AbstractService;
use NP\core\validation\EntityValidator;
use NP\vendor\VendorGateway;

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

	/**
	 * @var \NP\catalog\VcGateway
	 */
	protected $vcGateway;
	protected $linkVcitemcatGlGateway;
	protected $linkVcPropertyGateway;
	protected $linkVcVccatGateway;
	protected $linkVcVendorGateway;
	protected $vcItemGateway;
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
	 * @param \NP\vendor\VendorGateway          $vendorGateway          VendorGateway object injected
	 */
	public function __construct(VcGateway $vcGateway, LinkVcitemcatGlGateway $linkVcitemcatGlGateway,
								LinkVcPropertyGateway $linkVcPropertyGateway, LinkVcVccatGateway $linkVcVccatGateway,
								LinkVcVendorGateway $linkVcVendorGateway, VcItemGateway $vcItemGateway,
								VendorGateway $vendorGateway) {
		$this->vcGateway              = $vcGateway;
		$this->linkVcitemcatGlGateway = $linkVcitemcatGlGateway;
		$this->linkVcPropertyGateway  = $linkVcPropertyGateway;
		$this->linkVcVccatGateway     = $linkVcVccatGateway;
		$this->linkVcVendorGateway    = $linkVcVendorGateway;
		$this->vcItemGateway          = $vcItemGateway;
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
	 * @param  int $vc_id Id of the catalog to retrieve
	 * @return array      A catalog record
	 * 
	 */
	public function get($vc_id) {
		return $this->vcGateway->findById($vc_id);
	}

	/**
	 * Returns vendor catalogs
	 * 
	 * @param  string|int $vc_status A status or list of statuses; valid statuses are 1 (active), 0 (inactive), and -1 (pending)
	 * @param  int        $pageSize  The number of records per page; if null, all records are returned
	 * @param  int        $page      The page for which to return records
	 * @param  string     $sort      Field(s) by which to sort the result; defaults to vendor_name
	 * @return array                 Array of catalog records
	 * 
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
		$this->vcGateway->update(array('vc_id'=>$vc_id, 'vc_status'=>$vc_status));
	}

	/**
	 * Deletes a catalog (can only be used on pending catalogs)
	 *
	 * @param  int $vc_id The ID of the catalog to delete
	 */
	public function deleteCatalog($vc_id) {
		// Begin transaction
		$adapter = $this->vcGateway->getAdapter();
		$adapter->beginTransaction();
		
		try {
			$this->linkVcPropertyGateway->delete(array('vc_id'=>$vc_id));
			$this->linkVcVccatGateway->delete(array('vc_id'=>$vc_id));
			$this->linkVcVendorGateway->delete(array('vc_id'=>$vc_id));
			$this->linkVcitemcatGlGateway->delete(array('vc_id'=>$vc_id));
			$this->vcGateway->delete(array('vc_id'=>$vc_id));

			$adapter->commit();
		} catch (Exception $e) {
			$adapter->rollback();
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
		// Get entities
		$vc = new \NP\catalog\VcEntity($data['vc']);

		// If dealing with a new catalog, do some pre-processing
		if ($vc->vc_id === null) {
			// If a new Excel catalog, change the status to -2 for "Processing"
			if ($vc->vc_catalogtype == 'excel') {
				$vc->vc_status = -2;
			}
		}

		// Run validation
		$validator = new EntityValidator();
		$validator->validate($vc);
		$errors = $validator->getErrors();

		// If the data is valid, save it
		if (count($errors) == 0) {
			// Begin transaction
			$adapter = $this->vcGateway->getAdapter();
			$adapter->beginTransaction();

			try {
				// Add vendor name, tax ID, and created date to the model only if dealing with a new catalog
				if ($vc->vc_id === null) {
					$vendor = $this->vendorGateway->findById($data['vendor_id']);
					$vc->vc_createdt = $now;
					$vc->vc_vendorname = $vendor['vendor_name'];
					$vc->vc_unique_id = $vendor['vendor_fedid'];
				}

				// Add dates to the model
				$now = \NP\util\Util::formatDateForDB();
				$vc->vc_lastupdatedt = $now;

				// Save the userprofile record
				$this->vcGateway->save($vc);
				
				// If dealing with an Excel catalog, deal with the file to be processed
				if ($vc->vc_catalogtype == 'excel' || $vc->vc_catalogtype == 'pdf') {
					$destPath = "{$this->configService->getAppRoot()}/clients/{$this->configService->getAppName()}/web/exim_uploads/catalog/";
					// If destination directory doesn't exist, create it
					if (!is_dir($destPath)) {
						mkdir($destPath, 0777, true);
					}

					if ($vc->vc_catalogtype == 'excel') {
						$allowedTypes = array(
							'application/excel',
							'application/vnd.ms-excel',
							'application/vnd.msexcel',
							'application/octet-stream'
						);
						$extension = 'xls';
					} else {
						$allowedTypes = array('application/pdf');
						$extension = 'pdf';
					}

					// Create the upload object
					$fileUpload = new \NP\core\io\FileUpload(
						'catalog_file', 
						$destPath, 
						array(
							'fileName'=>"vc_{$vc->vc_id}.{$extension}",
							'allowedTypes'=>$allowedTypes
						)
					);

					// Do the file upload
					if (!$fileUpload->upload()) {
						$adapter->rollback();
						$fileErrors = $fileUpload->getErrors();
						foreach ($fileErrors as $error) {
							$errors[] = array('field'=>'catalog_file', 'msg'=>$error, 'extra'=>null);
						}
					}
				}

				// Commit the transaction
				$adapter->commit();
			} catch(\Exception $e) {
				// If there was an error, rollback the transaction
				$adapter->rollback();
				// Add a global error to the error array
				$errors[] = array('field'=>'global', 'msg'=>"Unexpected error: {$e->getMessage()}; File: {$e->getFile()}; Line: {$e->getLine()}", 'extra'=>null);
			}
		}

		return array(
			'success'    => (count($errors)) ? false : true,
			'errors'     => $errors,
		);
	}

}

?>