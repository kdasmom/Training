<?php

namespace NP\property;

use NP\core\AbstractService;

class FiscalCalService extends AbstractService {
	
	/**
	 * Returns the current accounting period for a property
	 *
	 * @param  int   $property_id ID of the property
	 * @return DateTime  The accounting period; returns false if no accounting period is found
	 */
	public function getAccountingPeriod($property_id) {
		$now = time();
		$year = date('Y', $now);
		$month = date('n', $now);
		$day = date('j', $now);

		$today = new \DateTime("{$year}/{$month}/{$day}");
		
		// Try to get a cutoff date; if an error is thrown, it's because there's no fiscal calendar for this year
		try {
			$cutoffDay = $this->fiscalcalGateway->getCutoffDay($property_id, $year, $month);
		} catch(\NP\core\Exception $e) {
			return false;
		}
		$cutoffDate = \DateTime::createFromFormat('Y-n-j H:i:s.u', "{$year}-{$month}-{$cutoffDay} 00:00:00.000");
		
		if ($today > $cutoffDate) {
			$cutoffDate->add(\DateInterval::createFromDateString('1 month'));
		}
		
		$accountingPeriod = new \DateTime($cutoffDate->format('Y/n') . '/1');

		return $accountingPeriod;
	}
}

?>