<?php

namespace NP\vendor;

use NP\core\AbstractService;
use NP\system\ConfigService;

/**
 * Service class for operations related to vendors
 *
 * @author Thomas Messier
 */
class VendorService extends AbstractService {
	
	protected $vendorGateway, $insuranceGateway, $configService;
	
	public function __construct(VendorGateway $vendorGateway, InsuranceGateway $insuranceGateway, ConfigService $configService) {
		$this->vendorGateway    = $vendorGateway;
		$this->insuranceGateway = $insuranceGateway;
		$this->configService = $configService;
	}
	
	/**
	 * Retrieves vendor records for the vendor autocomplete when creating catalogs
	 *
	 * @param  string $keyword Keyword to use to search for a vendor
	 * @return array           Array of vendor records
	 */
	public function getForCatalogDropDown($keyword) {
		return $this->vendorGateway->getForCatalogDropDown($keyword);
	}
	
	/**
	 * Retrieves vendor records by integration package, 
	 *
	 * @param  int          $integration_package_id
	 * @param  string|array $vendor_status          Vendor status or array of statuses
	 * @param  string       $keyword                Keyword to use to search for a vendor
	 * @return array                          Array of vendor records
	 */
	public function getByIntegrationPackage($integration_package_id, $vendor_status=null, $keyword=null) {
		if (is_numeric($integration_package_id)) {
			$wheres = array(array('integration_package_id' => '?'));
			$params = array($integration_package_id);

			if ($vendor_status !== null) {
				$wheres[] = new sql\criteria\VendorStatusCriteria($vendor_status, 'IN');
				if (!is_array($vendor_status)) {
					$vendor_status = array($vendor_status);
				}
				foreach ($vendor_status as $vendor_status_val) {
					$params[] = $vendor_status_val;
				}
			}		

			if ($keyword !== null) {
				$wheres[] = new sql\criteria\VendorKeywordCriteria();
				$keyword = $keyword . '%';
				$params[] = $keyword;
				$params[] = $keyword;
			}

			return $this->vendorGateway->find(
				\NP\core\db\Where::buildCriteria($wheres),
				$params,
				'vendor_name',
				array('vendor_id','vendor_id_alt','vendor_name')
			);
		} else {
			return array();
		}
	}

	/**
	 * Retrieves vendor records matching a specified tax ID. A tax ID can be provided, otherwise a vendor ID can
	 * be provided and all vendors with the same tax ID as the specified vendor will be returned.
	 *
	 * @param  string [$vendor_fedid] Tax ID to search for
	 * @param  int    [$vendor_id]    ID for the vendor who's tax ID you want to find matching vendors for
	 * @return array                  Array of vendor records
	 */
	public function getByTaxId($vendor_fedid=null, $vendor_id=null) {
		if ($vendor_fedid === null) {
			$rec = $this->vendorGateway->findById($vendor_id, array('vendor_fedid'));
			$vendor_fedid = $rec['vendor_fedid'];
		}

		return $this->vendorGateway->find(
			array('vendor_fedid'=>'?'),
			array($vendor_fedid),
			'vendor_name ASC',
			array('vendor_id','vendor_id_alt','vendor_name')
		);
	}

	/**
	 * Get list of vendors to approve
	 *
	 * @param  boolean $countOnly                   Whether we want to retrieve only the number of records or all the data
	 * @param  int     $pageSize                    The number of records per page; if null, all records are returned
	 * @param  int     $page                        The page for which to return records
	 * @param  string  $sort                        Field(s) by which to sort the result; defaults to vendor_name
	 * @return array                                Array of vendor records
	 */
	public function getVendorsToApprove($countOnly, $pageSize=null, $page=null, $sort="vendor_name") {
		return $this->vendorGateway->findVendorsToApprove($countOnly, $pageSize, $page, $sort);
	}

	/**
	 * Get list of vendors to approve
	 *
	 * @param  boolean $countOnly                   Whether we want to retrieve only the number of records or all the data
	 * @param  int     $pageSize                    The number of records per page; if null, all records are returned
	 * @param  int     $page                        The page for which to return records
	 * @param  string  $sort                        Field(s) by which to sort the result; defaults to vendor_name
	 * @return array                                Array of vendor records
	 */
	public function getExpiredInsuranceCerts($countOnly, $pageSize=null, $page=null, $sort="insurance_expdatetm") {
		return $this->insuranceGateway->findExpiredInsuranceCerts($countOnly, $pageSize, $page, $sort);
	}

	/**
	 * find vendors by status
	 *
	 * @param null $pageSize
	 * @param null $page
	 * @param string $status
	 * @param string $sort
	 * @return array|bool
	 */
	public function findByStatus($pageSize = null, $page = null, $status = 'pending', $sort = 'PersonName') {
		$aspClientId = $this->configService->getClientId();

		return $this->vendorGateway->findByStatus($pageSize, $page, $status, $sort, $aspClientId);
	}

	/**
	 * Retrieve vendor's types records list
	 *
	 * @return array|bool
	 */
	public function findVendorTypes() {
		return $this->vendorGateway->findVendorTypes();
	}
}

?>