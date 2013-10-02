<?php

namespace NP\gl\sql\criteria;

use NP\core\db\Where;
use NP\core\db\Select;

/**
 * Filter for retrieving GL accounts by property
 *
 * @author Thomas Messier
 */
class GlPropertyCriteria extends Where {
	
	/**
	 * @param  string $fromAlias
	 * @param  string $toAlias
	 */
	public function __construct($fromAlias='g', $toAlias='pg') {
		parent::__construct();

		return $this->exists(
			Select::get()->from(array($toAlias=>'propertyglaccount'))
						->whereEquals("{$toAlias}.glaccount_id", "{$fromAlias}.glaccount_id")
						->whereEquals("{$toAlias}.property_id", '?')
		);
	}
	
}