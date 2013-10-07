<?php

namespace NP\vendor;

use NP\core\AbstractService;
use NP\system\IntegrationPackageGateway;
use NP\gl\GLAccountGateway;
use NP\property\PropertyGateway;
use NP\property\UnitGateway;

/**
 * Service class for operations related to vendors
 *
 * @author Thomas Messier
 */
class VendorService extends AbstractService {
    
    protected $vendorGateway, $integrationPackageGateway, $vendorTypeGateway, $glAccountGateway,
            $vendorGlAccountsGateway, $propertyGateway, $vendorFavoriteGateway, $insuranceTypeGateway,
            $insuranceGateway, $linkInsurancePropertyGateway, $unitGateway;

    public function __construct(        
                VendorGateway $vendorGateway, VendorsiteGateway $vendorsiteGateway,
                IntegrationPackageGateway $integrationPackageGateway,
                VendorTypeGateway $vendorTypeGateway, GLAccountGateway $glAccountGateway,
                VendorGlAccountsGateway $vendorGlAccountsGateway, PropertyGateway $propertyGateway,
                VendorFavoriteGateway $vendorFavoriteGateway, InsuranceTypeGateway $insuranceTypeGateway,
                InsuranceGateway $insuranceGateway, LinkInsurancePropertyGateway $linkInsurancePropertyGateway,
                UnitGateway $unitGateway) {
        $this->vendorGateway                = $vendorGateway;
        $this->vendorsiteGateway            = $vendorsiteGateway;
        $this->integrationPackageGateway    = $integrationPackageGateway;
        $this->vendorTypeGateway            = $vendorTypeGateway;
        $this->glAccountGateway             = $glAccountGateway;
        $this->vendorGlAccountsGateway      = $vendorGlAccountsGateway;
        $this->propertyGateway              = $propertyGateway;
        $this->vendorFavoriteGateway        = $vendorFavoriteGateway;
        $this->insuranceTypeGateway         = $insuranceTypeGateway;
        $this->insuranceGateway             = $insuranceGateway;
        $this->linkInsurancePropertyGateway = $linkInsurancePropertyGateway;
        $this->unitGateway                  = $unitGateway;
    }
    
    public function getVendorBySiteId($vendorsite_id) {
        $res = $this->vendorGateway->find('vs.vendorsite_id = ?', array($vendorsite_id));
        return $res[0];
    }

    /**
     * Retrieves vendor records for the vendor autocomplete when creating catalogs
     *
     * @param  string $keyword Keyword to use to search for a vendor
     * @return array           Array of vendor records
     */
    public function getForCatalogDropDown($keyword=null) {
        if ($keyword !== null) {
            return $this->vendorGateway->getForCatalogDropDown($keyword);
        } else {
            return [];
        }
    }
       
    /**
     * Get all vendors in the application
     *
     * @param  string $vendor_status The status of the vendor (optional); valid values are 'active' or 'inactive'
     * @return array
     */
    public function getAll($vendor_status='active', $pageSize=null, $page=1, $sort='vendor_name') {
             return $this->vendorGateway->find(
                    array('vendor_status'=>'?'),
                    array($vendor_status),
                    'vendor_name ASC',
                    array('vendor_name')
            );
    }
    
    /**
     * Retrieves vendor records by integration package, 
     *
     * @param  int          $integration_package_id
     * @param  string|array $vendor_status          Vendor status or array of statuses
     * @param  string       $keyword                Keyword to use to search for a vendor
     * @return array                          Array of vendor records
     */
    public function getByIntegrationPackage($integration_package_id, $vendor_status=null, $keyword=null) {
        if (is_numeric($integration_package_id)) {
            $wheres = array(array('integration_package_id' => '?'));
            $params = array($integration_package_id);

            if ($vendor_status !== null) {
                $wheres[] = new sql\criteria\VendorStatusCriteria($vendor_status, 'IN');
                if (!is_array($vendor_status)) {
                    $vendor_status = array($vendor_status);
                }
                foreach ($vendor_status as $vendor_status_val) {
                    $params[] = $vendor_status_val;
                }
            }       

            if ($keyword !== null) {
                $wheres[] = new sql\criteria\VendorKeywordCriteria();
                $keyword = $keyword . '%';
                $params[] = $keyword;
                $params[] = $keyword;
            }

            return $this->vendorGateway->find(
                \NP\core\db\Where::buildCriteria($wheres),
                $params,
                'vendor_name',
                array('vendor_id','vendor_id_alt','vendor_name')
            );
        } else {
            return array();
        }
    }

