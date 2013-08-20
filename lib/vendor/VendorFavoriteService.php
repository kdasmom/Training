<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/20/13
 * Time: 10:47 AM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\vendor;


use NP\gl\GLAccountGateway;
use NP\property\PropertyGateway;
use NP\system\BaseImportService;
use NP\system\IntegrationPackageGateway;

class VendorFavoriteService extends BaseImportService {

    /**
     * @var VendorFavoriteGateway
     */
    protected $gateway;

    /**
     * @var PropertyGateway
     */
    protected $propertyGateway;

    /**
     * @var VendorGateway
     */
    protected $vendorGateway;

    protected $integrationPackageGateway;


    /**
     * @var VendorFavoriteEntityValidator
     */
    protected $validator;

    public function __construct
    (
        VendorFavoriteGateway $gateway,
        VendorFavoriteEntityValidator $validator,
        PropertyGateway $propertyGateway,
        VendorGateway $vendorGateway,
        IntegrationPackageGateway $integrationPackageGateway
    )
    {
        $this->gateway = $gateway;
        $this->validator = $validator;
        $this->propertyGateway = $propertyGateway;
        $this->vendorGateway = $vendorGateway;
        $this->integrationPackageGateway = $integrationPackageGateway;
    }

    /**
     * @param $data array Row array for entity defined in next param
     * @param $entityClass string Entity class to map data
     */
    public function save(\ArrayObject $data, $entityClass)
    {
        $vendorCode = $data['VendorCode'];
        $propertyCode = $data['PropertyCode'];
        $integrationPackageName = $data['IntegrationPackage'];


        $result = $this->integrationPackageGateway->find('integration_package_name = ?', array($integrationPackageName));
        $integrationPackageId = $result[0]['integration_package_id'];
        $property = $this->propertyGateway->findByAltIdAndIntegrationPackage($propertyCode, $integrationPackageId);
        $propertyId = $property['id'];
        $vendor = $this->vendorGateway->findByAltIdAndIntegrationPackage($vendorCode, $integrationPackageId);
        $vendorId = $vendor['vendor_id'];

        $entityData = array(
            'property_id' => $propertyId,
            'vendorsite_id' => $vendorId
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
