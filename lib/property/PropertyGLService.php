<?php

namespace NP\property;


use NP\gl\GLAccountGateway;
use NP\property\PropertyGateway;
use NP\system\BaseImportService;
use NP\system\IntegrationPackageGateway;

class PropertyGLService extends BaseImportService {

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
        $propertyCode = $data['PropertyCode'];
        $glCode = $data['GLCode'];
        $integrationPackageName = $data['IntegrationPackage'];


        $result = $this->integrationPackageGateway->find('integration_package_name = ?', array($integrationPackageName));
        $integrationPackageId = $result[0]['integration_package_id'];
        $property = $this->propertyGateway->findByAltIdAndIntegrationPackage($propertyCode, $integrationPackageId);
        $propertyId = $property['id'];
        $glaccount = $this->glAccountGateway->findByAltIdAndIntegrationPackage($glCode, $integrationPackageId);
        $glaccountId = $glaccount['glaccount_id'];

        $entityData = array(
            'property_id' => $propertyId,
            'glaccount_id' => $glaccountId
        );
        $entity = new $entityClass($entityData);
        $errors = $this->validate($entity);

        // If the data is valid, save it
        if (count($errors) == 0) {
            // Begin transaction
            $this->gateway->beginTransaction();

            try {
                // Save the glaccount record
                $this->gateway->save($entity);
            } catch(\Exception $e) {
                // Add a global error to the error array
                $errors[] = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e), 'extra'=>null);
            }
        }

        if (count($errors)) {
            $this->gateway->rollback();
        } else {
            $this->gateway->commit();
        }
    }
}