    /**
     * Retrieves vendor records matching a specified tax ID. A tax ID can be provided, otherwise a vendor ID can
     * be provided and all vendors with the same tax ID as the specified vendor will be returned.
     *
     * @param  string [$vendor_fedid] Tax ID to search for
     * @param  int    [$vendor_id]    ID for the vendor who's tax ID you want to find matching vendors for
     * @return array                  Array of vendor records
     */
    public function getByTaxId($vendor_fedid=null, $vendor_id=null) {
        if ($vendor_fedid === null) {
            $rec = $this->vendorGateway->findById($vendor_id, array('vendor_fedid'));
            $vendor_fedid = $rec['vendor_fedid'];
        }

        return $this->vendorGateway->find(
            array('vendor_fedid'=>'?'),
            array($vendor_fedid),
            'vendor_name ASC',
            array('vendor_id','vendor_id_alt','vendor_name')
        );
    }

    /**
     * Get list of vendors to approve
     *
     * @param  boolean $countOnly                   Whether we want to retrieve only the number of records or all the data
     * @param  int     $pageSize                    The number of records per page; if null, all records are returned
     * @param  int     $page                        The page for which to return records
     * @param  string  $sort                        Field(s) by which to sort the result; defaults to vendor_name
     * @return array                                Array of vendor records
     */
    public function getVendorsToApprove($countOnly, $pageSize=null, $page=null, $sort="vendor_name") {
        return $this->vendorGateway->findVendorsToApprove($countOnly, $pageSize, $page, $sort);
    }

    /**
     * Get list of vendors to approve
     *
     * @param  boolean $countOnly                   Whether we want to retrieve only the number of records or all the data
     * @param  int     $pageSize                    The number of records per page; if null, all records are returned
     * @param  int     $page                        The page for which to return records
     * @param  string  $sort                        Field(s) by which to sort the result; defaults to vendor_name
     * @return array                                Array of vendor records
     */
    public function getExpiredInsuranceCerts($countOnly, $pageSize=null, $page=null, $sort="insurance_expdatetm") {
        return $this->insuranceGateway->findExpiredInsuranceCerts($countOnly, $pageSize, $page, $sort);
    }

