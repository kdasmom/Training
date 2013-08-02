<?php

namespace NP\vendor;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Where;
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
		
		$params = array($keyword);
		
		$select = new sql\VendorSelect();
		$select->populateForDropdown();
		
		return $this->adapter->query($select, $params);
	}

	public function findByIntegrationPackage($integration_package_id, $vendor_status=null, $keyword=null) {
		$where = Where::get()->equals('integration_package_id', '?');
		$params = array($integration_package_id);

		if ($keyword !== null) {
			$where->nest('OR')
				->like('vendor_name', '?')
				->like('vendor_id_alt', '?')
				->unnest();

			$keyword = "%{$keyword}%";
			$params[] = $keyword;
			$params[] = $keyword;
		}

		if ($vendor_status !== null) {
			if (!is_array($vendor_status)) {
				$vendor_status = explode(',', $vendor_status);
			}
			if (count($vendor_status) == 1) {
				$where->equals('vendor_status', '?');
				$params[] = $vendor_status[0];
			} else {
				$where->in('vendor_status', $this->createPlaceholders($vendor_status));
				$params = array_merge($params, $vendor_status);
			}
		}

		return $this->find($where, $params, 'vendor_name', array('vendor_id','vendor_id_alt','vendor_name'));
	}
	
}

?>