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

	/**
	 * Returns master closing calendars for the application
	 *
	 * @param  int $year The year to get master closing calendars for
	 * @return array     Returns an array of fiscal calendars
	 */
	public function getMasterClosingCalendars($year) {
		$select = new Select();

		$select->from('fiscalcal')
				->whereIsNull('property_id')
				->whereEquals('fiscalcal_year', '?')
				->order('fiscalcal_year DESC');
		
		return $this->adapter->query($select, array($year));
	}

	/**
	 * Gets all master fiscal calendars not already used by a property
	 *
	 * @return int $property_id The property for which you want to get unused master calendars (optional); null if new property
	 */
	public function findUnusedFiscalCalendars($property_id) {
		$select = new Select();
		$subSelect = new Select();
		$select->from(array('f'=>'fiscalcal'))
				->whereIsNull('f.property_id')
				->whereEquals('f.fiscalcal_type', '?')
				->order('f.fiscalcal_year, f.fiscalcal_name');
		
		$params = array('template');

		if ($property_id !== null) {
			$select->whereNotExists(
				$subSelect->from(array('f2'=>'fiscalcal'))
							->whereEquals('f2.fiscalcal_name', 'f.fiscalcal_name')
							->whereEquals('f2.fiscalcal_year', 'f.fiscalcal_year')
							->whereEquals('f2.property_id', '?')
			);
			$params[] = $property_id;
		}

		return $this->adapter->query($select, $params);
	}

	/**
	 * Returns master fiscal calendars (fiscal calendars not assigned to a property)
	 *
	 * @return array
	 */
	public function findMasterFiscalCalendars($fiscalcal_name=null) {
		$select = new Select();
		$select->from('fiscalcal')
				->whereIsNull('property_id')
				->order('fiscalcal_year');

		$params = array();
		if ($fiscalcal_name !== null) {
			$select->whereEquals('fiscalcal_name', '?');
			$params[] = $fiscalcal_name;
		}

		return $this->adapter->query($select, $params);
	}

	/**
	 * Checks for duplicate master calendars
	 *
	 */
	public function isDuplicateCalendar($fiscalcal_id, $fiscalcal_name, $fiscalcal_year, $property_id) {
		$select = new Select();
		$select->count(true, 'total')
				->from('fiscalcal')
				->whereEquals('fiscalcal_name', '?')
				->whereEquals('fiscalcal_year', '?')
				->whereEquals('fiscalcal_type', '?');

		$params = array($fiscalcal_name, $fiscalcal_year, 'template');
		if ($fiscalcal_id !== null) {
			$select->whereNotEquals('fiscalcal_id', '?');
			$params[] = $fiscalcal_id;
		}
		if ($property_id !== null) {
			$select->whereEquals('property_id', '?');
			$params[] = $property_id;
		} else {
			$select->whereIsNull('property_id');
		}
		
		$res = $this->adapter->query($select, $params);
		
		return ($res[0]['total']) ? true : false;
	}

}

?>