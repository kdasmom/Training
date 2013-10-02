<?php

namespace NP\po\sql\criteria;

use NP\core\db\Where;
use NP\core\db\Expression;

/**
 * Current period criteria for POs
 *
 * @author Thomas Messier
 */
class PoPeriodCriteria extends Where {
	
	/**
	 * @param  string $keyword
	 */
	public function __construct($alias='p') {
		parent::__construct();

		$now = new \DateTime();
		$nextMonth = new \DateTime();
		$nextMonth->add(new \DateInterval('P1M'));

		return $this->equals("{$alias}.purchaseorder_period", new Expression("
				CASE
					WHEN fm.fiscalcalmonth_cutoff >= {$now->format('j')} THEN '{$now->format('Y')}-{$now->format('m')}-01'
					ELSE '{$nextMonth->format('Y')}-{$nextMonth->format('m')}-01'
				END
			"));
	}
	
}