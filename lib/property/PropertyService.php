<?php

namespace NP\property;

use NP\core\AbstractService;
use NP\system\SecurityService;

class PropertyService extends AbstractService {
	
	protected $securityService, $propertyGateway, $fiscalcalGateway;
	
	public function __construct(SecurityService $securityService, PropertyGateway $propertyGateway, FiscalcalGateway $fiscalcalGateway, UnitGateway $unitGateway) {
		$this->securityService = $securityService;
		$this->propertyGateway = $propertyGateway;
		$this->fiscalcalGateway = $fiscalcalGateway;
		$this->unitGateway = $unitGateway;
	}
	
	public function get($property_id) {
		return $this->propertyGateway->findById($property_id);
	}
	
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
		
		return date('Y', $cutoffDate) . '-' . date('n', $cutoffDate) . '-1 0:00:00.0';
	}
	
	public function getForInvoiceItemComboBox($property_keyword) {
		return $this->propertyGateway->findForInvoiceItemComboBox(
			$this->securityService->getUserId(),
			$this->securityService->getDelegatedUserId(),
			$property_keyword
		);
	}
	
	public function getUnits($property_id) {
		return $this->unitGateway->find('property_id = ?', array($property_id), "unit_number");
	}
	
}

?>