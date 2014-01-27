<?php

namespace NP\user;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the VENDORACCESSUSERS table
 *
 * @author Thomas Messier
 */
class VendorAccessUsersGateway extends AbstractGateway {

	public function findVcAuthRequests($countOnly, $pageSize=null, $page=null, $sort="last_update_datetm") {
		$select = new Select();

		if ($countOnly == 'true') {
			$select->count(true, 'totalRecs', 'vendor_user_id');
		} else {
			$select->order($sort);
		}

		$select->from('vendoraccessusers')
				->whereEquals('active_flag', -1);

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			return $this->getPagingArray($select, array(), $pageSize, $page, 'vendor_user_id');
		} else if ($countOnly == 'true') {
			$res = $this->adapter->query($select);
			return $res[0]['totalRecs'];
		} else {
			return $this->adapter->query($select);
		}
	}
}

?>