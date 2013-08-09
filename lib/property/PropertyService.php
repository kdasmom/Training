<?php

namespace NP\property;

use NP\core\AbstractService;
use NP\core\validation\EntityValidator;
use NP\security\SecurityService;
use NP\user\UserprofileGateway;
use NP\user\PropertyUserprofileGateway;
use NP\user\RecAuthorGateway;
use NP\invoice\InvoiceService;
use NP\po\PoService;
use NP\workflow\WfRuleTargetGateway;
use NP\contact\AddressGateway;
use NP\contact\PhoneGateway;
use NP\contact\PhoneTypeGateway;
use NP\system\PnCustomFieldsGateway;
use NP\system\PnCustomFieldDataGateway;
use NP\system\ConfigService;

class PropertyService extends AbstractService {
	
	protected $securityService, $propertyGateway, $regionGateway, $fiscalcalGateway, $propertyUserprofileGateway, 
				$unitGateway, $userprofileGateway, $invoiceService, $poService, $wfRuleTargetGateway,
				$fiscalDisplayTypeGateway, $fiscalcalMonthGateway, $addressGateway, $phoneGateway, $pnCustomFieldsGateway,
				$pnCustomFieldDataGateway, $propertyGlAccountGateway, $configService, $unitTypeGateway, $unitTypeValGateway,
				$unitTypeMeasGateway;
	
	public function __construct(SecurityService $securityService, PropertyGateway $propertyGateway, RegionGateway $regionGateway,
								FiscalcalGateway $fiscalcalGateway, PropertyUserprofileGateway $propertyUserprofileGateway,
								UnitGateway $unitGateway, UserprofileGateway $userprofileGateway, InvoiceService $invoiceService,
								PoService $poService, WfRuleTargetGateway $wfRuleTargetGateway,
								FiscalDisplayTypeGateway $fiscalDisplayTypeGateway, FiscalcalMonthGateway $fiscalcalMonthGateway,
								AddressGateway $addressGateway, PhoneGateway $phoneGateway, PhoneTypeGateway $phoneTypeGateway,
								RecAuthorGateway $recAuthorGateway, PnCustomFieldsGateway $pnCustomFieldsGateway,
								PnCustomFieldDataGateway $pnCustomFieldDataGateway, PropertyGlAccountGateway $propertyGlAccountGateway,
								UnitTypeGateway $unitTypeGateway, UnitTypeValGateway $unitTypeValGateway,
								UnitTypeMeasGateway $unitTypeMeasGateway) {
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
		$this->addressGateway             = $addressGateway;
		$this->phoneGateway               = $phoneGateway;
		$this->phoneTypeGateway           = $phoneTypeGateway;
		$this->recAuthorGateway           = $recAuthorGateway;
		$this->pnCustomFieldsGateway      = $pnCustomFieldsGateway;
		$this->pnCustomFieldDataGateway   = $pnCustomFieldDataGateway;
		$this->propertyGlAccountGateway   = $propertyGlAccountGateway;
		$this->unitTypeGateway            = $unitTypeGateway;
		$this->unitTypeValGateway         = $unitTypeValGateway;
		$this->unitTypeMeasGateway        = $unitTypeMeasGateway;
	}

	/**
	 * Setter for ConfigService injection
	 */
	public function setConfigService(ConfigService $configService) {
		$this->configService = $configService;
	}

	/**
	 * Retrieves a record for the specified property ID
	 *
	 * @param  int   $property_id ID of the property to retrieve
	 * @return array
	 */
	public function get($property_id) {
		$res = $this->propertyGateway->findById($property_id);

		if ($this->configService->get('CP.PROPERTYGLACCOUNT_USE', 0) && $this->securityService->hasPermission(12)) {
			$res['property_gls'] = $this->propertyGlAccountGateway->find(
												array('pg.property_id'=>'?'),
												array($property_id),
												'g.glaccount_number',
												array('glaccount_id')
											);
			$res['property_gls'] = \NP\util\Util::valueList($res['property_gls'], 'glaccount_id');
		}
		
		$res['property_users'] = $this->propertyUserprofileGateway->find(
											array('pu.property_id'=>'?'),
											array($property_id),
											'pe.person_lastname, pe.person_firstname',
											array('userprofile_id')
										);
		$res['property_users'] = \NP\util\Util::valueList($res['property_users'], 'userprofile_id');
		$res['accounting_period'] = $this->getAccountingPeriod($property_id);
		// If no accounting period was found, set it to the first day of this month
		if ($res['accounting_period'] === false) {
			$res['accounting_period'] = new \DateTime(date('Y') . '-' . date('n') . '-01');
		}

		return $res;
	}
	
