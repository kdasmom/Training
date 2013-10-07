<?php

namespace NP\gl\sql\criteria;

use NP\core\db\Where;

/**
 * Status filter for GLAccount table
 *
 * @author Aliaksandr Zubik
 */
class GlAccountStatusCriteria extends Where {
	
	public function __construct($glaccount_status=null, $op='=', $alias='g') {
		parent::__construct();

		$placeHolder = '?';
		if (is_array($glaccount_status)) {
			if (count($glaccount_status) > 1) {
				$placeHolder = implode(',', array_fill(0, count($glaccount_status), '?'));
			} else {
				if ($op === 'in') {
					$op = '=';
				} else if ($op === 'NOT IN') {
					$op = '<>';
				}
			}
		}

		$this->op($op, "{$alias}.glaccount_status", $placeHolder);
	}
	
}