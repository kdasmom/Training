<?php

namespace NP\vendor;

use NP\core\AbstractGateway;
use NP\core\SqlSelect;
use NP\system\ConfigService;
use NP\property\PropertyService;
use NP\vendor\VendorSelect;

use Zend\Db\Adapter\Adapter;

/**
 * Gateway for the VENDOR table
 *
 * @author Thomas Messier
 */
class VendorGateway extends AbstractGateway {
	/**
	 * @var NP\system\ConfigService
	 */
	protected $configService;

	/**
	 * @var NP\property\PropertyService
	 */
	protected $propertyService;
	

	/**
	 * @param Zend\Db\Adapter\Adapter     $adapter         Database adapter object injected by Zend Di
	 * @param NP\property\ConfigService   $configService   ConfigService object injected by Zend Di
	 * @param NP\property\PropertyService $propertyService PropertyService object injected by Zend Di
	 */
	public function __construct(Adapter $adapter, ConfigService $configService, PropertyService $propertyService) {
		$this->configService = $configService;
		$this->propertyService = $propertyService;
		
		parent::__construct($adapter);
	}
	
	/**
	 * Overwrites the default getSelect() method to include a join to the VENDORSITE table by default
	 *
	 * @param  array $vendorCols     Columns to include from the VENDOR table
	 * @param  array $vendorsiteCols Columns to include from the VENDORSITE table
	 * @return NP\core\SqlSelect
	 */
	public function getSelect($vendorCols=array('*'), $vendorsiteCols=array('*')) {
		$select = new SqlSelect();
		$select->from('vendor')
				->columns($vendorCols)
				->join(array('vs' => 'vendorsite'),
						'vendor.vendor_id = vs.vendor_id',
						$vendorsiteCols);
		
		return $select;
	}
	
	/**
	 * Retrieves a vendor record looking it up by vendorsite ID
	 *
	 * @param  int $vendorsite_id
	 * @return array
	 */
	public function findByVendorsite($vendorsite_id) {
		$res = $this->find('vendorsite_id = ?', array($vendorsite_id));
		
		return $res[0];
	}
	
	/**
	 * Retrieves vendor records based on some criteria. This function is used by autocomplete combos
	 *
	 * @param  string $vendor_name           Complete or partial vendor name
	 * @param  int    $property_id           Property ID
	 * @param  int    $expired_vendorsite_id An vendorsite_id for an expired vendor that you want to include in the list regardless (optional); defaults to null
	 * @return array
	 */
	public function getForComboBox($vendor_name, $property_id, $expired_vendorsite_id=null) {
		$allowExpiredInsurance = $this->configService->get('CP.AllowExpiredInsurance', 0);
		$integration_package_id = $this->propertyService->get($property_id);
		$integration_package_id = $integration_package_id['integration_package_id'];
		
		// Add wildcard character for vendor name to search for vendors beginning with
		$vendor_name .= '%';
		
		$params = array($vendor_name);
		
		$select = new VendorSelect();
		
		$select->columns(array('vendor_id','vendor_id_alt','vendor_name'))
				->joinVendorsite(array('vendorsite_id'))
				->joinAddress(array('address_line1','address_city','address_state','address_zip'));
		
		$where = "
			v.vendor_name LIKE ?
				AND vs.vendorsite_status = 'active' 
				AND v.vendor_status = 'active' 
				AND (
					(
						(v.vendor_active_startdate <= GetDate() OR v.vendor_active_startdate IS NULL)
						AND (v.vendor_active_enddate > GetDate() OR v.vendor_active_enddate IS NULL)
					)
		";
		
		if ($expired_vendorsite_id != null) {
			$where .= " OR vs.vendorsite_id = ?";
			$params[] = $expired_vendorsite_id;
		}
		
		$where .= "
			)
			AND v.integration_package_id = ?
		";
		$params[] = $integration_package_id;
		
		if ($allowExpiredInsurance == 0) {
			$where .= "
				AND v.vendor_id NOT IN (
					SELECT DISTINCT i.tablekey_id
					FROM INSURANCE i
						INNER JOIN LINK_INSURANCE_PROPERTY lip ON lip.insurance_id = i.insurance_id
					WHERE i.insurancetype_id IS NOT NULL
						AND i.table_name = 'vendor'
						AND i.insurance_expdatetm <= GETDATE()
						AND lip.property_id = ?
				)
			";
			$params[] = $property_id;
		}
		
		$select->where($where)
				->order('v.vendor_name ASC')
				->limit(50)
				->offset(0);
		
		return $this->executeSelectWithParams($select, $params);
	}
	
}

?>