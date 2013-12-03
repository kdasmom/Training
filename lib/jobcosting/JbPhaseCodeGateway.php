<?php

namespace NP\jobcosting;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the JBPHASECODE table
 *
 * @author Thomas Messier
 */
class JbPhaseCodeGateway extends AbstractGateway {

    public function setConfigService(\NP\system\ConfigService $configService) {
        $this->configService = $configService;
    }

	/**
	 * Get job codes based on a set of values passed to filter
	 */
	public function findByFilter($jbcontract_id=null, $jbchangeorder_id=null, $jbjobcode_id=null, $sort='jbphasecode_name') {
		$select = $this->getSelect()->from(['jbpc'=>'jbphasecode'])
									->order($sort);

		$params = [];
		if ($jbcontract_id !== null) {
			$select->whereExists(
				Select::get()->from(['jbctb'=>'jbcontractbudget'])
							->whereEquals('jbctb.jbphasecode_id', 'jbpc.jbphasecode_id')
							->whereEquals('jbctb.jbcontract_id', '?')
							->whereEquals('jbctb.jbchangeorder_id', '?')
							->whereEquals('jbctb.jbjobcode_id', '?')
			);

			array_push($params, $jbcontract_id, $jbchangeorder_id, $jbjobcode_id);
		}

		if ($this->configService->get('PN.jobcosting.phaseCodeByJobCode', '0') == '1') {
			$select->whereEquals('jbpc.jbjobcode_id', '?');
		} else {
			$select->whereEquals(
				'jbpc.jbjobtype_id',
				Select::get()->column('jbjobtype_id')
							->from('jbjobcode')
							->whereEquals('jbjobcode_id', '?')
			);
		}
		$params[] = $jbjobcode_id;

		return $this->adapter->query($select, $params);
	}
}
?>