<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/20/13
 * Time: 10:54 AM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\system;


abstract class BaseImportServiceEntityValidator {

    /**
     * @var \NP\system\ConfigService The config service singleton
     */
    protected $configService;

    protected $localizationService;

    /**
     * Setter function required by DI to set the config service via setter injection
     * @param \NP\system\ConfigService $configService
     */
    public function setConfigService(\NP\system\ConfigService $configService) {
        $this->configService = $configService;
    }

    public function setLocalizationService(\NP\locale\LocalizationService $localizationService)
    {
        $this->localizationService = $localizationService;
    }

    /**
     * @param $row array Row array to validate
     * @param $errors array Errors array
     * @return mixed
     */
    abstract public function validate(&$row, &$errors);
}
