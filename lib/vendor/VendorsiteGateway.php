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
use NP\core\db\Insert;
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

	/**
	 * Save vendorsite favorite
	 *
	 * @param $vendorsiteId
	 * @param $propertyId
	 * @return array|bool
	 */
	public function insertFavorite($vendorsiteId, $propertyId) {
		$insert = new Insert();

		$insert->into('vendorfavorite')
					->columns(['vendorsite_id', 'property_id'])
					->values([$vendorsiteId, $propertyId]);

		return $this->adapter->query($insert);
	}

	/**
	 * assign GlAccounts to vendor
	 *
	 * @param $glaccounts
	 * @param $vendor_id
	 * @return bool
	 */
	public function assignGlAccounts($glaccounts, $vendor_id) {

		foreach (explode(',', $glaccounts) as $glaccount) {
			$insert = new Insert();
			$select = new Select();
			$insert->into('vendorglaccounts')
						->columns(array('vendor_id', 'glaccount_id'))
						->values($select->columns([new Expression('?'), new Expression('?')]));

			$result = $this->adapter->query($insert, [$vendor_id, $glaccount]);
			if (!$result) {
				return false;
			}
		}

		return true;
	}
}