<?php

namespace NP\vendor;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the VENDORSITE table
 *
 * @author Thomas Messier
 */
class VendorsiteGateway extends AbstractGateway {

	/**
	 * Gets a vendorsite record using a vendor code
	 */
	public function findByVendorCode($vendor_id_alt, $integration_package_id) {
		$select = Select::get()->from(array('vs'=>'vendorsite'))
								->join(new sql\join\VendorsiteVendorJoin())
								->whereEquals('v.vendor_id_alt', '?')
								->whereEquals('v.integration_package_id', '?')
								->whereEquals('vs.vendorsite_status', '?');

		return $this->adapter->query($select, array($vendor_id_alt, $integration_package_id, 'active'));
	}
}

?>