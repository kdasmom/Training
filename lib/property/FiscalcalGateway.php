<?php

namespace NP\property;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\Exception;

/**
 * Gateway for the FISCALCAL table
 *
 * @author Thomas Messier
 */
class FiscalcalGateway extends AbstractGateway {
	
	/**
	 * Gets the cutoff day for a given property, month, and year
	 *
	 * @param  int $property_id ID of the property
	 * @param  int $year        Year (4 digits) you want the cutoff day for
	 * @param  int $month       Month (1-12) you want the cutoff day for
	 * @return int              The cutoff day of the month
	 */
	public function getCutoffDay($property_id, $year, $month) {
		$select = new Select(array('f'=>'fiscalcal'));
		
		$select->columns(array())
				->join(array('fm' => 'fiscalcalmonth'),
						'f.fiscalcal_id = fm.fiscalcal_id',
						array('fiscalcalmonth_cutoff'))
				->where("
					f.property_id = ?
					AND f.fiscalcal_year = ?
					AND fm.fiscalcalmonth_num = ?
				");
		
		$res = $this->adapter->query($select, array($property_id, $year, $month));
		
		if (!count($res)) {
			throw new Exception("No fiscal calendar was found for the year $year and month $month");
		}
		
		return $res[0]['fiscalcalmonth_cutoff'];
	}

}

?>