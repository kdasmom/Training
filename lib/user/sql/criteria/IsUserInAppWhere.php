<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 10/8/13
 * Time: 2:23 PM
 */

namespace NP\user\sql\criteria;


use NP\core\db\Where;

class IsUserInAppWhere extends Where {
		public function __construct($module_name) {
			parent::__construct();

			return $this->nest('OR')
				->nest('AND')
				->equals('mp.table_name', "'role'")
				->in('mp.tablekey_id', '?')
				->unnest()
				->nest('AND')
				->equals('mp.table_name', "'userprofile'")
				->in('mp.tablekey_id', '?')
				->unnest()
				->unnest()
				->lessThanOrEqual('mp.modulepriv_effectivedate', 'GetDate()')
				->nest('OR')
				->greaterThan('mp.modulepriv_expirationdate', 'GetDate()')
				->isNull('mp.modulepriv_expirationdate')
				->unnest()
				->equals('m.module_name', "'" . $module_name . "'");
		}
} 