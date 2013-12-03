<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 10/10/13
 * Time: 2:37 PM
 */

namespace NP\vendor\sql\criteria;


use NP\core\db\Where;

class VendorInActiveDateCriteria extends Where {
	public function __contstruct() {
		parent::__construct();

		return $this->nest('OR')
							->lessThanOrEqual('v.vendor_active_startdate', 'GetDate()')
							->isNull('v.vendor_active_startdate')
							->unnest()
							->nest('OR')
							->greaterThan('v.vendor_active_enddate', 'GetDate()')
							->isNull('v.vendor_active_enddate')
							->unnest();
	}
} 