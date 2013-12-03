<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/27/13
 * Time: 3:21 PM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\vendor;

use NP\core\AbstractGateway;
use NP\core\db\Select;

class VendorGlAccountsGateway extends AbstractGateway {

        protected $pk = 'glaccount_vendor_id';
        
        /**
	 * Override getSelect() to include some joins
	 */
        
        public function getSelect() {
		$select = new Select();
		$select->from(array('vg'=>'vendorglaccounts'))
				->join(array('v'=>'vendor'),
						'vg.vendor_id = v.vendor_id',
						array('vendor_id_alt','vendor_name'))
				->join(array('g'=>'glaccount'),
						'vg.glaccount_id = g.glaccount_id',
						array('glaccount_number','glaccount_name'));
		return $select;
	}
}