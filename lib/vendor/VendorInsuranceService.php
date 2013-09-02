<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/27/13
 * Time: 11:22 AM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\vendor;


use NP\system\BaseImportService;

class VendorInsuranceService extends BaseImportService
{

    /**
     * @var VendorInsuranceGateway
     */
    protected $gateway;

    public function __construct(VendorInsuranceGateway $gateway)
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
        $integrationPackageName = $row['Integration Package Name'];
        $vendorName = $row['Vendor ID'];
        $insuranceTypeName = $row['Insurance Type'];
        $companyName = $row['Company'];
        $policyNumber = $row['Policy Number'];
        $effectiveDate = date('m-d-Y', strtotime($row['Effective Date']));
        $expirationDate = date('m-d-Y', strtotime($row['Expiration Date']));
        $policyLimit = $row['Policy Limit'];
        $additionalInsured = $row['Additional Insured'];
        $propertyName = $row['Property ID'];

        $query = "SELECT integration_package_id FROM integrationpackage WHERE integration_package_name = ?";
        $result = $this->gateway->adapter->query($query, array($integrationPackageName));
        $integrationPackageId = !empty($result[0])?$result[0]['integration_package_id']:null;

        $query = "SELECT vendor_id FROM vendor WHERE vendor_id_alt = ? AND integration_package_id = ?";
        $result = $this->gateway->adapter->query($query, array($vendorName, $integrationPackageId));
        $vendorId = !empty($result[0])?$result[0]['vendor_id']:null;

        $query = "SELECT property_id FROM property WHERE property_id_alt = ?";
        $result = $this->gateway->adapter->query($query, array($propertyName));
        $propertyId = !empty($result[0])?$result[0]['property_id']:null;

        $query = "SELECT insurancetype_id FROM insurancetype WHERE insurancetype_name = ?";
        $result = $this->gateway->adapter->query($query, array($insuranceTypeName));
        $insuranceTypeId = !empty($result[0])?$result[0]['insurancetype_id']:null;

        $query = "SELECT insurance_id FROM insurance WHERE table_name = 'vendor' AND tablekey_id = ? AND ltrim(rtrim(insurance_policynum)) = ltrim(rtrim(?))";
        $result = $this->gateway->adapter->query($query, array($vendorId, $policyNumber));
        $insuranceId = !empty($result[0])?$result[0]['insurance_id']:null;


        if(is_null($insuranceId)) {
            $query = "SELECT TOP 1 insurance_id FROM INSURANCE WHERE insurance_policynum = ? AND insurance_company = ? AND table_name = 'vendor' AND tablekey_id = ?";
            $result = $this->gateway->adapter->query($query, array($policyNumber, $companyName, $vendorId));
            $policyResult = !empty($result[0])?$result[0]['insurance_id']:null;

            if(is_null($policyResult)) {
                $query = "INSERT INTO INSURANCE (
                            insurancetype_id,
                            insurance_company,
                            insurance_policynum,
                            insurance_expdatetm,
                            insurance_policy_effective_datetm,
                            insurance_policy_limit,
                            insurance_additional_insured_listed,
                            table_name,
                            tablekey_id
                         ) VALUES (
                            ?, ?, ?, ?, ?, ?, ?, 'vendor', ?)";
                $result = $this->gateway->adapter->query($query, array(
                            $insuranceTypeId,
                            $companyName,
                            $policyNumber,
                            $expirationDate,
                            $effectiveDate,
                            $policyLimit,
                            $additionalInsured,
                            $vendorId
                ));
                $insuranceId = $this->gateway->adapter->lastInsertId();

                IF ($propertyId) {
                    $query = "INSERT INTO LINK_INSURANCE_PROPERTY (insurance_id, property_id) VALUES(?, ?)";
                    $result = $this->gateway->adapter->query($query, array($insuranceId, $propertyId));
                }
            }
        } else {
            $query = "UPDATE INSURANCE SET
                        insurancetype_id = ?,
                        insurance_company = ?,
                        insurance_expdatetm = ?,
                        insurance_policy_effective_datetm = ?,
                        insurance_policy_limit = ?,
                        insurance_additional_insured_listed = ?
                     WHERE insurance_id = ?";
            $result = $this->gateway->adapter->query($query, array($insuranceTypeId, $companyName, $expirationDate, $effectiveDate, $policyLimit, $additionalInsured, $insuranceId));

            IF ($propertyId) {
             	$query = "SELECT TOP 1 link_insurance_property_id FROM link_insurance_property WHERE insurance_id = ? AND property_id = ?";

                $result = $this->gateway->adapter->query($query, array($insuranceId, $propertyId));
                $link = !empty($result[0])?$result[0]['link_insurance_property_id']:null;

				IF (is_null($link)) {
					$query = "INSERT INTO LINK_INSURANCE_PROPERTY (insurance_id, property_id) VALUES (?, ?)";
                    $result = $this->gateway->adapter->query($query, array($insuranceId, $propertyId));
                }
			}
        }

    }
}
