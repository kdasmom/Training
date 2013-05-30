<?php

namespace NP\property;

use NP\core\AbstractService;
use NP\security\SecurityService;
use NP\user\UserprofileGateway;
use NP\user\PropertyUserprofileGateway;
use NP\invoice\InvoiceService;
use NP\po\PoService;
use NP\workflow\WfRuleTargetGateway;

class PropertyService extends AbstractService {
	
	protected $securityService, $propertyGateway, $regionGateway, $fiscalcalGateway, $propertyUserprofileGateway, 
				$unitGateway, $userprofileGateway, $invoiceService, $poService, $wfRuleTargetGateway,
				$fiscalDisplayTypeGateway, $fiscalcalMonthGateway;
	
	public function __construct(SecurityService $securityService, PropertyGateway $propertyGateway, RegionGateway $regionGateway,
								FiscalcalGateway $fiscalcalGateway, PropertyUserprofileGateway $propertyUserprofileGateway,
								UnitGateway $unitGateway, UserprofileGateway $userprofileGateway, InvoiceService $invoiceService,
								PoService $poService, WfRuleTargetGateway $wfRuleTargetGateway,
								FiscalDisplayTypeGateway $fiscalDisplayTypeGateway, FiscalcalMonthGateway $fiscalcalMonthGateway) {
		$this->securityService            = $securityService;
		$this->propertyGateway            = $propertyGateway;
		$this->regionGateway              = $regionGateway;
		$this->fiscalcalGateway           = $fiscalcalGateway;
		$this->propertyUserprofileGateway = $propertyUserprofileGateway;
		$this->unitGateway                = $unitGateway;
		$this->userprofileGateway         = $userprofileGateway;
		$this->invoiceService             = $invoiceService;
		$this->poService                  = $poService;
		$this->wfRuleTargetGateway        = $wfRuleTargetGateway;
		$this->fiscalDisplayTypeGateway   = $fiscalDisplayTypeGateway;
		$this->fiscalcalMonthGateway      = $fiscalcalMonthGateway;
	}
	
	/**
	 * Retrieves a record for the specified property ID
	 *
	 * @param  int   $property_id ID of the property to retrieve
	 * @return array
	 */
	public function get($property_id) {
		return $this->propertyGateway->findById($property_id);
	}
	
	/**
	 * Retrieves all active properties with limited column info for settings
	 *
	 * @return array
	 */
	public function getAllForSettings() {
		return $this->propertyGateway->find("property_status = 1", array(), "property_name",  array('property_id','property_id_alt','property_name'));
	}

	/**
	 * Retrieves a collection of properties based on status
	 *
	 * @param  int    $property_status The status of the property; can be 1 (active), 0 (inactive), or -1 (on hold)
	 * @param  int    $pageSize        The number of records per page; if null, all records are returned
	 * @param  int    $page            The page for which to return records
	 * @param  string $sort            Field(s) by which to sort the result; defaults to property_name
	 * @return array                   Array of property records
	 */
	public function getByStatus($property_status, $pageSize=null, $page=null, $sort="property_name") {
		return $this->propertyGateway->findByStatus($property_status, $pageSize, $page, $sort);
	}

	/**
	 * Returns properties that are available for bill to/ship to
	 *
	 * @param string $type Whether to get bill to or ship to properties; valid values are 'bill' and 'ship'
	 */
	public function getBillToShipToProperties($type) {
		return $this->propertyGateway->getBillToShipToProperties($type);
	}
	
