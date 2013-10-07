<?php

namespace NP\gl\sql\criteria;

use NP\core\db\Where;
use NP\core\db\Select;
use NP\property\sql\PropertyFilterSelect;
use NP\property\PropertyContext;

/**
 * Filter for retrieving GL accounts by user's property
 *
 * @author Thomas Messier
 */
class GlUserPropertyCriteria extends Where {
	
	/**
	 * @param  string $fromAlias
	 * @param  string $toAlias
	 */
	public function __construct($userprofile_id, $fromAlias='g', $toAlias='pg') {
		parent::__construct();

		return $this->exists(
			Select::get()->from(array($toAlias=>'propertyglaccount'))
						->whereEquals("{$toAlias}.glaccount_id", "{$fromAlias}.glaccount_id")
						->whereIn(
							"{$toAlias}.property_id",
							new PropertyFilterSelect(new PropertyContext($userprofile_id, $userprofile_id, 'all', null))
						)
		);
	}
	
}