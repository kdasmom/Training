<?php

/**

 * Created by JetBrains PhpStorm.

 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com

 * Date: 8/7/13

 * Time: 8:11 PM

 * To change this template use File | Settings | File Templates.

 */

namespace NP\system;

use \NP\system\ConfigService;
use \NP\security\SecurityService;
use \NP\core\AbstractService;
use \ReflectionClass;

abstract class BaseImportService extends AbstractService {

    /**

     * @var ConfigService

     */
    protected $configService;

    /**

     * @var SecurityService

     */
    protected $securityService;

    /**

     * @var Pimple

     */
    protected $di;

    /**

     * @var array

     */
    protected $errors = array();

    /**

     * Magic method to get Gateways easy

     *

     * @param $key

     * @return mixed

     */
    public function __get($key) {

        return $this->di[$key];
    }

    /**

     * @param ConfigService $configService set by Pimple di bootstrap

     */
    public function setConfigService(ConfigService $configService) {

        $this->configService = $configService;
    }

    /**

     * @param SecurityService $securityService set by Pimple di bootstrap

     */
    public function setSecurityService(SecurityService $securityService) {

        $this->securityService = $securityService;
    }

    /**

     * @param \Pimple $di set by Pimple di bootstrap

     */
    public function setPimple(\Pimple $di) {

        $this->di = $di;
    }

    protected function getImportColumnNames($type) {

        $names = array();

        $config = $this->getImportConfig($type);

        foreach ($config['columns'] as $column) {

            $names[] = $column['name'];
        }

        return $names;
    }

    protected function getImportDBColumnNames($type) {

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
    protected function getImportCustomValidationFlag($type) {

        $config = $this->getImportConfig($type);

        return !!$config['customValidation'];
    }

    /**

     * Get related gateway to make saving and validation

     *

     * @param $type

     * @return mixed

     */
    protected function getImportGateway($type) {

        $config = $this->getImportConfig($type);

        $gatewayClass = $config['gateway'];

        $gateway = $this->{$gatewayClass};


        $gatewayReflection = new ReflectionClass($gateway);


        // Inject the DI if gateway need it

        if ($gatewayReflection->hasMethod('setDI')) {

            $gateway->setDI($this->di);
        }


        return $gateway;
    }

    /**

     * Gets entity fields configuration from JSON configuration file

     *

     * @param $type

     * @return mixed

     */
    protected function getImportEntityConfiguration($type) {

        $config = $this->getImportConfig($type);

        return $config['entity'];
    }

    /**

     * Returns the path for upload csv file

     *

     * @return string The full path to the directory where upload csv file

     */
    protected function getUploadPath() {

        return "{$this->configService->getAppRoot()}/clients/{$this->configService->getAppName()}/web/exim_uploads/";
    }

    /**

     * Convert CSV file fields to array with names mapping

     *

     * @param $file

     * @param $type

     * @return array

     */
    protected function csvFileToArray($file, $type) {

        $csv = file_get_contents($file);

        $rows = explode("\n", trim($csv));

        array_shift($rows);


        $keys = $this->getImportColumnNames($type);


        $csvArray = array_map(function ($row) use ($keys) {

                    return array_combine($keys, str_getcsv($row));
                }, $rows);


        return $csvArray;
    }

}
