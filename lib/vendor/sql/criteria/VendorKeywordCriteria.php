<?php

namespace NP\vendor\sql\criteria;

use NP\core\db\Where;

/**
 * Keyword filter for Vendor table
 *
 * @author Thomas Messier
 */
class VendorKeywordCriteria extends Where {
	
	/**
	 * @param  string $keyword
	 */
	public function __construct($alias='v') {
		parent::__construct();

		return $this->nest('or')
					->like("{$alias}.vendor_name", '?')
					->like("{$alias}.vendor_id_alt", '?');
	}
	
}