<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/27/13
 * Time: 3:20 PM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\vendor;


use NP\system\BaseImportService;

class VendorGLService extends BaseImportService
{

    /**
     * @var VendorGLGateway
     */
    protected $gateway;

    public function __construct(VendorGLGateway $gateway)
    {
        $this->gateway = $gateway;
    }
    /**
     * This must be implemented in child class.
     * Method accept row and entity class to save in related gateway.
     *
     * @param \ArrayObject $data Row array for entity defined in next param
     * @param string $entityClass Entity class to map data
     */
    public function save(\ArrayObject $row, $entityClass)
    {
        $vendorName = $row['VendorCode'];
        $glCodes = $row['GLCodes'];
        $integrationPackageName = $row['Integration Package'];

        $query = "SELECT integration_package_id FROM integrationpackage WHERE integration_package_name = ?";
        $result = $this->gateway->adapter->query($query, array($integrationPackageName));
        $integrationPackageId = !empty($result[0])?$result[0]['integration_package_id']:null;

        $query = "SELECT vendor_id FROM vendor WHERE vendor_id_alt = ? AND integration_package_id = ?";
        $result = $this->gateway->adapter->query($query, array($vendorName, $integrationPackageId));
        $vendorId = !empty($result[0])?$result[0]['vendor_id']:null;

        $query = "SELECT glaccount_id FROM glaccount WHERE glaccount_number = ?";
        $result = $this->gateway->adapter->query($query, array($glCodes));
        $glaccountId = !empty($result[0])?$result[0]['glaccount_id']:null;

        $query = "INSERT INTO VENDORGLACCOUNTS(vendor_id, glaccount_id) VALUES(?, ?)";
        $result = $this->gateway->adapter->query($query, array($vendorId, $glaccountId));

    }
}
