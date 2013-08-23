<?php

namespace NP\property;


use NP\gl\GLAccountGateway;
use NP\property\PropertyGateway;
use NP\system\BaseImportService;
use NP\system\IntegrationPackageGateway;

class UnitService extends BaseImportService {

    /**
     * @var UnitGateway
     */
    protected $gateway;

    /**
     * @var PropertyGateway
     */
    protected $propertyGateway;

    /**
     * @var UnitTypeGateway
     */
    protected $unitTypeGateway;

    protected $integrationPackageGateway;


    /**
     * @var UnitEntityValidator
     */
    protected $validator;

    public function __construct
    (
        UnitGateway $gateway,
        UnitEntityValidator $validator,
        PropertyGateway $propertyGateway,
        UnitTypeGateway $unitTypeGateway,
        IntegrationPackageGateway $integrationPackageGateway
    )
    {
        $this->gateway = $gateway;
        $this->validator = $validator;
        $this->propertyGateway = $propertyGateway;
        $this->unitTypeGateway = $unitTypeGateway;
        $this->integrationPackageGateway = $integrationPackageGateway;
    }

    /**
     * @param $data array Row array for entity defined in next param
     * @param $entityClass string Entity class to map data
     */
    public function save(\ArrayObject $data, $entityClass)
    {
        $integrationPackageName = $data['IntegrationPackage'];
        $propertyCode = $data['PropertyCode'];
        $type = $data['Type'];


        $result = $this->integrationPackageGateway->find('integration_package_name = ?', array($integrationPackageName));
        $integrationPackageId = $result[0]['integration_package_id'];
        $property = $this->propertyGateway->findByAltIdAndIntegrationPackage($propertyCode, $integrationPackageId);
        $propertyId = $property['id'];
        $unitType = $this->unitTypeGateway->findByAltId($type);
        $unitTypeId = $unitType['id'];

        $entityData = array(
            'property_id' => $propertyId,
            'unittype_id' => $unitTypeId,
            'unit_number' => $data['Name'],
            
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
