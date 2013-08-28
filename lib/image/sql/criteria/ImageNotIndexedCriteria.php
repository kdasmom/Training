<?php

namespace NP\image\sql\criteria;

use NP\core\db\Where;
use NP\core\db\Select;

/**
 * Filter to pull only images that can be indexed
 *
 * @author Thomas Messier
 */
class ImageNotIndexedCriteria extends Where {
	
	/**
	 * @param  string $alias
	 */
	public function __construct($alias='img') {
		parent::__construct();

		return $this->equals("{$alias}.image_index_status", 0)
					->nest('OR')
					->isNull("{$alias}.Tablekey_Id")
					->equals("{$alias}.Tablekey_Id", 0)
					->unnest();
	}
	
}