	/**
	 * Retrieves all properties
	 *
	 * @return array
	 */
	public function getAll() {
		return $this->propertyGateway->find(null, array(), "property_name",  array('property_id','property_id_alt','property_name','property_status','integration_package_id'));
	}

	/**
	 * Retrieves all active properties with limited column info for settings
	 *
	 * @return array
	 */
	public function getAllForSettings() {
		return $this->propertyGateway->find("property_status = 1", array(), "property_name",  array('property_id','property_id_alt','property_name','property_status'));
	}

	/**
	 * Retrieves all active properties for a specified integration package
	 *
	 * @param  int   $integration_package_id
	 * @return array
	 */
	public function getByIntegrationPackage($integration_package_id, $keyword=null) {
		$wheres = array(new sql\criteria\PropertyStatusCriteria(), array('integration_package_id' => '?'));
		$params = array(1, $integration_package_id);

		if ($keyword !== null) {
			$wheres[] = new sql\criteria\PropertyKeywordCriteria();
			$keyword = $keyword . '%';
			$params[] = $keyword;
			$params[] = $keyword;
		}

		return $this->propertyGateway->find(
			\NP\core\db\Where::buildCriteria($wheres),
			$params,
			"property_name",
			array('property_id','property_id_alt','property_name','property_status')
		);
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
		$joins = array(
			new sql\join\PropertyIntPkgJoin(),
			new sql\join\PropertyRegionJoin(),
			new sql\join\PropertyCreatedByUserJoin(),
			new \NP\user\sql\join\UserUserroleJoin(array(
				'created_by_userprofilerole_id' =>'userprofilerole_id',
				'created_by_tablekey_id'        =>'tablekey_id'
			)),
			new \NP\user\sql\join\UserroleStaffJoin(array(
				'created_by_staff_id'  =>'staff_id',
				'created_by_person_id' =>'person_id'
			)),
			new \NP\user\sql\join\StaffPersonJoin(array(
				'created_by_person_firstname' =>'person_firstname',
				'created_by_person_lastname'  =>'person_lastname'
			)),
			new sql\join\PropertyUpdatedByUserJoin(),
			new \NP\user\sql\join\UserUserroleJoin(array(
				'updated_by_userprofilerole_id' =>'userprofilerole_id',
				'updated_by_tablekey_id'        =>'tablekey_id'
			), 'ur2', 'u2'),
			new \NP\user\sql\join\UserroleStaffJoin(array(
				'updated_by_staff_id'  =>'staff_id',
				'updated_by_person_id' =>'person_id'
			), 's2', 'ur2'),
			new \NP\user\sql\join\StaffPersonJoin(array(
				'updated_by_person_firstname' =>'person_firstname',
				'updated_by_person_lastname'  =>'person_lastname'
			), 'pe2', 's2')
		);

		return $this->propertyGateway->find(
			new sql\criteria\PropertyStatusCriteria(),	// filter
			array($property_status),			// params
			$sort,								// order by
			null,								// columns
			$pageSize,
			$page,
			$joins
		);
	}

