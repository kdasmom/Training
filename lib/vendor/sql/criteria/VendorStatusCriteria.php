<?php

namespace NP\vendor\sql\criteria;

use NP\core\db\Where;

/**
 * Status filter for Vendor table
 *
 * @author Thomas Messier
 */
class VendorStatusCriteria extends Where {
	
	public function __construct($vendor_status=null, $op='=', $alias='v', $siteAlias='vs') {
		parent::__construct();

		$placeHolder = '?';
		if (is_array($vendor_status)) {
			if (count($vendor_status) > 1) {
				$placeHolder = implode(',', array_fill(0, count($vendor_status), '?'));
			} else {
				if ($op === 'in') {
					$op = '=';
				} else if ($op === 'NOT IN') {
					$op = '<>';
				}
			}
		}

		$this->op($op, "{$alias}.vendor_status", $placeHolder);
		$this->op($op, "{$siteAlias}.vendorsite_status", $placeHolder);
	}
	
}