	/**
	 * Returns the current accounting period for a property
	 *
	 * @param  int   $property_id ID of the property
	 * @return Date  The accounting period
	 */
	public function getAccountingPeriod($property_id) {
		$now = time();
		$today = mktime(0, 0, 0, date('n', $now), date('j', $now), date('Y', $now));
		$year = date('Y', $now);
		$month = date('n', $now);
		$cutoffDay = $this->fiscalcalGateway->getCutoffDay($property_id, $year, $month);
		$cutoffDate = mktime(0, 0, 0, $month, $cutoffDay, $year);
		
		if ($today > $cutoffDate) {
			date_add($cutoffDate, date_interval_create_from_date_string('1 month'));
		}
		
		$accountingPeriod = new \DateTime(date('Y', $cutoffDate) . '/' . date('n', $cutoffDate) . '/1');

		return $accountingPeriod;
	}
	
	/**
	 * Retrieves records from PROPERTY table that display in an invoice line item combo box matching a
	 * specific user and keyword (basically to be used by an autocomplete combo as someody
	 * types into it)
	 *
	 * @param  string $property_keyword A keyword
	 * @return array                    Array of property records
	 */
	public function getForInvoiceItemComboBox($property_keyword) {
		return $this->propertyGateway->findForInvoiceItemComboBox(
			$this->securityService->getUserId(),
			$this->securityService->getDelegatedUserId(),
			$property_keyword
		);
	}

	/**
	 * Get properties a user has permissions to
	 *
	 * @param  int   $userprofile_id              The active user ID, can be a delegated account
	 * @param  int   $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @return array                              Array of property records
	 */
	public function getUserProperties($userprofile_id, $delegated_to_userprofile_id, $cols=array('property_id','property_id_alt','property_name')) {
		return $this->propertyGateway->findByUser($userprofile_id, $delegated_to_userprofile_id, $cols);
	}
	
	/**
	 * Get all the regions in the system
	 *
	 * @return array Array of region records
	 */
	public function getRegions() {
		return $this->regionGateway->find(null, null, 'region_name');
	}
	
	/**
	 * Get regions a user has permissions to
	 *
	 * @param  int   $userprofile_id              The active user ID, can be a delegated account
	 * @param  int   $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @return array                              Array of region records
	 */
	public function getUserRegions($userprofile_id, $delegated_to_userprofile_id) {
		return $this->regionGateway->findByUser($userprofile_id, $delegated_to_userprofile_id);
	}
	
	/**
	 * Retrieves records for units for a property
	 *
	 * @param  int $property_id ID of the property
	 * @return array            Array of unit records
	 */
	public function getUnits($property_id) {
		return $this->unitGateway->find('property_id = ?', array($property_id), "unit_number");
	}

	/**
	 * Sets a list of properties on hold
	 *
	 * @param  string[] $property_id_list The IDs for the properties to perform the operation on
	 * @param  int      $userprofile_id   The user performing the operation
	 * @return array                      Success status of the operation and any errors
	 */
	public function setPropertiesOnHold($property_id_list, $userprofile_id) {
		$this->propertyGateway->beginTransaction();

		$success = true;
		$errors = array();
		try {
			// Update the property status to on hold value
			$this->propertyGateway->updatePropertiesStatus(-1, $property_id_list, $userprofile_id);

			// Remove association to the properties for any users who don't have permissions to view
			// On Hold properties
			$this->propertyUserprofileGateway->deleteUsersWithoutOnHoldPermission($property_id_list);

			$this->propertyGateway->commit();
		} catch(\Exception $e) {
			$this->propertyGateway->rollback();
			$success = false;
		}

		return array('success' => $success);
	}

	/**
	 * Activates a list of properties that were on hold
	 *
	 * @param  string[] $property_id_list The IDs for the properties to perform the operation on
	 * @param  int      $userprofile_id   The user performing the operation
	 * @return array                      Success status of the operation and any errors
	 */
	public function activateProperties($property_id_list, $userprofile_id) {
		$this->propertyGateway->beginTransaction();

		$success = true;
		try {
			// Update the property status to active value
			$this->propertyGateway->updatePropertiesStatus(1, $property_id_list, $userprofile_id);

			// For all activated properties, we need to make sure that they are added to workflow rules
			// that are set for "All Properties"
			$this->wfRuleTargetGateway->addActivatedPropertiesToRules($property_id_list);

			foreach ($property_id_list as $property_id) {
				$this->rollPeriod($property_id);
			}

			$this->propertyGateway->commit();
		} catch(\Exception $e) {
			$this->propertyGateway->rollback();
			$success = false;
		}

		return array('success' => $success);
	}

