<?php

namespace NP\catalog;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the LINK_VC_VENDOR table
 *
 * @author Thomas Messier
 */
class LinkVcVendorGateway extends AbstractGateway {
	protected $table = 'LINK_VC_VENDOR';
	protected $pk    = 'link_vc_vendor_id';

	public function getSelect() {
		$select = new Select();
		$select->from(array('lvv'=>$this->table))
				->join(array('v'=>'vendor'),
					   'lvv.vendor_id = v.vendor_id',
					   array('vendor_id_alt','vendor_name'));

		return $select;
	}
}

?>