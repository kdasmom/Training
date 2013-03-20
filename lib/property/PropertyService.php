<?php

namespace NP\property;

use NP\core\AbstractService;
use NP\system\SecurityService;

class PropertyService extends AbstractService {
	
	/**
	 * @var \NP\system\SecurityService
	 */
	protected $securityService; 
	
	/**
	 * @var \NP\property\PropertyGateway
	 */
	protected $propertyGateway; 
	
	/**
	 * @var \NP\property\FiscalcalGateway
	 */
	protected $fiscalcalGateway;
	
	/**
	 * @param \NP\system\SecurityService    $securityService  SecurityService object injected
	 * @param \NP\property\PropertyGateway  $propertyGateway  PropertyGateway object injected
	 * @param \NP\property\FiscalcalGateway $fiscalcalGateway FiscalcalGateway object injected
	 * @param \NP\property\UnitGateway      $unitGateway      UnitGateway object injected
	 */
	public function __construct(SecurityService $securityService, PropertyGateway $propertyGateway, 
								FiscalcalGateway $fiscalcalGateway, UnitGateway $unitGateway) {
		$this->securityService = $securityService;
		$this->propertyGateway = $propertyGateway;
		$this->fiscalcalGateway = $fiscalcalGateway;
		$this->unitGateway = $unitGateway;
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
	 * Returns the current accounting period for a property
	 *
	 * @param  int   $property_id ID of the property
	 * @return date  The accounting period in a Y-m-01 format
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

		return $accountingPeriod->format('Y-m-d');
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
	 * Retrieves records for units for a property
	 *
	 * @param  int $property_id ID of the property
	 * @return array            Array of unit records
	 */
	public function getUnits($property_id) {
		return $this->unitGateway->find('property_id = ?', array($property_id), "unit_number");
	}
	
}

?>