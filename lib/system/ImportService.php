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
    protected $errors = array();


    protected $customValidator;

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
        $names = array();
        $config = $this->getImportConfig($type);
        foreach ($config['columns'] as $column) {
            $names[] = $column['name'];
        }
        return $names;
    }

    protected function getImportDBColumnNames($type)
    {
        $names = array();
        $config = $this->getImportConfig($type);
        foreach ($config['columns'] as $column) {
            $names[$column['name']] = $column['entityField'];
        }
        return $names;
    }

    /**
     * Detect if custom validation exists
     *
     * @param $type
     * @return bool
     */
    protected function getImportCustomValidationFlag($type)
    {
        $config = $this->getImportConfig($type);
        return !!$config['customValidation'];
    }

    protected function getCustomValidator($type)
    {
        $config = $this->getImportConfig($type);
        $customValidationClass = $config['customValidationClass'];
        $validator = $this->{$customValidationClass};

        $validatorReflection = new ReflectionClass($validator);

        // Inject the DI if gateway need it
        if ($validatorReflection->hasMethod('setDI')) {
            $validator->setDI($this->di);
        }

        return $validator;
    }

    protected function getImportEntityClass($type)
    {
        $config = $this->getImportConfig($type);
        return $config['entity'];
    }

    protected function getImportService($type)
    {
        $config = $this->getImportConfig($type);
        $class = $config['service'];
        return $this->{$class};
    }

    public function validate(&$data, $type)
    {
        $entityClass = $this->getImportEntityClass($type);
        $entity = new $entityClass($data);

        $validator = new EntityValidator();
        $validator->validate($entity);

        $this->errors = array_merge($this->errors, $validator->getErrors());

        if ($this->getImportCustomValidationFlag($type)) {
            $validator = $this->getCustomValidator($type);
            foreach ($data as $key => $row) {
                $validator->validate($data[$key], $this->errors);
            }
        }
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
        return "{$this->configService->getAppRoot()}/clients/{$this->configService->getAppName()}/csv_uploads/";
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
            //var_dump($data);
            if (isset($data[0]['errors'])) {
                $errors[] = $data[0]['errors'] . $type;
            }
        }

        return array(
            'success' => (count($errors)) ? false : true,
            'upload_filename' => $fileName,
            'errors' => $errors
        );
    }

    /**
     * Gets all GL accounts from csv file
     *
     * @param  string $file A path to file
     * @return array
     */
    public function getPreview($file = null, $type, $pageSize = null, $page = 1, $sortBy = 'glaccount_name')
    {
        $data = $this->csvFileToArray($this->getUploadPath() . "{$type}/" . $file, $type);
        $this->validate($data, $type);
        return array('data' => $data);
    }

    public function accept($file, $type)
    {
        $data = $this->csvFileToArray($this->getUploadPath() . "{$type}/" . $file, $type);
        $this->validate($data, $type);
        $entityClass = $this->getImportEntityClass($type);

        /**
         * @var $entity \NP\core\AbstractEntity
         */
        $entity = new $entityClass($data);
        $service = $this->getImportService($type);

        foreach ($data as $k => $row) {

            if ($row['validation_status'] == 'valid') {

                /**
                 * Hack to update glaccount_updateby
                 */
                if ($entity->hasField('glaccount_updateby')) {
                    $data[$k]['glaccount_updateby'] = $this->securityService->getUserId();
                }
                if ($entity->hasField('UserProfile_ID')) {
                    $data[$k]['UserProfile_ID'] = $this->securityService->getUserId();
                }
                $service->save($data[$k], $entityClass);
            }
        }


        return array(
            'success' => (count($this->errors)) ? false : true,
            'errors' => $this->errors
        );
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
    protected function csvFileToArray($file, $type)
    {
        $csv = file_get_contents($file);
        $rows = explode("\n", trim($csv));
        array_shift($rows);

        $keys = $this->getImportColumnNames($type);

        $csvArray = array_map(function ($row) use ($keys) {
            if (count($keys) != count(str_getcsv($row))) {
                return array('errors' => $this->localizationService->getMessage('uploadFileCSVFormatError'));
            } else {
                return array_combine($keys, str_getcsv($row));                    
            } 
        }, $rows);

        return $csvArray;
    }

}