	/**
	 * Returns properties that are available for bill to/ship to
	 *
	 * @param string $type        Whether to get bill to or ship to properties; valid values are 'bill' and 'ship'
	 * @param int    $property_id A property Id to include in the results
	 */
	public function getBillToShipToProperties($type, $property_id) {
		return $this->propertyGateway->getBillToShipToProperties($type, $property_id);
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
	 * Get all the regions in the system
	 *
	 * @return array Array of region records
	 */
	public function getRegions() {
		return $this->regionGateway->find(null, null, 'region_name');
	}
	
	/**
	 * Retrieves records for units for a property
	 *
	 * @param  int    $property_id ID of the property
	 * @param  string $unit_status The status of units to retrieve
	 * @return array            Array of unit records
	 */
	public function getUnits($property_id, $unit_status=null) {
		$fields = array('u.property_id'=>'?');
		$vals = array($property_id);
		if ($unit_status !== null) {
			$fields['unit_status'] = '?';
			$vals[] = $unit_status;
		}
		return $this->unitGateway->find($fields, $vals, "unit_number");
	}
	
	/**
	 * Retrieves all units, optionally filtering out by status
	 *
	 * @param  string $unit_status The status of units to retrieve
	 * @return array            Array of unit records
	 */
	public function getAllUnits($unit_status=null) {
		$fields = null;
		$params = array();
		if ($unit_status !== null) {
			$fields = array('unit_status' => '?');
			$params[] = $unit_status;
		}
		return $this->unitGateway->find($fields, $params, "unit_number");
	}

	/**
	 * Removes a unit from a property
	 *
	 * @param   array|int $unit_id An array of unit Ids or a single unit Id to remove
	 * @return  array              Success status of the operation and any errors
	 */
	public function removeUnits($unit_id) {
		$this->unitGateway->removeUnits($unit_id);

		return array('success'=>true, 'errors'=>array());
	}
	
	/**
	 * Retrieves records for units for a unit type
	 *
	 * @param  int   $unittype_id ID of the unit type
	 * @return array              Array of unit records
	 */
	public function getUnitsByUnitType($unittype_id) {
		return $this->unitGateway->find('u.unittype_id = ?', array($unittype_id), "u.unit_number");
	}
	
	/**
	 * Retrieves records for units that have not been assigned a type for a property
	 *
	 * @param  int   $property_id ID of the property
	 * @param  int   $unittype_id Optional id for a unit type if you want to also include records assigned to one
	 * @return array              Array of unit records
	 */
	public function getUnitsWithoutType($property_id, $unittype_id=null) {
		return $this->unitGateway->findUnitsWithoutType($property_id, $unittype_id);
	}

	/**
	 * Retrieves unit types for a property
	 *
	 * @param  int     $property_id         ID of the property
	 * @param  boolean $includeMeasurements Whether or not to include measurement data (optional); defaults to false
	 * @param  boolean $includeUnits        Whether or not to include units assigned (optional); defaults to false
	 * @return array                        Array of unit type records
	 */
	public function getUnitTypesByProperty($property_id, $includeMeasurements=false, $includeUnits=false) {
		$unitTypes = $this->unitTypeGateway->find('ut.property_id = ?', array($property_id), 'unittype_name');
		for ($i=0; $i<count($unitTypes); $i++) {
			if ($includeMeasurements) {
				$unitTypes[$i]['vals'] = $this->getUnitTypeVals($unitTypes[$i]['unittype_id']);
			}
			if ($includeUnits) {
				$unitTypes[$i]['units'] = $this->getUnitsByUnitType($unitTypes[$i]['unittype_id']);
			}
		}
		return $unitTypes;
	}

	/**
	 * Retrieves values set for a unit type
	 *
	 * @param  int   $unittype_id The unit to get values for
	 * @return array
	 */
	public function getUnitTypeVals($unittype_id) {
		return $this->unitTypeValGateway->find('unittype_id = ?', array($unittype_id));
	}

	/**
	 * Gets all unit type measurement options
	 *
	 * @return array
	 */
	public function getUnitTypeMeasurements() {
		return $this->unitTypeMeasGateway->findAllMeasAndMaterials();
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
	 * @return int $property_id The property for which you want to get unused master calendars
	 */
	public function getUnusedFiscalCalendars($property_id) {
		return $this->addMonthsToFiscalCals(
			$this->fiscalcalGateway->findUnusedFiscalCalendars($property_id)
		);
	}

	/**
	 * Returns fiscal calendars assigned to a property
	 *
	 * @param  int   $property_id
	 * @return array
	 */
	public function getPropertyFiscalCalendars($property_id) {
		return $this->addMonthsToFiscalCals(
			$this->fiscalcalGateway->find(
				array('property_id'=>'?'),
				array($property_id),
				'fiscalcal_year'
			)
		);
	}

	/**
	 * Returns master fiscal calendars
	 *
	 * @return array
	 */
	public function getMasterFiscalCalendars() {
		return $this->addMonthsToFiscalCals(
			$this->fiscalcalGateway->findMasterFiscalCalendars()
		);
	}

	protected function addMonthsToFiscalCals($fiscalcals) {
		for ($i=0; $i<count($fiscalcals); $i++) {
			$fiscalcals[$i]['months'] = $this->getFiscalCalMonths($fiscalcals[$i]['fiscalcal_id']);
		}

		return $fiscalcals;
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

	/**
	 * Checks if a GL account is assigned to a property
	 * @param  int     $property_id
	 * @param  int     $glaccount_id
	 * @return boolean
	 */
	public function isGlAssigned($property_id, $glaccount_id) {
		$res = $this->propertyGlAccountGateway->find(
			array('pg.property_id'=>'?', 'pg.glaccount_id'=>'?'),
			array($property_id, $glaccount_id),
			null,
			array('propertyglaccount_id')
		);

		return (count($res)) ? true : false;
	}

	/**
	 * Saves a property
	 *
	 * @param  array $data An associative array with the data needed to save a property
	 * @return array       An array with success status of the operation and any errors that happened
	 */
	public function saveProperty($data) {
		try {
			// Get entities
			$property  = new PropertyEntity($data['property']);
			$address   = new \NP\contact\AddressEntity($data['address']);
			$phone     = new \NP\contact\PhoneEntity($data['phone']);
			$fax       = new \NP\contact\PhoneEntity($data['fax_phone']);

			// Run validation
			$validator = new EntityValidator();
			$validator->validate($property);
			$errors    = $validator->getErrors();

			$now = \NP\util\Util::formatDateForDB();

			if (!count($errors)) {
				$this->propertyGateway->beginTransaction();

				// Check if dealing with a new or existing property
				$isNew = ($property->property_id === null) ? true : false;

				// Save the property record
				$this->propertyGateway->save($property);

				// If dealing with new property only
				if ($isNew) {
					// Update the billto/shipto property IDs to be the ones for this property and re-save the record
					$property->default_billto_property_id = $property->property_id;
					$property->default_shipto_property_id = $property->property_id;
					$this->propertyGateway->save($property);

					// Save the creator of the property
					$this->recAuthorGateway->save(array(
						'userprofile_id'               => $data['userprofile_id'],
						'delegation_to_userprofile_id' => $data['delegation_to_userprofile_id'],
						'table_name'                   => 'property',
						'tablekey_id'                  => $property->property_id,
						'recauthor_datetm'             => $now
					));

					// Give the creator of the property permissions to it
					$this->propertyUserprofileGateway->save(array(
						'property_id'    => $property->property_id,
						'userprofile_id' => $data['userprofile_id']
					));

					// Make sure property is added to workflow rules that are set for "All Properties"
					$this->wfRuleTargetGateway->addActivatedPropertiesToRules($property->property_id);

					// Convert the fiscal cal provided to a format that can be used by the saveFiscalCal() method
					// that gets called later
					$data['fiscalcals'] = array($this->fiscalcalGateway->findById($data['fiscalcal_id']));
					$data['fiscalcals'][0]['fiscalcal_id'] = null;
					$data['fiscalcals'][0]['property_id'] = $property->property_id;
					$data['fiscalcals'][0]['fiscalcal_type'] = 'assigned';
					$data['fiscalcals'][0]['months'] = $this->fiscalcalMonthGateway->find('fiscalcal_id = ?', array($data['fiscalcal_id']));
					foreach ($data['fiscalcals'][0]['months'] as $idx=>$fiscalcalMonthData) {
						$data['fiscalcals'][0]['months'][$idx]['fiscalcalmonth_id'] = null;
					}
				}

				// Set the property ID on address, validates it, and save it
				$address->table_name = 'property';
				$address->tablekey_id = $property->property_id;
				$validator->validate($address);
				$errors    = array_merge($errors, $addressErrors = $validator->getErrors());
				if (!count($addressErrors)) {
					$this->addressGateway->save($address);
				}

				// Set the property ID on phone, validates it, and save it
				$phone->table_name = 'property';
				$phone->tablekey_id = $property->property_id;
				$phone->phonetype_id = $this->phoneTypeGateway->find(array('phonetype_name'=>'?'), array('Main'));
				$phone->phonetype_id = $phone->phonetype_id[0]['phonetype_id'];
				$validator->validate($phone);
				$errors    = array_merge($errors, $phoneErrors = $validator->getErrors());
				if (!count($phoneErrors)) {
					$this->phoneGateway->save($phone);
				}

				// Set the property ID on fax, validates it, and save it
				$fax->table_name = 'property';
				$fax->tablekey_id = $property->property_id;
				$fax->phonetype_id = $this->phoneTypeGateway->find(array('phonetype_name'=>'?'), array('Fax'));
				$fax->phonetype_id = $fax->phonetype_id[0]['phonetype_id'];
				$validator->validate($fax);
				$errors    = array_merge($errors, $faxErrors = $validator->getErrors());
				if (!count($faxErrors)) {
					$this->phoneGateway->save($fax);
				}

				// Save property custom field data
				$customFields = $this->pnCustomFieldsGateway->findCustomFieldData('property', $property->property_id);
				foreach ($customFields as $field) {
					$formFieldName = $field['customfield_name'];
					// Build the data array
					$fieldData = array(
						'customfielddata_id'           => $field['customfielddata_id'],
						'customfield_id'               => $field['customfield_id'],
						'customfielddata_table_id'     => $property->property_id,
						'customfielddata_value'        => $data[$formFieldName],
						'customfielddata_lastupdatedt' => $now,
						'customfielddata_lastupdateby' => $data['userprofile_id']
					);
					// If the custom field data is new, also give it a created date and user
					if ($field['customfielddata_id'] === null) {
						$fieldData['customfielddata_createdt']  = $now;
						$fieldData['customfielddata_createdby'] = $data['userprofile_id'];
					}
					// Save the custom field data
					$this->pnCustomFieldDataGateway->save($fieldData);
				}

				// Save GL assignments if any
				if (array_key_exists('property_gls', $data) && is_array($data['property_gls'])) {
					$success = $this->saveGlAssignment($property->property_id, $data['property_gls']);
					if (!$success) {
						$errors[] = array(
										'field' => 'global',
										'msg'   => $this->localizationService->getMessage('glAssignmentError')
									);
					}
				}

				// Save user assignments if any
				if (array_key_exists('property_users', $data)) {
					$success = $this->saveUserAssignment($property->property_id, $data['property_users']);
					if (!$success) {
						$errors[] = array(
										'field' => 'global',
										'msg'   => $this->localizationService->getMessage('userAssignmentError')
									);
					}
				}

				// Save fiscal calendars if any
				if (array_key_exists('fiscalcals', $data)) {
					foreach ($data['fiscalcals'] as $fiscalcalData) {
						$fiscalcalData['property_id'] = $property->property_id;
						$saveStatus = $this->saveFiscalCal($fiscalcalData);
						if (!$saveStatus['success']) {
							$errors[] = array(
										'field' => 'global',
										'msg'   => $this->localizationService->getMessage('fiscalCalSaveError')
									);
							break;
						}
					}
				}

				// Save units if any
				if (array_key_exists('units', $data)) {
					foreach ($data['units'] as $unitData) {
						// Save the unit
						$unit = new UnitEntity($unitData);
						$unit->property_id = $property->property_id;
						$this->unitGateway->save($unit);
					}
				}

				// Remove units if any were deleted
				if (array_key_exists('removedUnits', $data) && count($data['removedUnits'])) {
					$this->unitGateway->removeUnits(
						\NP\util\Util::valueList($data['removedUnits'], 'unit_id')
					);
				}

				// Save unit types if any
				if (array_key_exists('unitTypes', $data)) {
					foreach ($data['unitTypes'] as $unitTypeData) {
						// Save the fiscal calendar
						$unitType = new UnitTypeEntity($unitTypeData);
						$unitType->property_id = $property->property_id;
						$unitType->unittype_updated_by = $data['userprofile_id'];
						$unitType->unittype_updated_date = $now;
						$this->unitTypeGateway->save($unitType);

						// Save the values for the unit type
						if (array_key_exists('vals', $unitTypeData)) {
							foreach ($unitTypeData['vals'] as $unitTypeValData) {
								$unitTypeVal = new UnitTypeValEntity($unitTypeValData);
								$unitTypeVal->unittype_id = $unitType->unittype_id;
								$this->unitTypeValGateway->save($unitTypeVal);
							}
						}

						// Save the unit assignments
						$this->unitGateway->update(array('unittype_id'=>null), 'unittype_id = ?', array($unitType->unittype_id));
						foreach ($unitTypeData['units'] as $unitData) {
							$unit = new UnitEntity($unitData);
							$unit->unittype_id = $unitType->unittype_id;
							$this->unitGateway->save($unit);
						}
					}
				}
			}

			if (!count($errors)) {
				$this->propertyGateway->commit();
			}
		} catch(\Exception $e) {
			// If there was an error, rollback the transaction
			$this->propertyGateway->rollback();
			// Add a global error to the error array
			$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
		}

		return array(
			'success'    => (count($errors)) ? false : true,
			'errors'     => $errors,
			'id'         => $property->property_id
		);
	}

	/**
	 * Save GL accounts assigned to a property
	 *
	 * @param  int     $property_id       Id of the property to save GL accounts for
	 * @param  array   $glaccount_id_list Array of GL account Ids to save
	 * @return boolean                    Whether or not the operation was successful
	 */
	public function saveGlAssignment($property_id, $glaccount_id_list) {
		// Start a DB transaction
		$this->propertyGlAccountGateway->beginTransaction();

		$success = true;
		try {
			// Remove all property associations for this user
			$this->propertyGlAccountGateway->delete('property_id = ?', array($property_id));

			// Insert new property associations for this user
			foreach ($glaccount_id_list as $glaccount_id) {
				$this->propertyGlAccountGateway->insert(array(
					'property_id'  => $property_id,
					'glaccount_id' => $glaccount_id
				));
			}

			// Commit the data
			$this->propertyGlAccountGateway->commit();
		} catch(\Exception $e) {
			// If there was an error, rollback the transaction
			$this->propertyGlAccountGateway->rollback();
			// Change success to indicate failure
			$success = false;
		}

		return $success;
	}

	/**
	 * Save users assigned to a property
	 *
	 * @param  int     $property_id         Id of the property to save GL accounts for
	 * @param  array   $userprofile_id_list Array of user Ids to save
	 * @return boolean                      Whether or not the operation was successful
	 */
	public function saveUserAssignment($property_id, $userprofile_id_list) {
		// Start a DB transaction
		$this->propertyUserprofileGateway->beginTransaction();

		$success = true;
		try {
			// Remove all user associations for this property
			$this->propertyUserprofileGateway->delete('property_id = ?', array($property_id));

			// Insert new user associations for this property
			foreach ($userprofile_id_list as $userprofile_id) {
				$this->propertyUserprofileGateway->insert(array(
					'property_id'  => $property_id,
					'userprofile_id' => $userprofile_id
				));
			}

			// Commit the data
			$this->propertyUserprofileGateway->commit();
		} catch(\Exception $e) {
			// If there was an error, rollback the transaction
			$this->propertyUserprofileGateway->rollback();
			// Change success to indicate failure
			$success = false;
		}

		return $success;
	}

	/**
	 * Saves a fiscal calendar
	 *
	 * @param  array   $data
	 * @return boolean
	 */
	public function saveFiscalCal($data) {
		$this->fiscalcalGateway->beginTransaction();

		$errors = array();
		try {
			$fiscalcal = new FiscalCalEntity($data);
			$fiscalcal->asp_client_id = $this->configService->getClientId();
			if ($this->fiscalcalGateway->isDuplicateCalendar(
				$fiscalcal->fiscalcal_id, $fiscalcal->fiscalcal_name, $fiscalcal->fiscalcal_year, $fiscalcal->property_id
			)) {
				$errors[] = array(
								'field' => 'global',
								'msg'   => $this->localizationService->getMessage('duplicateFiscalCalError'),
								'extra' => null
							);
			} else {
				$this->fiscalcalGateway->save($fiscalcal);

				// Save the months for the fiscal calendar if any
				if (array_key_exists('months', $data)) {
					foreach ($data['months'] as $fiscalcalMonthData) {
						$fiscalcalMonth = new FiscalCalMonthEntity($fiscalcalMonthData);
						$fiscalcalMonth->fiscalcal_id = $fiscalcal->fiscalcal_id;
						$this->fiscalcalMonthGateway->save($fiscalcalMonth);
					}
				}

				// Commit the transaction
				$this->fiscalcalGateway->commit();
			}
		} catch(\Exception $e) {
			// If there was an error, rollback the transaction
			$this->fiscalcalGateway->rollback();
			// Change success to indicate failure
			$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
		}

		return array(
			'success'    => (count($errors)) ? false : true,
			'errors'     => $errors,
		);
	}
}

?>