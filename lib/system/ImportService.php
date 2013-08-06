<?php

namespace NP\system;

use \NP\core\AbstractService;
use \NP\system\ConfigService;
use \NP\security\SecurityService;
use \NP\core\io\FileUpload;

abstract class ImportService  extends AbstractService {

    /**
     * @var ConfigService
     */
    protected $configService;

    /**
     * @var SecurityService
     */
    protected $securityService;

    /**
     * @var array
     */
    private $uploadMimeTypes = array(
        'text/csv',
        'application/octet-stream',
        'text/comma-separated-values',
        'application/vnd.ms-excel'
    );

    // Force Extending class to define this method to be abel to validate CSV file
    abstract protected function validate(&$data);

    /**
     * Returns the path for upload csv file
     *
     * @return string The full path to the directory where upload csv file
     */
    protected function getUploadPath() {
        return "{$this->configService->getAppRoot()}/clients/{$this->configService->getAppName()}/gl_account_csv_uploads/";
    }

    public function setConfigService(ConfigService $configService) {
        $this->configService = $configService;
    }

    public function setSecurityService(SecurityService $securityService) {
        $this->securityService = $securityService;
    }

    /**
     * Upload CSV file
     *
     * @param  string $file A file name
     * @return array     Array with status info on the operation
     */
    public function uploadFile($file) {
        $fileName = null;
        $destinationPath = $this->getUploadPath();
        $userProfileId = $this->securityService->getUserId();

        // If destination directory doesn't exist, create it
        if (!is_dir($destinationPath)) {
            mkdir($destinationPath, 0777, true);
        }

        // Create the upload object
        $fileUpload = new FileUpload (
            'file_upload_category',
            $destinationPath,
            array(
                'allowedTypes' => $this->uploadMimeTypes,
                'fileName' => 'glCategories_' . time() . $userProfileId . '.csv'
            )
        );

        // Do the file upload
        $fileUpload->upload();
        $errors = $fileUpload->getErrors();
        foreach ($errors as $k => $v) {
                    $errors[$k] = $this->localizationService->getMessage($v);
        }
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

    /**
     * Gets all GL accounts from csv file
     *
     * @param  string $file A path to file
     * @return array
     */
    public function getCSVFile($file=null, $pageSize=null, $page=1, $sort='glaccountName') {
        $data = $this->csvFileToArray($this->getUploadPath() . $file);
        $this->validate($data);
        return array('data' => $data);
    }

    protected function csvFileToArray($file) {
        $csv = file_get_contents($file);
        $rows = explode("\n", trim($csv));
        array_shift($rows);
        $csvArray = array_map(function ($row) {
            $keys = array(
                'glaccount_name',
                'glaccount_number',
                'account_type_name',
                'category_name',
                'integration_package_name'
            );
            return array_combine($keys, str_getcsv($row));
        }, $rows);

        return $csvArray;
    }

}