    /**
     * Saves a collection of vendors imported from a file through the import tool
     */
    public function saveVendorFromImport($data) {
        $intPkg = $this->integrationPackageGateway->find(
            'integration_package_name = ?',
            array($data[0]['integration_package_name'])
        );
        $integration_package_id = $intPkg[0]['integration_package_id'];
        
        try {
            $sessionKey = $this->soapService->login();

            $soapSettings = $this->soapService->getSettings();

            $headerXml = "<SecurityHeader xmlns=\"http://tempuri.org/\">
                            <SessionKey>{$sessionKey}</SessionKey>
                            <ClientName>{$soapSettings['wsdl_client']}</ClientName>
                            <UserName>{$soapSettings['wsdl_user']}</UserName>
                        </SecurityHeader>";

            $xml = "<PN_SET_VENDORCOMBO xmlns=\"http://tempuri.org/\">
                        <vendorcombo>
                            <VENDORCOMBOS xmlns=\"\">";

            foreach ($data as $rec) {
                $xml .=         "<VENDORCOMBO>
                                    <VENDOR_ID_ALT>{$rec['vendor_id_alt']}</VENDOR_ID_ALT>
                                    <VENDOR_NAME>{$rec['vendor_name']}</VENDOR_NAME>
                                    <VENDOR_FEDID>{$rec['vendor_fedid']}</VENDOR_FEDID>
                                    <VENDOR_TAX_REPORTING_NAME>{$rec['vendor_tax_reporting_name']}</VENDOR_TAX_REPORTING_NAME>
                                    <VENDOR_STATUS>{$rec['vendor_status']}</VENDOR_STATUS>
                                    <VENDOR_TYPE_CODE>{$rec['vendortype_code']}</VENDOR_TYPE_CODE>
                                    <VENDOR_PAYPRIORITY>{$rec['vendor_paypriority']}</VENDOR_PAYPRIORITY>
                                    <VENDOR_CREATEDDATE>{$rec['vendor_createddatetm']}</VENDOR_CREATEDDATE>
                                    <VENDOR_LASTUPDATE_DATE>{$rec['vendor_lastupdate_date']}</VENDOR_LASTUPDATE_DATE>
                                    <VENDOR_TYPE1099>{$rec['vendor_type1099']}</VENDOR_TYPE1099>
                                    <VENDOR_TERMSDATEBASIS>{$rec['vendor_termsdatebasis']}</VENDOR_TERMSDATEBASIS>
                                    <PAYDATEBASIS_CODE>{$rec['paydatebasis_code']}</PAYDATEBASIS_CODE>
                                    <DEFAULT_GLCODE>{$rec['default_glaccount_number']}</DEFAULT_GLCODE>
                                    <VENDOR_PHONE>{$rec['phone_number']}</VENDOR_PHONE>
                                    <VENDOR_FAX>{$rec['fax_number']}</VENDOR_FAX>
                                    <VENDOR_ADDRESS1>{$rec['address_line1']}</VENDOR_ADDRESS1>
                                    <VENDOR_ADDRESS2>{$rec['address_line2']}</VENDOR_ADDRESS2>
                                    <VENDOR_CITY>{$rec['address_city']}</VENDOR_CITY>
                                    <VENDOR_STATE>{$rec['address_state']}</VENDOR_STATE>
                                    <VENDOR_ZIPCODE>{$rec['address_zip']}</VENDOR_ZIPCODE>
                                    <CONTACT_LAST_NAME>{$rec['person_firstname']}</CONTACT_LAST_NAME>
                                    <CONTACT_FIRST_NAME>{$rec['person_lastname']}</CONTACT_FIRST_NAME>
                                </VENDORCOMBO>";
            }

            $xml .=         "</VENDORCOMBOS>
                        </vendorcombo>
                        <integration_id>{$integration_package_id}</integration_id>
                    </PN_SET_VENDORCOMBO>";

            $res = $this->soapService->request(
                $soapSettings['wsdl_url'],
                $xml,
                $headerXml
            );

            $statusCode = (string)$res['soapResult']->PN_SET_VENDORCOMBO->Status->StatusCode;

            $error = null;
            if ($statusCode === 'SUCCESS') {
                $success = true;
            } else {
                throw new \NP\core\Exception('The SOAP request for saving vendors failed.');
            }
        } catch(\Exception $e) {
            $success = false;
            $error   = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
        }

        return array(
            'success' => $success,
            'error'   => $error
        );
    }

    /**
     * Save vendor/GL assignment
     */
    public function saveVendorGlAssignment($data) {
        $vendorGl = new VendorGlAccountEntity($data);
        $errors = $this->entityValidator->validate($vendorGl);

        if (!count($errors)) {
            try {
                $this->vendorGlAccountsGateway->save($vendorGl);
            } catch (\Exception $e) {
                $errors[]   = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
            }
        }

        return array(
            'success' => (count($errors)) ? false : true,
            'errors'  => $errors
        );
    }

    /**
     * Save vendor favorite
     */
    public function saveVendorFavorite($data) {
        $vendorFav = new VendorFavoriteEntity($data);
        $errors = $this->entityValidator->validate($vendorFav);

        if (!count($errors)) {
            try {
                $this->vendorFavoriteGateway->save($vendorFav);
            } catch (\Exception $e) {
                $errors[]   = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
            }
        }

        return array(
            'success' => (count($errors)) ? false : true,
            'errors'  => $errors
        );
    }

