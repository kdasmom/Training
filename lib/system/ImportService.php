<?php

namespace NP\system;

use NP\core\AbstractService;
use \NP\security\SecurityService;
use \NP\core\io\FileUpload;
use NP\core\validation\EntityValidator;
use \NP\gl\GLAccountEntity;
use \ReflectionClass;
use \Pimple as Container;

class ImportService extends AbstractService
{

    /**
     * @var array
     */
    private $uploadMimeTypes = array(
        'text/csv',
        'application/octet-stream',
        'text/comma-separated-values',
        'application/vnd.ms-excel'
    );

    /**
     * @var ConfigService
     */
    protected $configService;

    /**
     * @var SecurityService
     */
    protected $securityService;

    /**
     * @var Container
     */
    protected $di;

    /**
     * @var array
     */
    protected $errors;


    protected $customValidator;

    protected $csvFileRecords = null;

    /**
     * Magic method to get Gateways easy
     *
     * @param $key
     * @return mixed
     */
    public function __get($key)
    {
        return $this->di[$key];
    }

    public function __construct()
    {
        $this->errors = new \ArrayObject();
    }

    /**
     * @param ConfigService $configService set by Pimple di bootstrap
     */
    public function setConfigService(ConfigService $configService)
    {
        $this->configService = $configService;
    }

    /**
     * @param SecurityService $securityService set by Pimple di bootstrap
     */
    public function setSecurityService(SecurityService $securityService)
    {
        $this->securityService = $securityService;
    }

    /**
     * @param Container $di set by Pimple di bootstrap
     */
    public function setPimple(Container $di)
    {
        $this->di = $di;
    }

    /**
     * @param $type
     * @return array
     */
    protected function getImportColumnNames($type)
    {
        $entityClass = $this->getImportEntityClass($type);
        $entity = new $entityClass();
        $fields = $entity->getFields();

        $names = array();
        
        foreach ($fields as $fieldName=>$fieldDef) {
            $names[] = $fieldName;
        }

        return $names;
    }

    /**
     * @param $type
     * @return \NP\core\validation\EntityValidator
     */
    protected function getCustomValidator($type)
    {
        $config = $this->getImportConfig($type);
        if (array_key_exists('key', $config)) {
            $customValidationClass = $config['customValidationClass'];
        } else {
            $customValidationClass = "{$type}ImportEntityValidator";
        }
        
        $validator = $this->{$customValidationClass};

        return $validator;
    }

    protected function getImportEntityClass($type)
    {
        $config = $this->getImportConfig($type);

        if (array_key_exists('entity', $config)) {
            return $config['entity'];
        } else {
            return "NP\\import\\{$type}ImportEntity";
        }
    }

    protected function getImportService($type)
    {
        $config = $this->getImportConfig($type);
        $class = $config['service'];
        return $this->{$class};
    }

    protected function getImportSaveAction($type)
    {
        $config = $this->getImportConfig($type);

        return (array_key_exists('action', $config)) ? $config['action'] : "save{$type}FromImport";
    }

    public function validate($data, $type)
    {
        $entityClass = $this->getImportEntityClass($type);
        $entity = new $entityClass();

        $validator = $this->getCustomValidator($type);
        $hasError = false;
        foreach ($data as $idx=>$rec) {
            $entity->setFields($rec);
            $errors = $validator->validate($entity);
            $data[$idx]['validation_status'] = (count($errors)) ? 'invalid' : 'valid';
            $data[$idx]['validation_errors'] = array();
            foreach ($errors as $error) {
                $data[$idx]['validation_errors'][$error['field']] = $error['msg'];
                $hasError = true;
            }
        }

        $validator->validateCollection($data);

        return $data;
    }


    /**
     * Gets entity fields configuration from JSON configuration file
     *
     * @param $type
     * @return mixed
     */
    protected function getImportEntityConfiguration($type)
    {
        $config = $this->getImportConfig($type);
        return $config['entity'];
    }

    /**
     * Returns the path for upload csv file
     *
     * @return string The full path to the directory where upload csv file
     */
    protected function getUploadPath()
    {
        return "{$this->configService->getAppRoot()}/clients/{$this->configService->getAppName()}/web/exim_uploads/";
    }

    /**
     * Upload CSV file
     *
     * @param  string $file A file name
     * @return array     Array with status info on the operation
     */
    public function uploadCSV($file, $type, $fileFieldName)
    {
        $fileName = null;
        $destinationPath = $this->getUploadPath() . "{$type}/";
        $userProfileId = $this->securityService->getUserId();

        // If destination directory doesn't exist, create it
        if (!is_dir($destinationPath)) {
            mkdir($destinationPath, 0777, true);
        }

        // Create the upload object
        $fileUpload = new FileUpload(
            $fileFieldName, $destinationPath, array(
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

            //Check correct format data in CSV file
            $data = $this->csvFileToArray($this->getUploadPath() . "{$type}/" . $fileName, $type);
            if (array_key_exists('error', $data)) {
                $errors[] = $data['error'];
            }
        }

        return array(
            'success' => (count($errors)) ? false : true,
            'upload_filename' => $fileName,
            'errors' => (array)$errors
        );
    }

    /**
     * Gets all GL accounts from csv file
     *
     * @param  string $file A path to file
     * @return array
     */
    public function getPreview($file = null, $type)
    {
        $data = $this->csvFileToArray($this->getUploadPath() . "{$type}/" . $file, $type);
        
        return $this->validate($data, $type);
    }

    public function accept($file, $type)
    {
        $data = $this->csvFileToArray($this->getUploadPath() . "{$type}/" . $file, $type);
        $data = $this->validate($data, $type);
        $entityClass = $this->getImportEntityClass($type);

        $entity       = new $entityClass($data);
        $service      = $this->getImportService($type);
        $saveFunction = $this->getImportSaveAction($type);

        $success = false;

        $importData = array();
        foreach ($data as $k => $row) {
            if ($row['validation_status'] == 'valid') {
                $importData[] = $row;
            }
        }

        return $service->$saveFunction($importData);
    }

    public function decline($file, $type)
    {
        $path = $this->getUploadPath() . "{$type}/" . $file;

        if (!file_exists($path)) {
            return array('success' => false, 'errors' => array('No file exists'));
        }

        if (!is_writable($path)) {
            return array('success' => false, 'errors' => array('File not writable'));
        }

        return array('success' => !!unlink($path));
    }

    public function getImportConfig($type)
    {
        return json_decode(file_get_contents($this->configService->getAppRoot() . '/config/import/' . $type . '.json'), true);
    }

    /**
     * Convert CSV file fields to array with names mapping
     *
     * @param $file
     * @param $type
     * @return array
     */
    protected function csvFileToArray($file, $type) {
        // We don't want to parse the CSV file every time this is called, only the first time
        if ($this->csvFileRecords === null) {
            $csv = file_get_contents($file);
            $rows = explode("\n", trim($csv));
            array_shift($rows);

            $keys = $this->getImportColumnNames($type);

            if (count($rows)) {
                if (count($keys) != count(str_getcsv($rows[0]))) {
                    return array('error' => $this->localizationService->getMessage('uploadFileCSVFormatError'));
                } else {
                    $this->csvFileRecords = array();
                    
                    foreach ($rows as $row) {
                        $row = str_getcsv($row);

                        foreach ($row as $idx=>$val) {
                            $row[$idx] = trim($val);
                        }

                        $this->csvFileRecords[] = array_combine($keys, $row);
                    }

                    return $this->csvFileRecords;
                }
            } else {
                return array('error' => $this->localizationService->getMessage('uploadFileCSVEmptyError'));
            }
        }
    }

}
