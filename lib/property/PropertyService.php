<?php

namespace NP\property;

use NP\core\AbstractService;
use NP\core\db\Select;
use NP\security\SecurityService;
use NP\invoice\InvoiceService;
use NP\po\PoService;
use NP\system\ConfigService;

class PropertyService extends AbstractService {
	
	protected $securityService, $invoiceService, $poService, $configService,
			$fiscalCalService, $unitTypeMeasGateway;
	
	public function __construct(SecurityService $securityService, InvoiceService $invoiceService,
								PoService $poService, FiscalCalService $fiscalCalService, UnitTypeMeasGateway $unitTypeMeasGateway) {
		$this->securityService            = $securityService;
		$this->invoiceService             = $invoiceService;
		$this->poService                  = $poService;
		$this->fiscalCalService           = $fiscalCalService;
		$this->unitTypeMeasGateway			= $unitTypeMeasGateway;
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
		$res['property_name'] = htmlspecialchars_decode($res['property_name']);


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
	public function getAll($property_id=null, $integration_package_id=null, $keyword=null, $property_status=null) {
		return $this->propertyGateway->findAll($property_id, $integration_package_id, $keyword, $property_status);
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
	public function getByStatus($property_status=null, $pageSize=null, $page=null, $sort="property_name") {
		return $this->propertyGateway->findByStatus($property_status, $pageSize, $page, $sort);
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
	 * Returns the current accounting period for a property; this method is deprecated, function is now in FiscalCalService
	 *
	 * @param  int   $property_id ID of the property
	 * @return DateTime  The accounting period; returns false if no accounting period is found
	 */
	public function getAccountingPeriod($property_id) {
		return $this->fiscalCalService->getAccountingPeriod($property_id);
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
		return $this->fiscalCalMonthGateway->find(
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
			$errors    = $this->entityValidator->validate($property);

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
					$data['fiscalcals'][0]['months'] = $this->fiscalCalMonthGateway->find('fiscalcal_id = ?', array($data['fiscalcal_id']));
					foreach ($data['fiscalcals'][0]['months'] as $idx=>$fiscalcalMonthData) {
						$data['fiscalcals'][0]['months'][$idx]['fiscalcalmonth_id'] = null;
					}
				}

				// Set the property ID on address, validates it, and save it
				if (!count($errors)) {
					$address->table_name = 'property';
					$address->tablekey_id = $property->property_id;
					$errors    = array_merge($errors, $this->entityValidator->validate($address));
					if (!count($errors)) {
						$this->addressGateway->save($address);
					}
				}

				// Set the property ID on phone, validates it, and save it
				if (!count($errors)) {
					$phone->table_name = 'property';
					$phone->tablekey_id = $property->property_id;
					$phone->phonetype_id = $this->phoneTypeGateway->find(array('phonetype_name'=>'?'), array('Main'));
					$phone->phonetype_id = $phone->phonetype_id[0]['phonetype_id'];
					$errors    = array_merge($errors, $this->entityValidator->validate($phone));
					if (!count($errors)) {
						$this->phoneGateway->save($phone);
					}
				}

				// Set the property ID on fax, validates it, and save it
				if (!count($errors)) {
					$fax->table_name = 'property';
					$fax->tablekey_id = $property->property_id;
					$fax->phonetype_id = $this->phoneTypeGateway->find(array('phonetype_name'=>'?'), array('Fax'));
					$fax->phonetype_id = $fax->phonetype_id[0]['phonetype_id'];
					$errors    = array_merge($errors, $this->entityValidator->validate($fax));
					if (!count($errors)) {
						$this->phoneGateway->save($fax);
					}
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
						$unitData['property_id'] = $property->property_id;
						$saveStatus = $this->saveUnit($unitData);
						if (!$saveStatus['success']) {
							$errors[] = array(
										'field' => 'global',
										'msg'   => $this->localizationService->getMessage('unitSaveError')
									);
							break;
						}
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
						// Save the unit type
						$unitTypeData['property_id'] = $property->property_id;
						$unitTypeData['unittype_updated_by'] = $data['userprofile_id'];
						$unitTypeData['unittype_updated_date'] = $now;

						$saveStatus = $this->saveUnitType($unitTypeData);
						if (!$saveStatus['success']) {
							$errors[] = array(
										'field' => 'global',
										'msg'   => $this->localizationService->getMessage('unitTypeSaveError')
									);
							break;
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
	 * Saves a unit
	 */
	public function saveUnit($data) {
		$unit = new UnitEntity($data);
		$errors    = $this->entityValidator->validate($unit);

		if (!count($errors)) {
			try{
				$this->unitGateway->save($unit);
			} catch(\Exception $e) {
				// Add a global error to the error array
				$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
			}
		}

		return array(
			'success'    => (count($errors)) ? false : true,
			'errors'     => $errors,
			'id'         => $unit->unit_id
		);
	}

	/**
	 * Saves a unit type
	 */
	public function saveUnitType($data) {
		$unitType = new UnitTypeEntity($data);
		$errors    = $this->entityValidator->validate($unitType);

		if (!count($errors)) {
			$this->unitTypeGateway->beginTransaction();

			try{
				$this->unitTypeGateway->save($unitType);

				if (array_key_exists('vals', $data)) {
					foreach ($data['vals'] as $unitTypeValData) {
						$unitTypeVal = new UnitTypeValEntity($unitTypeValData);
						$unitTypeVal->unittype_id = $unitType->unittype_id;
						$typeValErrors = $this->entityValidator->validate($unitTypeVal);
						if (count($typeValErrors)) {
							$errors[] = array('field'=>'global', 'msg'=>'unitTypeSaveError');
							$this->loggingService->log('error', 'Error saving unittype_val record', $typeValErrors);
							break;
						} else {
							$this->unitTypeValGateway->save($unitTypeVal);
						}
					}
				}

				// Save unit assignments
				if (array_key_exists('units', $data)) {
					$this->unitGateway->update(array('unittype_id'=>null), 'unittype_id = ?', array($unitType->unittype_id));
					foreach ($data['units'] as $unitData) {
						$unitData['unittype_id'] = $unitType->unittype_id;
						$unitErrors = $this->saveUnit($unitData);
						if (count($unitErrors)) {
							$errors[] = array('field'=>'global', 'msg'=>'unitSaveError');
							$this->loggingService->log('error', 'Error saving unit assignments', $unitErrors);
							break;
						}
					}
				}
			} catch(\Exception $e) {
				// Add a global error to the error array
				$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
			}
		}

		if (count($errors)) {
			$this->unitTypeGateway->rollback();
		} else {
			$this->unitTypeGateway->commit();
		}

		return array(
			'success'    => (count($errors)) ? false : true,
			'errors'     => $errors,
			'id'         => $unitType->unittype_id
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
						$this->fiscalCalMonthGateway->save($fiscalcalMonth);
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

	/**
	 * Saves a collection of properties imported from a file through the import tool
	 */
	public function savePropertyFromImport($data) {
		// Use this to store integration package IDs
		$intPkgs            = array();
		$fiscalDisplayTypes = array();
		$fiscalCals         = array();
		$regions            = array();
		$errors             = array();

        // Loop through all the rows to import
        foreach ($data as $idx=>$row) {
        	// Check if property is new, if not include property_id
        	$rec = $this->propertyGateway->find('property_id_alt = ?', array($row['property_id_alt']));
        	if (count($rec)) {
        		$row['property_id'] = $rec[0]['property_id'];
        	}

            // If there's been no record with this integration package, we need to retrieve the ID for it
            if (!array_key_exists($row['integration_package_name'], $intPkgs)) {
                $rec = $this->integrationPackageGateway->find(
                    'integration_package_name = ?',
                    array($row['integration_package_name'])
                );
                $intPkgs[$row['integration_package_name']] = $rec[0]['integration_package_id'];
            }
            $row['integration_package_id'] = $intPkgs[$row['integration_package_name']];

            // If there's been no record with this fiscal display type, we need to retrieve the ID for it
            if (!array_key_exists($row['fiscaldisplaytype_name'], $fiscalDisplayTypes)) {
                $rec = $this->fiscalDisplayTypeGateway->find(
                    'fiscaldisplaytype_name = ?',
                    array($row['fiscaldisplaytype_name'])
                );
                $fiscalDisplayTypes[$row['fiscaldisplaytype_name']] = $rec[0]['fiscaldisplaytype_id'];
            }
            $row['fiscaldisplaytype_value'] = $fiscalDisplayTypes[$row['fiscaldisplaytype_name']];

            // If there's been no record with this fiscal calendar, we need to retrieve the ID for it
            if (!array_key_exists($row['fiscalcal_name'], $fiscalCals)) {
                $rec = $this->fiscalcalGateway->findMasterFiscalCalendars($row['fiscalcal_name']);
                $fiscalCals[$row['fiscalcal_name']] = $rec[0]['fiscalcal_id'];
            }
            $fiscalcal_id = $fiscalCals[$row['fiscalcal_name']];

            if (!array_key_exists($row['region_name'], $regions)) {
                $rec = $this->regionGateway->find(
                	'region_name = ?',
                    array($row['region_name'])
                );
                $regions[$row['region_name']] = $rec[0]['region_id'];
            }
            $row['region_id'] = $regions[$row['region_name']];

            // Split the zip code if necessary
            $row['address_zipext'] = '';
            if ($row['address_zip'] != '') {
            	$zip = explode('-', $row['address_zip']);
            	if (count($zip) > 1) {
            		$row['address_zip'] = $zip[0];
            		$row['address_zipext'] = $zip[1];
            	}
            }
            // Package the address record
            $address = array_intersect_key(
            	$row,
            	array_flip(array('address_attn','address_line1','address_line2','address_state',
            					'address_city','address_zip','address_zipext'))
            );

            // Package the phone record
            $phone = array('phone_number'=>$row['phone_number']);

            // Package the fax record
            $fax   = array('phone_number'=>$row['fax_number']);

            $row['property_optionBillAddress'] = strtolower($row['property_optionBillAddress']);
            $row['property_optionBillAddress'] = ($row['property_optionBillAddress'] == 'yes') ? 1 : 0;
            $row['property_optionShipAddress'] = strtolower($row['property_optionShipAddress']);
            $row['property_optionShipAddress'] = ($row['property_optionShipAddress'] == 'yes') ? 1 : 0;
            $row['property_id_alt_ap']         = $row['property_id_alt'];

            $propertyData = array(
				'property'                     => $row,
				'address'                      => $address,
				'phone'                        => $phone,
				'fax_phone'                    => $fax,
				'fiscalcal_id'                 => $fiscalcal_id,
				'userprofile_id'               => $this->securityService->getUserId(),
				'delegation_to_userprofile_id' => $this->securityService->getUserId()
            );

            // Process and package custom field values
            for ($i=1; $i<=4; $i++) {
	            $field = "customfielddata_value{$i}";
	            $rec = $this->pnCustomFieldsGateway->find(
	                array('customfield_name'=>'?', 'customfield_pn_type'=>'?'),
	                array("propertyCustom{$i}", 'property')
	            );
	            $rec = $rec[0];
	            $propertyData[$rec['customfield_name']] = $row[$field];
	        }

	        // Save the row
            $result = $this->saveProperty($propertyData);

            // Set errors
            if (!$result['success']) {
            	$rowNum = $idx + 1;
                $errorMsg = $this->localizationService->getMessage('importRecordSaveError') . " {$rowNum}";
                $errors[] = $errorMsg;

                $this->loggingService->log('error', 'Error importing property data', $result['errors']);
            }
        }

        $error = implode('<br />', $errors);
        return array(
            'success' => (count($errors)) ? false : true,
            'error'  => $error
        );
	}

	/**
	 * Saves a collection of property/GL assignments imported from a file through the import tool
	 */
	public function savePropertyGLFromImport($data) {
		// Use this to store integration package IDs
		$intPkgs            = array();
		$errors             = array();

        // Loop through all the rows to import
        foreach ($data as $idx=>$row) {
            // If there's been no record with this integration package, we need to retrieve the ID for it
            if (!array_key_exists($row['integration_package_name'], $intPkgs)) {
                $rec = $this->integrationPackageGateway->find(
                    'integration_package_name = ?',
                    array($row['integration_package_name'])
                );
                $intPkgs[$row['integration_package_name']] = $rec[0]['integration_package_id'];
            }
            $integration_package_id = $intPkgs[$row['integration_package_name']];

            // Get property ID
        	$prop = $this->propertyGateway->find(
        		array('property_id_alt'=>'?', 'integration_package_id'=>'?'),
        		array($row['property_id_alt'], $integration_package_id)
        	);

        	// Get GL account ID
        	$gl = $this->glAccountGateway->find(
        		array('glaccount_number'=>'?', 'integration_package_id'=>'?'),
        		array($row['glaccount_number'], $integration_package_id)
        	);

            // Save the row
            $result = $this->saveGlAssignment($prop[0]['property_id'], array($gl[0]['glaccount_id']));

            // Set errors
            if (!$result) {
            	$rowNum = $idx + 1;
                $errorMsg = $this->localizationService->getMessage('importRecordSaveError') . " {$rowNum}";
                $errors[] = $errorMsg;

                $this->loggingService->log('error', 'Error importing property/gl data');
            }
        }

        $error = implode('<br />', $errors);
        return array(
            'success' => (count($errors)) ? false : true,
            'error'  => $error
        );
	}

	/**
	 * Saves a collection of units imported from the import tool
	 */
	public function saveUnitFromImport($data) {
		// Use this to store integration package IDs
		$intPkgs = array();
		$props   = array();
		$errors  = array();

        // Loop through all the rows to import
        foreach ($data as $idx=>$row) {
            // If there's been no record with this integration package, we need to retrieve the ID for it
            if (!array_key_exists($row['integration_package_name'], $intPkgs)) {
                $rec = $this->integrationPackageGateway->find(
                    'integration_package_name = ?',
                    array($row['integration_package_name'])
                );
                $intPkgs[$row['integration_package_name']] = $rec[0]['integration_package_id'];
            }
            $row['integration_package_id'] = $intPkgs[$row['integration_package_name']];

            // If there's been no record with this property, we need to retrieve the ID for it
            if (!array_key_exists($row['property_id_alt'], $intPkgs)) {
                $rec = $this->propertyGateway->find(
	        		array('property_id_alt'=>'?', 'integration_package_id'=>'?'),
	        		array($row['property_id_alt'], $row['integration_package_id'])
	        	);
                $props[$row['integration_package_name']] = $rec[0]['property_id'];
            }
        	$row['property_id'] = $props[$row['property_id_alt']];

            // Get unit type ID
        	$unittype = $this->unitTypeGateway->find(
        		array('ut.property_id'=>'?', 'ut.unittype_name'=>'?'),
        		array($prop[0]['property_id'], $row['unittype_name'])
        	);
        	$row['unittype_id'] = $unittype[0]['unittype_id'];

            // Save the row
            $result = $this->saveUnit($row);

            // Set errors
            if (!$result['success']) {
            	$rowNum = $idx + 1;
                $errorMsg = $this->localizationService->getMessage('importRecordSaveError') . " {$rowNum}";
                $errors[] = $errorMsg;

                $this->loggingService->log('error', 'Error importing unit data', $result['errors']);
            }
        }

        $error = implode('<br />', $errors);
        return array(
            'success' => (count($errors)) ? false : true,
            'error'  => $error
        );
	}

	/**
	 * Saves a collection of units imported from the import tool
	 */
	public function saveUnitTypeFromImport($data) {
		// Use this to store integration package IDs
		$intPkgs = array();
		$props   = array();
		$errors  = array();

        // Loop through all the rows to import
        foreach ($data as $idx=>$row) {
            // If there's been no record with this integration package, we need to retrieve the ID for it
            if (!array_key_exists($row['integration_package_name'], $intPkgs)) {
                $rec = $this->integrationPackageGateway->find(
                    'integration_package_name = ?',
                    array($row['integration_package_name'])
                );
                $intPkgs[$row['integration_package_name']] = $rec[0]['integration_package_id'];
            }
            $integration_package_id = $intPkgs[$row['integration_package_name']];

            // If there's been no record with this property, we need to retrieve the ID for it
            if (!array_key_exists($row['property_id_alt'], $intPkgs)) {
                $rec = $this->propertyGateway->find(
	        		array('property_id_alt'=>'?', 'integration_package_id'=>'?'),
	        		array($row['property_id_alt'], $integration_package_id)
	        	);
                $props[$row['property_id_alt']] = $rec[0]['property_id'];
            }
        	$row['property_id'] = $props[$row['property_id_alt']];

        	// Set material and measurement values
        	$valTypeRecs = $this->getUnitTypeMeasurements();
			$row['vals'] = array();
        	foreach ($valTypeRecs as $valType) {
        		$valKey = strtolower("{$valType['unittype_material_name']}_{$valType['unittype_meas_name']}");
        		$row['vals'][] = array(
					'unittype_material_id' => $valType['unittype_material_id'],
					'unittype_meas_id'     => $valType['unittype_meas_id'],
					'unittype_val_val'     => $row[$valKey]
        		);
        	}

            // Save the row
            $result = $this->saveUnitType($row);

            // Set errors
            if (!$result['success']) {
            	$rowNum = $idx + 1;
                $errorMsg = $this->localizationService->getMessage('importRecordSaveError') . " {$rowNum}";
                $errors[] = $errorMsg;

                $this->loggingService->log('error', 'Error importing unit type data', $result['errors']);
            }
        }

        $error = implode('<br />', $errors);
        return array(
            'success' => (count($errors)) ? false : true,
            'error'  => $error
        );
	}

	public function getUnitTypeMeasByPropertyId($property_id) {
		return $this->unitTypeMeasGateway->findMeasByPropertyId($property_id);
	}
}

?>