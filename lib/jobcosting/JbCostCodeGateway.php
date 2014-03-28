<?php

namespace NP\jobcosting;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the JBCOSTCODE table
 *
 * @author Thomas Messier
 */
class JbCostCodeGateway extends AbstractGateway {

    public function setConfigService(\NP\system\ConfigService $configService) {
        $this->configService = $configService;
    }

	/**
	 * Get job codes based on a set of values passed to filter
	 */
	public function findByFilter($jbcontract_id=null, $jbchangeorder_id=null, $jbjobcode_id=null, $jbphasecode_id=null, $keyword=null, $sort='jbcostcode_name') {
		$useCostCodes      = $this->configService->get('pn.jobcosting.useCostCodes', '0');
		$costCodeByJobCode = $this->configService->get('PN.jobcosting.costCodeByJobCode', '0');

		$select = $this->getSelect()->from(['jbcc'=>'jbcostcode'])
									->order($sort);

		if ($this->configService->get('CP.JBJobGLAssociation', '0') == '1') {
			$select->isNotNull('jbcc.glaccount_id');
		}

		$params = [];
		if (empty($jbcontract_id) || $useCostCodes == '0') {
			if ($costCodeByJobCode == '1') {
				$select->whereEquals('jbcc.jbjobcode_id', '?');
				$params[] = $jbjobcode_id;

				if ($jbphasecode_id !== null) {
					$select->whereEquals('jbcc.jbphasecode_id', '?');
					$params[] = $jbphasecode_id;
				}
			} else {
				$select->whereEquals(
					'jbcc.jbjobtype_id',
					Select::get()->column('jbjobtype_id')
								->from('jbjobcode')
								->whereEquals('jbjobcode_id', '?')
				);
				$params[] = $jbjobcode_id;
			}

			if ($useCostCodes == '1') {
				$select->whereEquals('jbcc.jbcostcode_name', "'nxsDefault'");
			} else {
				$select->whereNotEquals('jbcc.jbcostcode_name', "'nxsDefault'");
			}
		} else {
			$subSelect = Select::get()->from(['jbctb'=>'jbcontractbudget'])
							->whereEquals('jbctb.jbcostcode_id', 'jbcc.jbcostcode_id')
							->whereEquals('jbctb.jbcontract_id', '?')
							->whereEquals('jbctb.jbjobcode_id', '?');
			array_push($params, $jbcontract_id, $jbjobcode_id);

			if (!empty($jbchangeorder_id)) {
				$subSelect->whereEquals('jbctb.jbchangeorder_id', '?');
				$params[] = $jbchangeorder_id;
			}

			if (!empty($jbphasecode_id)) {
				$subSelect->whereEquals('jbctb.jbphasecode_id', '?');
				$params[] = $jbphasecode_id;
			}
			
			$select->whereExists(
				$subSelect
			);

			if ($costCodeByJobCode == '1') {
				$select->whereEquals('jbcc.jbjobcode_id', '?');
				$params[] = $jbjobcode_id;
				
				if (!empty($jbphasecode_id)) {
					$select->whereEquals('jbcc.jbphasecode_id', '?');
					$params[] = $jbphasecode_id;
				}
			}
		}

		if (!empty($keyword)) {
			$select->whereNest('OR')
						->whereLike('jbcc.jbcostcode_name', '?')
						->whereLike('jbcc.jbcostcode_desc', '?')
					->whereUnnest();

			$keyword .= '%';
			$params[] = $keyword;
			$params[] = $keyword;
		}

		return $this->adapter->query($select, $params);
	}
}

?>