<?php

namespace NP\image\sql\criteria;

use NP\core\db\Where;

/**
 * Filter to pull only images that are unassigned
 *
 * @author Thomas Messier
 */
class ImageInvoiceUnassigned extends Where {
	
	/**
	 * @param  string $alias
	 */
	public function __construct($alias='img') {
		parent::__construct();

		return $this->nest('OR')
						->isNull("{$alias}.Tablekey_Id")
						->equals("{$alias}.Tablekey_Id", 0)
					->unnest();
	}
	
}