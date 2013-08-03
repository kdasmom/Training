<?php

namespace NP\gl;

use NP\core\AbstractService;
use NP\core\validation\EntityValidator;
use NP\core\db\Select;
use NP\exim\EximGLAccountEntity;
use NP\exim\EximGLAccountGateway;

/**
 * All operations that are closely related to GL accounts belong in this service
 *
 * @author Thomas Messier
 */
class GLService extends AbstractService {
	
	/**
	 * @var \NP\gl\GLAccountGateway
	 */
	protected $glaccountGateway, $configService, $eximglaccountGateway;
        	
	/**
	 * @param \NP\gl\GLAccountGateway $glaccountGateway GLAccount gateway injected
	 */
	public function __construct(GLAccountGateway $glaccountGateway, EximGLAccountGateway $eximglaccountGateway) {
		$this->glaccountGateway = $glaccountGateway;
                $this->eximglaccountGateway = $eximglaccountGateway;
	}
	
	public function setConfigService(\NP\system\ConfigService $configService) {
		$this->configService = $configService;
	}
	
	/**
	 * Retrieves records from GLAccount table that display in an invoice line item combo box matching a
	 * specific vendor, property, and keyword (basically to be used by an autocomplete combo as someody
	 * types into it)
	 * 
	 * @param  int    $vendorsite_id
	 * @param  int    $property_id
	 * @param  string $glaccount_keyword
	 * @return array
	 */
	public function getForInvoiceItemComboBox($vendorsite_id, $property_id, $glaccount_keyword='') {
		return $this->glaccountGateway->findForInvoiceItemComboBox($vendorsite_id, $property_id, $glaccount_keyword);
	}
	
	/**
	 * Gets all GL accounts that belong to a specified integration package
	 *
	 * @param  int   $integration_package_id The integration package to get GL accounts for
	 * @return array                         Array of GL account records
	 */
	public function getByIntegrationPackage($integration_package_id) {
		return $this->glaccountGateway->findByIntegrationPackage($integration_package_id);
	}
	
	protected function csvFileToJson($file) {
		$csv = file_get_contents($file);
		$rows = explode("\n", trim($csv));
		array_shift($rows);
		$csvarr = array_map(function ($row) {
			$keys = array('exim_glaccountName','exim_glaccountNumber','exim_accountType',
                            'exim_categoryName','exim_integrationPackage');
			return array_combine($keys, str_getcsv($row));
		}, $rows);
			
		return $csvarr;
	}
	
	/**
	 * Gets all GL accounts from csv file
	 *
	 * @param  string $file A path to file
	 * @return array
	 */
	public function getCSVFile($file=null, $pageSize=null, $page=1, $sort='glaccount_name') {
		$data = $this->csvFileToJson($this->getUploadPath() . $file);
                
                foreach ($data as $key => $value) {
                    // Get entities
                    $glaccount     = new EximGLAccountEntity($value);

                    // Run validation
                    $validator = new EntityValidator();
                    $validator->validate($glaccount);
                    $errors    = $validator->getErrors();
                    if (count($errors)) {
                        $data[$key]['exim_status'] = 'Invalid';
                    } else {
                        $data[$key]['exim_status'] = 'Valid';
                    }
                }
		return array('data'=>$data);
	}
	
	/**
	 * Returns the path for upload csv file
	 *
	 * @return string The full path to the directory where upload csv file
	 */
	protected function getUploadPath() {
		return "{$this->configService->getAppRoot()}/clients/{$this->configService->getAppName()}/exim_uploads/import/csv/";
	}
	
	/**
	 * Upload CSV file
	 *
	 * @param  string $file A file name
	 * @return array     Array with status info on the operation
	 */
	public function uploadCSV($file) {
		$fileName = null;
		$destPath = $this->getUploadPath();
		
		// If destination directory doesn't exist, create it
		if (!is_dir($destPath)) {
			mkdir($destPath, 0777, true);
		}

		// Create the upload object
		$fileUpload = new \NP\core\io\FileUpload(
			'file_upload_category', 
			$destPath, 
			array(
				'allowedTypes'=>array(
					'text/csv'
				),
					'fileName' => 'glCategories_' . time() . '.csv'
			)
		);

		// Do the file upload
		$fileUpload->upload();
		$errors = $fileUpload->getErrors();

		// If there are no errors, run the resize operations and DB updates
		if (!count($errors)) {
			$fileName = $fileUpload->getFile();
			$fileName = $fileName['uploaded_name'];
		}

		return array(
			'success'          => (count($errors)) ? false : true,
			'upload_filename'  => $fileName,
			'errors'           => $errors
		);
	}
        
        	public function saveCSV($account) {		
		$errors = array();
		$exim_glaccount_id = null;
                $this->eximglaccountGateway->beginTransaction();

		try {
			$res = $this->saveAccount($account);
			$errors = $res['errors'];
			$exim_glaccount_id = $res['exim_glaccount_id'];
                        
		} catch(\Exception $e) {
			// Add a global error to the error array
			$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
		}

		if (count($errors)) {
			$this->eximglaccountGateway->rollback();
		} else {
			$this->eximglaccountGateway->commit();
		}

		return array(
			'success'        => (count($errors)) ? false : true,
			'errors'         => $errors,
			'exim_glaccount_id'   => $exim_glaccount_id
		);
	}
        
	public function saveAccount($data) {
		// Get entities
                unset($data['glaccount_status']);
		$exim_glaccount     = new \NP\exim\EximGLAccountEntity($data);
		
		// Run validation
		$validator = new EntityValidator();
		$validator->validate($exim_glaccount);
		$errors    = $validator->getErrors();

		// If the data is valid, save it
		if (count($errors) == 0) {
			// Begin transaction
			$this->eximglaccountGateway->beginTransaction();

			try {
				// Save the glaccount record
				$this->eximglaccountGateway->save($exim_glaccount);

			} catch(\Exception $e) {
				// Add a global error to the error array
				$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
			}
		}

		if (count($errors)) {
			$this->eximglaccountGateway->rollback();
		} else {
			$this->eximglaccountGateway->commit();
		}

		return array(
			'success'        => (count($errors)) ? false : true,
			'errors'         => $errors,
			'exim_glaccount_id' => $exim_glaccount->exim_glaccount_id
		);
	}

}

?>