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

	/**
	 * Gets the period (as a DateTime) that the fiscal year starts
	 */
	public function getFiscalYear($property_id, \DateTime $period=null) {
		// If no period is passed in, use the current period for the property
		if ($period === null) {
			$period = $this->getAccountingPeriod($property_id);
		}

		// Get the configured fiscal year value for the property (starts Jan of Current year, etc.)
		$fiscaldisplaytype_value = (int)$this->propertyGateway->findValue('property_id = ?', [$property_id], 'fiscaldisplaytype_value');

		// Setup some inital variables
		$year       = (int)$period->format('Y');
		$fiscalYear = $year;
		$month      = (int)$period->format('n');

		if ($month < abs($fiscaldisplaytype_value)) {
			$year--;
		}

		// Determine the fiscal year based on the configuration
		if ($fiscaldisplaytype_value > 0 && $month < $fiscaldisplaytype_value) {
			$fiscalYear--;
		} else if ($fiscaldisplaytype_value < 0 && $month >= abs($fiscaldisplaytype_value)) {
			$fiscalYear++;
		}

		$fiscaldisplaytype_value = abs($fiscaldisplaytype_value);

		// Create the start and end periods for the fiscal year
		$start = \DateTime::createFromFormat('Y-n-j H:i:s.u', "{$year}-{$fiscaldisplaytype_value}-1 00:00:00.000");
		$end   = clone $start;
		$end   = $end->add(new \DateInterval('P11M'));

		return ['year'=>$fiscalYear, 'start'=>$start, 'end'=>$end];
	}

}

?>