<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 10/18/13
 * Time: 12:19 AM
 */

namespace NP\vendor\sql\criteria;


use NP\core\db\Where;

class VendorSearchCriteria extends Where {

	public function __construct($asp_client_id, $integration_package_id, $status) {
		parent::__construct();

		return $this->equals('a.table_name', "'vendorsite'")
							->nest('OR')
							->like('v.vendor_name', '?')
							->like('v.vendor_id_alt', '?')
							->like('v.vendor_name', '?')
							->like('v.vendor_id_alt', '?')
							->like('a.address_line1', '?')
							->like('a.address_line2', '?')
							->unnest()
							->equals('i.asp_client_id', $asp_client_id)
							->in('v.integration_package_id', $integration_package_id)
							->in('v.vendor_status', $status)
			;
	}
} 