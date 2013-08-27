<?php

namespace NP\invoice;


use NP\gl\GLAccountGateway;
use NP\property\PropertyGateway;
use NP\system\BaseImportService;
use NP\system\IntegrationPackageGateway;

class InvoiceExportService extends BaseImportService {

    /**
     * @var PropertyGlAccountGateway
     */
    protected $gateway;

    /**
     * @var PropertyGateway
     */
    protected $propertyGateway;

    /**
     * @var GlAccountGateway
     */
    protected $glAccountGateway;

    protected $integrationPackageGateway;


    /**
     * @var PropertyGLEntityValidator
     */
    protected $validator;

    public function __construct
    (
        PropertyGlAccountGateway $gateway,
        PropertyGLEntityValidator $validator,
        PropertyGateway $propertyGateway,
        GLAccountGateway $glAccountGateway,
        IntegrationPackageGateway $integrationPackageGateway
    )
    {
        $this->gateway = $gateway;
        $this->validator = $validator;
        $this->propertyGateway = $propertyGateway;
        $this->glAccountGateway = $glAccountGateway;
        $this->integrationPackageGateway = $integrationPackageGateway;
    }

    /**
     * @param $data array Row array for entity defined in next param
     * @param $entityClass string Entity class to map data
     */
    public function save(\ArrayObject $data, $entityClass)
    {
       
    }
}
