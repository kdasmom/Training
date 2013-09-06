<?php

namespace NP\property\sql\criteria;

use NP\core\db\Where;

/**
 * Status filter for Property table
 *
 * @author Thomas Messier
 */
class PropertyStatusCriteria extends Where {
	
	public function __construct($property_status=null, $op='=', $alias='pr') {
		parent::__construct();

		$placeHolder = '?';
		if (is_array($property_status)) {
			if (count($property_status) > 1) {
				$placeHolder = implode(',', array_fill(0, count($property_status), '?'));
			} else {
				if ($op === 'in') {
					$op = '=';
				} else if ($op === 'NOT IN') {
					$op = '<>';
				}
			}
		}

		$this->op($op, "{$alias}.property_status", $placeHolder);
	}
	
}