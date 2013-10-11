<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 10/9/13
 * Time: 6:12 PM
 */

namespace NP\vendor;


use NP\core\AbstractGateway;
use NP\core\db\Expression;
use NP\core\db\Select;

class VendorsiteGateway extends AbstractGateway {

	public function getVendositeCode($vendorId, $vendorsiteAddressCity, $vendorsiteStatus = 'active', $aspClientId) {
		$select = new Select();
		$vendorsitecode = '';

		$select->from(['vs' => 'vendorsite'])
					->count(true, 'site_count')
					->join(['a' => 'address'], 'vs.vendorsite_id = a.tablekey_id', [])
					->join(['v' => 'vendor'], 'vs.vendor_id = v.vendor_id', [])
					->join(['i' => 'integrationpackage'], 'v.integration_package_id = i.integration_package_id', [])
					->where(
							[
								'v.vendor_id' 						=> '?',
								'a.address_city'					=> '?',
								'vs.vendorsite_status'		=> '?',
								'i.asp_client_id'					=> '?',
								'a.table_name'					=> '?'
							]
					);

		$count = $this->adapter->query($select, [$vendorId, $vendorsiteAddressCity, $vendorsiteStatus, $aspClientId, 'vendorsite']);

		$vendorsitecode = substr($vendorsiteAddressCity, 0, 15-strlen($count[0]['site_count'])) . strval($count[0]['site_count']);

		return $vendorsitecode;
	}

	public function getLastId() {
		$lastInsertId =$this->adapter->query("SELECT IDENT_CURRENT('vendorsite') as  lastinsertid");
		return $lastInsertId[0]['lastinsertid'];
	}
}