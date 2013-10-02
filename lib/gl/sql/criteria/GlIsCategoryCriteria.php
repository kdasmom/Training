<?php

namespace NP\gl\sql\criteria;

use NP\core\db\Where;

/**
 * Filter for retrieving either GL accounts or GL categories
 *
 * @author Thomas Messier
 */
class GlIsCategoryCriteria extends Where {
	
	/**
	 * @param  string $keyword
	 */
	public function __construct($isCategory=false, $alias='g') {
		parent::__construct();

		$fn = ($isCategory) ? 'isNull' : 'isNotNull';

		return $this->$fn("{$alias}.glaccounttype_id");
	}
	
}