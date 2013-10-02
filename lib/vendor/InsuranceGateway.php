<?php

namespace NP\vendor;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Expression;

/**
 * Gateway for the INSURANCE table
 *
 * @author Thomas Messier
 */
class InsuranceGateway extends AbstractGateway {

	protected $configService;

	public function setConfigService(\NP\system\ConfigService $configService) {
		$this->configService = $configService;
	}

	public function findExpiredInsuranceCerts($countOnly, $pageSize=null, $page=null, $sort="insurance_expdatetm") {
		$select = new Select();

		if ($countOnly == 'true') {
			$select->count(true, 'totalRecs')
					->column('insurance_id');
		} else {
			$select->columns(array(
						'insurance_id',
						'tablekey_id',
						'insurancetype_id',
						'insurance_company',
						'insurance_policynum',
						'insurance_expdatetm',
						'days_to_expiration' => new Expression('DateDiff(day, getdate(), ins.insurance_expdatetm)')
					))
					->order($sort);
		}

		$warningRange = (int)$this->configService->get('CP.DaysNotice_InsuranceExpires', 0);
		$warningRange = $warningRange * -1;

		$select->from(array('ins'=>'insurance'))
				->join(new sql\join\InsuranceVendorJoin())
				->join(new sql\join\VendorVendorsiteJoin())
				->join(new sql\join\VendorIntPkgJoin())
				->join(new sql\join\InsuranceInsuranceTypeJoin())
				->whereEquals('v.vendor_status', "'active'")
				->whereMerge(new sql\criteria\InsuranceExpiredCriteria($warningRange));

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			return $this->getPagingArray($select, array(), $pageSize, $page, 'vendor_id');
		} else if ($countOnly == 'true') {
			$res = $this->adapter->query($select);
			return $res[0]['totalRecs'];
		} else {
			return $this->adapter->query($select);
		}
	}
}

?>