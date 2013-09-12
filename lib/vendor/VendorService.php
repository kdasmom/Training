<?php

namespace NP\vendor;

use NP\system\BaseImportService;
use NP\system\IntegrationPackageGateway;
use NP\gl\GLAccountGateway;
use Zend\Soap\Client as SOAPClient;;

/**
 * Service class for operations related to vendors
 *
 * @author Thomas Messier
 */
class VendorService extends BaseImportService {
	
	protected $vendorGateway, $validator, $integrationPackageGateway, $vendorTypeGateway, $glaccountGateway;

	public function __construct(        
                VendorGateway $vendorGateway,
                VendorEntityValidator $validator,
                IntegrationPackageGateway $integrationPackageGateway,
                VendorTypeGateway $vendorTypeGateway,
                GLAccountGateway $glaccountGateway
                )
        {
                $this->vendorGateway = $vendorGateway;
                $this->validator = $validator;
                $this->integrationPackageGateway = $integrationPackageGateway;
                $this->vendorTypeGateway = $vendorTypeGateway;
                $this->glaccountGateway = $glaccountGateway;
	}
	
	/**
	 * Retrieves vendor records for the vendor autocomplete when creating catalogs
	 *
	 * @param  string $keyword Keyword to use to search for a vendor
	 * @return array           Array of vendor records
	 */
	public function getForCatalogDropDown($keyword) {
		return $this->vendorGateway->getForCatalogDropDown($keyword);
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
     * This must be implemented in child class.
     * Method accept row and entity class to save in related gateway.
     *
     * @param \ArrayObject $data Row array for entity defined in next param
     * @param string $entityClass Entity class to map data
     */
    public function save(\ArrayObject $data, $entityClass)
    {
        $result = $this->integrationPackageGateway->find('integration_package_name = ?', array( $data['IntegrationPackage']));
        $integrationPackageId = $result[0]['integration_package_id'];
        $result = $this->vendorTypeGateway->find('vendortype_name = ?', array( $data['VendorType']));
        $vendorTypeId = $result[0]['vendortype_id'];
        $result = $this->glaccountGateway->find('glaccount_number = ?', array( $data['DefaultGLcode']));
        $glaccountId = $result[0]['glaccount_id'];
        $entityData = array(
		'vendor_id_alt' => $data['VendorID'],
		'vendor_name' => $data['Name'],
		'vendor_fedid' => $data['FederalID'],
		'default_glaccount_id'=> $glaccountId,
		'vendor_type_code' => $data['VendorType'],
		'vendortype_id' => $vendorTypeId,
		'vendor_paypriority' => $data['PayPriority'],
		'vendor_type1099' => $data['1099Reportable?'],
		'vendor_tax_reporting_name' => $data['TaxReportName'],
		'vendor_status' => $data['Status'],
		'vendor_lastupdate_date' => $data['LastUpdateDate'],
		'integration_package_id' => $integrationPackageId,
		'vendor_createddatetm' => $data['CreatedDate'],
        );
        $entity = new $entityClass($entityData);
        $errors = $this->validate($entity);

        // If the data is valid, save it
        if (count($errors) == 0) {
            // Begin transaction
            $this->vendorGateway->beginTransaction();

            try {
                // Save the glaccount record
                //$this->vendorGateway->save($entity);
            } catch(\Exception $e) {
                // Add a global error to the error array
                $errors[] = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e), 'extra'=>null);
            }
        }

        if (count($errors)) {
            $this->vendorGateway->rollback();
        } else {
            $this->vendorGateway->commit();
        } 
    
    }
}
