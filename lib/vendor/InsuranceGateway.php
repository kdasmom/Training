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

	public function findExpiredInsuranceInfoForEntity($table_name, $tablekey_id) {
		$expired            = false;
		$days_to_expiration = null;

		if ($table_name == 'invoice') {
			$alias = 'i';
			$vendorSiteJoinClass = '\NP\invoice\sql\join\InvoiceVendorsiteJoin';
		} else if ($table_name == 'purchaseorder') {
			$alias = 'p';
			$vendorSiteJoinClass = '\NP\invoice\sql\join\PoVendorsiteJoin';
		} else {
			throw new \NP\core\Exception('Invalid value for $table_name argument. Value must be "invoice" or "purchaseorder"');
		}

		$select = Select::get()
					->columns([])
					->from([$alias=>$table_name])
					->join(new $vendorSiteJoinClass(['vendorsite_DaysNotice_InsuranceExpires']))
					->join(new sql\join\VendorsiteInsuranceJoin(['insurance_expdatetm']))
					->join(new sql\join\InsuranceLinkPropertyJoin([]))
					->whereEquals("{$alias}.{$table_name}_id", '?')
					->whereEquals("{$alias}.property_id", 'lip.property_id')
					->order('ins.insurance_expdatetm')
					->limit(1);

		$insurance = $this->adapter->query($select, [$tablekey_id]);

		if (count($insurance)) {
			$now = \NP\util\Util::formatDateForDB();

			$select->whereNest('OR')
						->whereGreaterThan('ins.insurance_expdatetm', '?')
						->whereIsNull('ins.insurance_expdatetm')
					->whereUnnest();

			$insurance = $this->adapter->query($select, [$tablekey_id, $now]);

			if (count($insurance)) {
				$warningRange = $insurance[0]['vendorsite_DaysNotice_InsuranceExpires'];
				if ($warningRange === null) {
					$warningRange = (int)$this->configService->get('CP.DaysNotice_InsuranceExpires', 0);
					$warningRange = $warningRange * -1;
				}

				$expDate = \DateTime::createFromFormat('Y-m-d H:i:s.u', $insurance[0]['insurance_expdatetm']);
				$days_to_expiration = $expDate->diff(new \DateTime())->d;
				if ($warningRange > $days_to_expiration) {
					$days_to_expiration = null;
				}
			} else {
				$expired = true;
			}
		}

		return ['expired'=>$expired, 'days_to_expiration'=>$days_to_expiration];
	}
}

?>