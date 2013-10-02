<?php

namespace NP\vendor\sql\criteria;

use NP\core\db\Where;

/**
 * Expired insurance criteria
 *
 * @author Thomas Messier
 */
class InsuranceExpiredCriteria extends Where {
	
	public function __construct($warningRange, $alias='ins') {
		parent::__construct();

		return $this->nest('or')
					->expression("DateDiff(day, getdate(), {$alias}.insurance_expdatetm) <= isNull(vs.vendorsite_DaysNotice_InsuranceExpires, {$warningRange})")
					->expression("DateDiff(day, getdate(), {$alias}.insurance_expdatetm) <= vs.vendorsite_DaysNotice_InsuranceExpires");
	}
	
}