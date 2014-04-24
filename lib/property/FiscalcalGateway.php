<?php

namespace NP\property;

use NP\core\AbstractGateway;
use NP\core\db\Expression;
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
	public function getCutoffDay($property_id, $year, $month, $asp_client_id = null) {
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
		$queryParams = [$property_id, $year, $month];

		if ($asp_client_id) {
			$select->whereEquals('f.asp_client_id', '?');
			$queryParams[] = $asp_client_id;
		}
		
		$res = $this->adapter->query($select, $queryParams);
		
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
				->whereGreaterThanOrEqual('fiscalcal_year', date('Y', strtotime('now')))
				->order('f.fiscalcal_year desc, f.fiscalcal_name');
		
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

	public function findFiscalCalendarsByType($asp_client_id, $type, $fiscal_calendar_id) {
		$select = new Select();
		$subselect = new Select();

		$queryParams = [];

		$subselect->from(['f2' => 'fiscalcal'])
				->columns(['FISCALCAL_year' => new Expression('f2.FISCALCAL_year - 1')])
				->where([
					'fiscalcal_id' => '?',
					'asp_client_id'	=> '?'
				]);

		$queryParams = [$fiscal_calendar_id, $asp_client_id];


		$select->from(['f' => 'fiscalcal'])
			->where(
				[
					'fiscalcal_type'	=> '?',
					'asp_client_id'		=> '?',
					'FISCALCAL_year'	=> $subselect
				]
			);

		$queryParams = array_merge( [$type, $asp_client_id], $queryParams);

		return $this->adapter->query($select, $queryParams);
	}

	public function getPropertiesForFixcalDistributor($asp_client_id, $org_fiscalcal_id, $dest_fiscalcal_id) {
		$select = new Select();
		$subSelectPropertyIn = new Select();
		$subSelectWhere = new Select();

		$subSelectWhere->from(['f4' => 'fiscalcal'])
					->columns(['fiscalcal_year'])
					->where([
						'fiscalcal_id'	=> '?'
					]);

		$subSelectPropertyIn->from(['f3' => 'fiscalcal'])
				->columns(['property_id'])
				->where([
					'fiscalcal_year'	=> $subSelectWhere
				])
					->whereIsNotNull('property_id');

		$select->from(['f' => 'fiscalcal'])
				->join(['f2' => 'fiscalcal'], 'f.fiscalcal_name = f2.fiscalcal_name', [], Select::JOIN_INNER)
				->join(['p' => 'property'], 'f.property_id = p.property_id', [], Select::JOIN_INNER)
				->columns(['property_id'])
				->where([
					'f2.fiscalcal_id'	=> '?'
				])
				->whereNotIn('f.property_id', $subSelectPropertyIn);

		return $this->adapter->query($select, [$dest_fiscalcal_id, $org_fiscalcal_id]);
	}

	public function getFiscalCalByProperty($property_id, $dest_fiscalcal_id) {
		$selectSaved = $this->find(['fiscalcal_id' => '?'], [$dest_fiscalcal_id], null, ['fiscalcal_name', 'fiscalcal_year']);

		$selectCalendar = $this->find(['fiscalcal_year' => '?', 'property_id' => '?'], [$selectSaved[0]['fiscalcal_year'], $property_id], null, ['fiscalcal_id', 'fiscalcal_year', 'fiscalcal_name']);

		return $selectCalendar;
	}

}

?>