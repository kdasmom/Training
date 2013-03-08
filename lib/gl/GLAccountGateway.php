<?php

namespace NP\gl;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\system\ConfigService;

use NP\core\db\Adapter;

/**
 * Gateway for the GL Account table
 *
 * @author Thomas Messier
 */
class GLAccountGateway extends AbstractGateway {
	/**
	 * @var NP\system\ConfigService
	 */
	protected $configService;
	
	/**
	 * @param NP\core\db\Adapter $adapter       Database adapter object injected
	 * @param NP\system\ConfigService $configService ConfigService object injected
	 */
	public function __construct(Adapter $adapter, ConfigService $configService) {
		$this->configService = $configService;
		
		parent::__construct($adapter);
	}
	
	/**
	 * @param  int    $vendorsite_id
	 * @param  int    $property_id
	 * @param  string $glaccount_keyword
	 * @return array
	 */
	public function findForInvoiceItemComboBox($vendorsite_id, $property_id, $glaccount_keyword='') {
		$usePropGL = $this->configService->get('CP.PROPERTYGLACCOUNT_USE', 0);
		$glaccount_keyword .= '%';
		$params = array($vendorsite_id, $glaccount_keyword, $glaccount_keyword);
		
		$select = new Select();
		$select->from(array('g'=>'glaccount'))
				->join(array('gt'=>'glaccounttype'),
						'gt.glaccounttype_id = g.glaccounttype_id',
						array())
				->join(array('vg'=>'vendorglaccounts'),
						'vg.glaccount_id = g.glaccount_id',
						array())
				->join(array('vs'=>'vendorsite'),
						'vg.vendor_id = vs.vendor_id',
						array())
				->join(array('v'=>'vendor'),
						'vs.vendor_id = v.vendor_id',
						array());
		
		$where = "
			g.glaccount_status = 'active'
			AND vs.vendorsite_id = ?
			AND g.integration_package_id = v.integration_package_id
			AND g.glaccounttype_id <> 10
			AND (
				g.glaccount_name LIKE ?
				OR g.glaccount_number LIKE ?
			)
		";
		
		if ($usePropGL) {
			$select->join(array('pg'=>'propertyglaccount'),
						'g.glaccount_id = pg.glaccount_id',
						array());
			
			$where .= " AND pg.property_id = ?";
			$params[] = $property_id;
		}
		
		$select->where($where);
		
		$sqlStr = $select->toString();
		
		if ( $this->configService->get("PN.Budget.FixedAssetSpecial", 0) ) {
			$select = new Select();
			$select->from(array('g'=>'glaccount'))
					->join(array('i'=>'integrationpackage'),
						'g.integration_package_id = i.integration_package_id',
						array())
					->where("
						g.glaccount_number = (SELECT fixedasset_account FROM property WHERE property_id = ?)
						AND g.glaccount_status = 'active'
						AND (
							g.glaccount_name LIKE ?
							OR g.glaccount_number LIKE ?
						)
					");
			
			$sqlStr .= ' UNION ' . $select->toString();
			$params[] = $property_id;
			$params[] = $glaccount_keyword;
			$params[] = $glaccount_keyword;
		}
		
		$sqlStr .= ' ORDER BY gt.glaccounttype_name,' . $this->configService->get("PN.Budget.GLCodeSort", "glaccount_number");
		
		return $this->adapter->query($sqlStr, $params);
	}
	
	/**
	 * Retrieves GL accounts that a specific user has access to
	 * 
	 * @param  int    $userprofile_id
	 * @return array
	 */
	public function findUserGLAccounts($userprofile_id) {
		$select = new Select();
		$select->from(array('g'=>'glaccount'))
				->where("
					EXISTS (
						SELECT *
						FROM PROPERTYGLACCOUNT pg
							inner join propertyuserprofile pu ON pg.property_id = pu.property_id
						WHERE g.glaccount_id = pg.glaccount_id
							AND pu.userprofile_id = ?
					)
				")
				->order("g.glaccount_name");
	
		return $this->adapter->query($select, array($userprofile_id));
	}
	
}

?>