    /**
     * Save vendor insurance
     */
    public function saveInsurance($data) {
        $insurance = new InsuranceEntity($data['insurance']);
        $errors = $this->entityValidator->validate($insurance);

        if (!count($errors)) {
            $this->insuranceGateway->beginTransaction();
            
            try {
                $this->insuranceGateway->save($insurance);

                if (array_key_exists('property_id_list', $data)) {
                    if (array_key_exists('insurance_id', $data['insurance'])) {
                        $this->linkInsurancePropertyGateway->delete(
                            'insurance_id = ?',
                            array($data['insurance']['insurance_id'])
                        );
                    }
                    foreach ($data['property_id_list'] as $property_id) {
                        $insuranceProp = new LinkInsurancePropertyEntity(array(
                            'insurance_id' => $insurance->insurance_id,
                            'property_id'  => $property_id
                        ));
                        $propErrors = $this->entityValidator->validate($insuranceProp);
                        if (count($propErrors)) {
                            $this->entityValidator->addError($errors, 'global', 'Error saving insurance property');
                            break;
                        } else {
                            $this->linkInsurancePropertyGateway->save($insuranceProp);
                        }
                    }
                }
            } catch (\Exception $e) {
                $errors[]   = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
            }
        }

        if (count($errors)) {
            $this->insuranceGateway->rollback();
        } else {
            $this->insuranceGateway->commit();
        }

        return array(
            'success' => (count($errors)) ? false : true,
            'errors'  => $errors
        );
    }

    /**
     * Save vendor GL assignment from import tool
     */
    public function saveVendorGLFromImport($data) {
        // Use this to store integration package IDs
        $intPkgs = array();
        $errors  = array();

        // Loop through all the rows to import
        foreach ($data as $idx=>$row) {
            // If there's been no record with this integration package, we need to retrieve the ID for it
            if (!array_key_exists($row['integration_package_name'], $intPkgs)) {
                $rec = $this->integrationPackageGateway->find(
                    'integration_package_name = ?',
                    array($row['integration_package_name'])
                );
                $intPkgs[$row['integration_package_name']] = $rec[0]['integration_package_id'];
            }
            $integration_package_id = $intPkgs[$row['integration_package_name']];

            // Get vendor ID
            $rec = $this->vendorGateway->find(
                array('vendor_id_alt'=>'?', 'integration_package_id'=>'?'),
                array($row['vendor_id_alt'], $integration_package_id)
            );
            $row['vendor_id'] = $rec[0]['vendor_id'];

            // Get GL Account ID
            $rec = $this->glAccountGateway->find(
                array('glaccount_number'=>'?', 'integration_package_id'=>'?'),
                array($row['glaccount_number'], $integration_package_id)
            );
            $row['glaccount_id'] = $rec[0]['glaccount_id'];

            // Save the row
            $result = $this->saveVendorGlAssignment($row);

            // Set errors
            if (!$result['success']) {
                $rowNum = $idx + 1;
                $errorMsg = $this->localizationService->getMessage('importRecordSaveError') . " {$rowNum}";
                $errors[] = $errorMsg;

                $this->loggingService->log('error', 'Error importing vendor GL', $result['errors']);
            }
        }

        $error = implode('<br />', $errors);
        return array(
            'success' => (count($errors)) ? false : true,
            'error'  => $error
        );
    }

    /**
     * Save vendor favorite from import tool
     */
    public function saveVendorFavoriteFromImport($data) {
        // Use this to store integration package IDs
        $intPkgs = array();
        $errors  = array();

        // Loop through all the rows to import
        foreach ($data as $idx=>$row) {
            // If there's been no record with this integration package, we need to retrieve the ID for it
            if (!array_key_exists($row['integration_package_name'], $intPkgs)) {
                $rec = $this->integrationPackageGateway->find(
                    'integration_package_name = ?',
                    array($row['integration_package_name'])
                );
                $intPkgs[$row['integration_package_name']] = $rec[0]['integration_package_id'];
            }
            $integration_package_id = $intPkgs[$row['integration_package_name']];

            // Get vendor ID
            $rec = $this->vendorsiteGateway->findByVendorCode(
                $row['vendor_id_alt'],
                $integration_package_id
            );
            $row['vendorsite_id'] = $rec[0]['vendorsite_id'];

            // Get property ID
            $rec = $this->propertyGateway->find(
                array('property_id_alt'=>'?', 'integration_package_id'=>'?'),
                array($row['property_id_alt'], $integration_package_id)
            );
            $row['property_id'] = $rec[0]['property_id'];

            // Save the row
            $result = $this->saveVendorFavorite($row);

            // Set errors
            if (!$result['success']) {
                $rowNum = $idx + 1;
                $errorMsg = $this->localizationService->getMessage('importRecordSaveError') . " {$rowNum}";
                $errors[] = $errorMsg;

                $this->loggingService->log('error', 'Error importing vendor favorite', $result['errors']);
            }
        }

        $error = implode('<br />', $errors);
        return array(
            'success' => (count($errors)) ? false : true,
            'error'  => $error
        );
    }

