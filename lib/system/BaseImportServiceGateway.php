<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/20/13
 * Time: 11:09 AM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\system;


use NP\core\AbstractGateway;

abstract class BaseImportServiceGateway extends AbstractGateway {
    /**
     * @var \NP\system\ConfigService The config service singleton
     */
    protected $configService;

    /**
     * @var \NP\locale\LocalizationService
     */
    protected $localizationService;

    /**
     * Setter function required by DI to set the config service via setter injection
     * @param \NP\system\ConfigService $configService
     */
    public function setConfigService(\NP\system\ConfigService $configService)
    {
        $this->configService = $configService;
    }

    public function setLocalizationService(\NP\locale\LocalizationService $localizationService)
    {
        $this->localizationService = $localizationService;
    }
}
