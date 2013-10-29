<?php

namespace NP\vendor;

use NP\core\AbstractGateway;
use NP\core\db\Delete;
use NP\core\db\Insert;
use NP\core\db\Select;
use NP\core\db\Expression;
use NP\core\db\Where;

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

	/**
	 * Retrieve insurance types list
	 *
	 * @return array|bool
	 */
	public function findTypes() {
		$select = new Select();

		$select->from(['it' => 'insurancetype'])
					->order('insurancetype_name');

		return $this->adapter->query($select);
	}

	/**
	 * Save link insurance property
	 *
	 * @param $oldInsuranceId
	 * @param $newInsuranceId
	 */
	public function saveLinkInsuranceProperty($oldInsuranceId, $newInsuranceId) {
		$select = new Select();
		$select->from(['lip' => 'link_insurance_property'])
					->where(['insurance_id' => '?'])
					->columns(['property_id']);

		$properties = $this->adapter->query($select, [$oldInsuranceId]);
		if (count($properties) > 0) {
			$insert = new Insert();

			foreach ($properties as $property) {
				$insert->into('link_insurance_property')
							->columns(['insurance_id', 'property_id'])
							->values(Select::get()->columns([new Expression('?'), new Expression('?')]));

				$this->adapter->query($insert, [$newInsuranceId, $property['property_id']]);
			}

			$this->delete(['insurance_id' => '?'], [$oldInsuranceId]);
		}
	}


	/**
	 * Delete insurances list
	 *
	 * @param $list
	 * @param $table_name
	 * @param $table_key
	 */
	public function deleteInsuranceList($list, $table_name, $table_key) {
		$delete = new Delete();
		$where = Where::get()->notIn('insurance_id', implode(',', $list))
							->equals('tablekey_id', '?')
							->equals('table_name', '?');

		$delete->from('insurance')
				->where($where);

		$this->adapter->query($delete, [$table_key, $table_name]);
	}
}

?>