	/**
	 * Disables a list of properties
	 *
	 * @param  string[] $property_id_list The IDs for the properties to perform the operation on
	 * @param  int      $userprofile_id   The user performing the operation
	 * @return array                      Success status of the operation and any errors
	 */
	public function inactivateProperties($property_id_list, $userprofile_id) {
		$this->propertyGateway->beginTransaction();

		$success = true;
		try {
			// Update the property status to inactive value
			$this->propertyGateway->updatePropertiesStatus(0, $property_id_list, $userprofile_id);

			// Remove all associations for users to these properties
			$this->propertyUserprofileGateway->removeAssociationToProperties($property_id_list);

			// If users have any of these properties set as preferred property, remove them
			$this->userprofileGateway->removePropertiesAsUserPreferred($property_id_list);

			$this->propertyGateway->commit();
		} catch(\Exception $e) {
			$this->propertyGateway->rollback();
			$success = false;
		}

		return array('success' => $success);
	}
	
	/**
	 * Roll invoice and POs for a property
	 */
	public function rollPeriod($property_id) {
		$accountingPeriod = $this->getAccountingPeriod($property_id);
		$lastAccountingPeriod = clone $accountingPeriod;
		$interval = new \DateInterval('P1M');
		$interval->invert = 1;
		$lastAccountingPeriod->add($interval);

		// Roll invoices
		$this->propertyGateway->beginTransaction();
		
		try {
			// Roll invoices
			$this->invoiceService->rollPeriod($property_id, $accountingPeriod, $lastAccountingPeriod);
			
			// Roll PO lines
			$this->poService->rollPeriod($property_id, $accountingPeriod, $lastAccountingPeriod);

			$this->propertyGateway->commit();
		} catch(\Exception $e) {
			$this->propertyGateway->rollback();
		}
	}

	/**
	 * Returns master closing calendars for the application
	 *
	 * @param  int $year The year to get master closing calendars for
	 * @return array     Returns an array of fiscal calendars
	 */
	public function getMasterClosingCalendars($year=null) {
		// If year is null, use current year
		if ($year === null) {
			$year = date('Y');
		}

		return $this->fiscalcalGateway->getMasterClosingCalendars($year);
	}

	/**
	 * Returns the options for fiscal calendar start month
	 *
	 * @return array Array of fiscalDisplayType records
	 */
	public function getFiscalDisplayTypes() {
		return $this->fiscalDisplayTypeGateway->find(null, null, 'fiscaldisplaytype_order');
	}

	/**
	 * Gets all master fiscal calendars not already used by a property
	 *
	 * @return int $property_id The property for which you want to get unused master calendars (optional); null if new property
	 */
	public function getUnusedFiscalCalendars($property_id=null) {
		return $this->fiscalcalGateway->findUnusedFiscalCalendars($property_id);
	}

	/**
	 * Returns fiscal calendars assigned to a property
	 */
	public function getPropertyFiscalCalendars($property_id) {
		return $this->fiscalcalGateway->find(
			array('property_id'=>'?'),
			array($property_id),
			'fiscalcal_year');
	}

	/**
	 * Get the monthly information for a fiscal calendar
	 *
	 * @param  int   $fiscalcal_id The fiscal calendar for which you want to get month info
	 * @return array               Array of fiscalcalmonth records
	 */
	public function getFiscalCalMonths($fiscalcal_id) {
		return $this->fiscalcalMonthGateway->find(
			array('fiscalcal_id'=>'?'),
			array($fiscalcal_id)
		);
	}
}

?>