<?php

namespace NP\gl\sql\criteria;

use NP\core\db\Where;

/**
 * Filter for retrieving GL accounts by keyword
 *
 * @author Thomas Messier
 */
class GlKeywordCriteria extends Where {
	
	/**
	 * @param  string $keyword
	 */
	public function __construct($alias='g') {
		parent::__construct();

		return $this->nest('or')
					->like("{$alias}.glaccount_name", '?')
					->like("{$alias}.glaccount_number", '?');
	}
	
}