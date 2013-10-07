<?php

namespace NP\user\sql\criteria;

use NP\core\db\Where;
use NP\core\db\Select;

/**
 * Permission filter for USERPROFILE table
 *
 * @author Thomas Messier
 */
class UserHasPermissionCriteria extends Where {
	
	/**
	 * @param array  $module_id_list
	 * @param string $alias
	 */
	public function __construct($module_id_list, $alias='ur') {
		parent::__construct();

		if (count($module_id_list) == 1) {
			$placeHolders = '?';
			$fn = 'whereEquals';
		} else {
			$placeHolders = array_fill(0, count($module_id_list), '?');
			$fn = 'whereIn';
		}

		$this->exists(
			Select::get()->from(['mp'=>'modulepriv'])
						->whereEquals("{$alias}.role_id", 'mp.tablekey_id')
						->$fn('mp.module_id', $placeHolders)
		);
	}
	
}