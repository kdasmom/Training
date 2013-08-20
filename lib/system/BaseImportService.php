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
use \NP\core\AbstractEntity;
use \NP\core\validation\EntityValidator;

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

    public function preSave()
    {

    }

    public function postSave()
    {

    }

    /**
     * This must be implemented in child class.
     * Method accept row and entity class to save in related gateway.
     *
     * @param \ArrayObject $data Row array for entity defined in next param
     * @param string $entityClass Entity class to map data
     */
    abstract public function save(\ArrayObject $data, $entityClass);

    /**
     * @param AbstractEntity $entity
     * @return \ArrayObject
     */
    public function validate(AbstractEntity $entity)
    {
        // Run validation
        $validator = new EntityValidator();
        $validator->validate($entity);

        return $validator->getErrors();
    }

}
