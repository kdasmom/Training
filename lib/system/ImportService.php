<?php

namespace NP\system;


use \NP\core\io\FileUpload;
use \NP\core\validation\ExtendedEntityValidator as EntityValidator;
use \NP\gl\GLAccountEntity;
use \ReflectionClass;

class ImportService  extends BaseImportService {



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
    public function validate(&$data, $type)
    {
        $entity = new VirtualEntity($this->getImportEntityConfiguration($type), $data);

        // Run validation
        $validator = new ExtendedEntityValidator();
        $validator->validate($entity);
        $this->errors = array_merge($this->errors, $validator->getErrors());

        if($this->getImportCustomValidationFlag($type))
        {
            $gateway = $this->getImportGateway($type);
            foreach($data as $key => $row) {
                $gateway->validateImportEntity($data[$key], $this->errors);
            }
        }
    }

    /**
     * Upload CSV file
     *
     * @param  string $file A file name
     * @return array     Array with status info on the operation
     */

    public function uploadCSV($file) {
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
                'fileName' => time() . $userProfileId . '.csv'
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

    public function getPreview($file = null, $type, $pageSize = null, $page = 1, $sortBy = 'glaccountName') {
        $data = $this->csvFileToArray($this->getUploadPath() . $file, $type);
        $this->validate($data, $type);
        return array('data' => $data);
    }

    public function accept($file, $type) {

        $data = $this->csvFileToArray($this->getUploadPath() . $file, $type);
        $this->validate($data, $type);

        $gateway = $this->getImportGateway($type);
        $gateway->save($data, $this->errors);
        $gateway->postSave();

        return array(
            'success'        => (count($this->errors)) ? false : true,
            'errors'         => $this->errors
        );

    }

    public function decline($file)
    {
        if(!file_exists($this->getUploadPath() . $file)) {
            return array('success' => false, 'errors' => array('No file exists'));
        }

        if(!is_writable($this->getUploadPath() . $file)) {
            return array('success' => false, 'errors' => array('File not writable'));
        }

        return array('success' => !!unlink($this->getUploadPath() . $file));
    }

    public function getImportConfig($type)
    {
        return json_decode(file_get_contents($this->configService->getAppRoot() . '/config/import/' . $type), true);
    }


}
