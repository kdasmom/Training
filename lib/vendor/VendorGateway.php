<?php

namespace NP\vendor;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\system\ConfigService;
use NP\property\PropertyService;
use NP\vendor\VendorSelect;

use NP\core\db\Adapter;

/**
 * Gateway for the VENDOR table
 *
 * @author Thomas Messier
 */
class VendorGateway extends AbstractGateway {
	/**
	 * @var NP\property\PropertyService
	 */
	protected $propertyService;
	
	/**
	 * @param NP\core\db\Adapter     $adapter         Database adapter object injected
	 * @param NP\property\PropertyService $propertyService PropertyService object injected
	 */
	public function __construct(Adapter $adapter, PropertyService $propertyService) {
		$this->propertyService = $propertyService;
		
		parent::__construct($adapter);
	}

	/**
	 * Setter function required by DI to set the config service via setter injection
	 * @param \NP\system\ConfigService $configService
	 */
	public function setConfigService(\NP\system\ConfigService $configService) {
		$this->configService = $configService;
	}
	
	/**
	 * Overwrites the default getSelect() method to include a join to the VENDORSITE table by default
	 *
	 * @param  array $vendorCols     Columns to include from the VENDOR table
	 * @param  array $vendorsiteCols Columns to include from the VENDORSITE table
	 * @return NP\core\db\Select
	 */
	public function getSelect($vendorCols=array('*'), $vendorsiteCols=array('*')) {
		$select = new Select();
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
	 * @param  string $keyword Keyword to use to search for a vendor
	 * @return array           Array of vendor records
	 */
	public function getForCatalogDropDown($keyword) {
		// Add wildcard character for vendor name to search for vendors beginning with
		$keyword .= '%';
		
		$params = array('vendor_name'=>$keyword);
		
		$select = new sql\VendorSelect();
		$select->populateForDropdown();
		
		return $this->adapter->query($select, $params);
	}
	
}

?>