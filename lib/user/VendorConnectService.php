<?php

namespace NP\user;

use NP\core\AbstractService;

/**
 * Service class for operations related to VendorConnect users
 *
 * @author Thomas Messier
 */
class VendorConnectService extends AbstractService {
	protected $vendorAccessUsersGateway;

	public function __construct(VendorAccessUsersGateway $vendorAccessUsersGateway) {
		$this->vendorAccessUsersGateway = $vendorAccessUsersGateway;
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
	public function getVcAuthRequests($countOnly, $pageSize=null, $page=null, $sort="last_update_datetm") {
		return $this->vendorAccessUsersGateway->findVcAuthRequests($countOnly, $pageSize, $page, $sort);
	}
}