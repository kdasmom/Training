<?php

namespace NP\property;

use NP\core\AbstractService;

class FiscalCalService extends AbstractService {
	
	protected $fiscalcalGateway;
	
	public function __construct(FiscalcalGateway $fiscalcalGateway) {
		$this->fiscalcalGateway = $fiscalcalGateway;
	}

	/**
	 * Returns the current accounting period for a property
	 *
	 * @param  int   $property_id ID of the property
	 * @return DateTime  The accounting period; returns false if no accounting period is found
	 */
	public function getAccountingPeriod($property_id) {
		$now = time();
		$today = mktime(0, 0, 0, date('n', $now), date('j', $now), date('Y', $now));
		$year = date('Y', $now);
		$month = date('n', $now);
		// Try to get a cutoff date; if an error is thrown, it's because there's no fiscal calendar for this year
		try {
			$cutoffDay = $this->fiscalcalGateway->getCutoffDay($property_id, $year, $month);
		} catch(\NP\core\Exception $e) {
			return false;
		}
		$cutoffDate = mktime(0, 0, 0, $month, $cutoffDay, $year);
		
		if ($today > $cutoffDate) {
			date_add($cutoffDate, date_interval_create_from_date_string('1 month'));
		}
		
		$accountingPeriod = new \DateTime(date('Y', $cutoffDate) . '/' . date('n', $cutoffDate) . '/1');

		return $accountingPeriod;
	}
}

?>