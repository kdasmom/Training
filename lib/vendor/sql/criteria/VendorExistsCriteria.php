<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 10/10/13
 * Time: 2:17 PM
 */

namespace NP\vendor\sql\criteria;


use NP\core\db\Where;

class VendorExistsCriteria extends Where {
		public function __construct($approvalTrackingId = null, $fromalias = 'v', $toalias = 'i') {
			parent::__construct();

			if ($approvalTrackingId) {
				return $this->notEquals($fromalias . '.approval_tracking_id', '?')
							->notEquals($fromalias . '.vendor_status', '?')
							->equals($fromalias . '.Integration_Package_id', "?")
							->equals($toalias . '.asp_client_id', '?');
			} else {
				return $this->isNotNull($fromalias . '.approval_tracking_id')
						->notEquals($fromalias . '.vendor_status', '?')
						->equals($fromalias . '.Integration_Package_id', "?")
						->equals($toalias . '.asp_client_id', '?');
			}
		}
} 