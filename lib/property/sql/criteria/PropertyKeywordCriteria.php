<?php

namespace NP\property\sql\criteria;

use NP\core\db\Where;

/**
 * Keyword filter for Property table
 *
 * @author Thomas Messier
 */
class PropertyKeywordCriteria extends Where {

	/**
	 * @param  string $keyword
	 */
	public function __construct($alias='pr') {
		parent::__construct();

		return $this->nest('or')
					->like("{$alias}.property_name", '?')
					->like("{$alias}.property_id_alt", '?');
	}
	
}