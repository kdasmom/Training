<?php

namespace NP\system;


use NP\system\IntegrationPackageGateway;
use NP\vendor\VendorGateway;
use NP\property\PropertyGateway;
use NP\gl\GLAccountGateway;
use NP\system\BaseImportService;

class SplitService extends BaseImportService {

    protected $gateway, $validator, $integrationPackageGateway, $vendorGateway, $propertyGateway, $glAccountGateway;

    public function __construct
    (
        SplitGateway $gateway,
        SplitEntityValidator $validator,
        IntegrationPackageGateway $integrationPackageGateway,
        VendorGateway $vendorGateway,
        PropertyGateway $propertyGateway,
        GLAccountGateway $glAccountGateway
    )
    {
        $this->gateway = $gateway;
        $this->validator = $validator;
        $this->integrationPackageGateway = $integrationPackageGateway;
        $this->vendorGateway = $vendorGateway;
        $this->propertyGateway = $propertyGateway;
        $this->glAccountGateway = $glAccountGateway;
    }

    /**
     * @param $data array Row array for entity defined in next param
     * @param $entityClass string Entity class to map data
     */
    public function save(\ArrayObject $data, $entityClass)
    {
        $integrationPackage = $data['IntegrationPackage'];
        $vendorCode = $data['VendorCode'];
        $propertyCode = $data['PropertyCode'];
        $glCode = $data['GLCode'];


        $result = $this->integrationPackageGateway->find('integration_package_name = ?', array($integrationPackage));
        $integrationPackageId = $result[0]['integration_package_id'];
        $vendor = $this->vendorGateway->findByAltIdAndIntegrationPackage($vendorCode, $integrationPackageId);
        $vendorId = $vendor['vendor_id'];
        $property = $this->propertyGateway->findByAltIdAndIntegrationPackage($propertyCode, $integrationPackageId);
        $propertyId = $property['id'];
        $glaccount = $this->glAccountGateway->findByAltIdAndIntegrationPackage($glCode, $integrationPackageId);
        $glaccountId = $glaccount['glaccount_id'];
        $createDateTM = substr(date('Y-m-d H:i:s.u'), 0, -3);

        $entityData = array(
            'dfsplit_name' => $data['SplitName'],
            'vendorsite_id' => $vendorId,
            'dfsplit_datetm' => $createDateTM,
            'integration_package_id' => $integrationPackageId
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