    /**
     * Save vendor favorite from import tool
     */
    public function saveVendorInsuranceFromImport($data) {
        // Use this to store integration package IDs
        $intPkgs = array();
        $errors  = array();

        // Loop through all the rows to import
        foreach ($data as $idx=>$row) {
            // If there's been no record with this integration package, we need to retrieve the ID for it
            if (!array_key_exists($row['integration_package_name'], $intPkgs)) {
                $rec = $this->integrationPackageGateway->find(
                    'integration_package_name = ?',
                    array($row['integration_package_name'])
                );
                $intPkgs[$row['integration_package_name']] = $rec[0]['integration_package_id'];
            }
            $integration_package_id = $intPkgs[$row['integration_package_name']];

            // Get vendor ID
            $rec = $this->vendorGateway->find(
                array('vendor_id_alt'=>'?', 'vendor_status'=>'?', 'integration_package_id'=>'?'),
                array($row['vendor_id_alt'], 'active', $integration_package_id)
            );
            $row['tablekey_id'] = $rec[0]['vendor_id'];
            $row['table_name'] = 'vendor';

            // Get insurance type ID
            $rec = $this->insuranceTypeGateway->find('insurancetype_name = ?', array($row['insurancetype_name']));
            $row['insurancetype_id'] = $rec[0]['insurancetype_id'];

            // Get property ID
            $prop = $this->propertyGateway->find(
                array('property_id_alt'=>'?', 'integration_package_id'=>'?'),
                array($row['property_id_alt'], $integration_package_id)
            );
            
            // If insurance record is to be updated, figure out ID
            $rec = $this->insuranceGateway->find(
                array('table_name'=>'?', 'tablekey_id'=>'?', 'insurance_policynum'=>'?'),
                array($row['table_name'], $row['tablekey_id'], $row['insurance_policynum'])
            );
            if (count($rec)) {
                $row['insurance_id'] = $rec[0]['insurance_id'];
            }

            // Format dates properly
            $row['insurance_policy_effective_datetm'] = $this->convertInsuranceDate($row['insurance_policy_effective_datetm']);
            $row['insurance_expdatetm'] = $this->convertInsuranceDate($row['insurance_expdatetm']);

            $insuranceData = array(
                'insurance'        => $row,
                'property_id_list' => array($prop[0]['property_id'])
            );
            
            // Save the row
            $result = $this->saveInsurance($insuranceData);

            // Set errors
            if (!$result['success']) {
                $rowNum = $idx + 1;
                $errorMsg = $this->localizationService->getMessage('importRecordSaveError') . " {$rowNum}";
                $errors[] = $errorMsg;

                $this->loggingService->log('error', 'Error importing vendor insurance', $result['errors']);
            }
        }

        $error = implode('<br />', $errors);
        return array(
            'success' => (count($errors)) ? false : true,
            'error'  => $error
        );
    }

    protected function convertInsuranceDate($date) {
        $date = substr($date, 4, 4) . '-' . substr($date, 0, 2) . '-' . substr($date, 2, 2);
        $date .= ' 00:00:00';
        $date = \DateTime::createFromFormat('Y-m-d H:i:s', $date);

        return \NP\util\Util::formatDateForDB($date);
    }
}
