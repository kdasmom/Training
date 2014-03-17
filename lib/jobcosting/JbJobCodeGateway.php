<?php

namespace NP\jobcosting;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the JBJOBCODE table
 *
 * @author Thomas Messier
 */
class JbJobCodeGateway extends AbstractGateway {

    public function setConfigService(\NP\system\ConfigService $configService) {
        $this->configService = $configService;
    }

	/**
	 * Get job codes based on a set of values passed to filter
	 */
	public function findByFilter($property_id=null, $jbcontract_id=null, $jbchangeorder_id=null, $keyword=null, $sort='jbjobcode_name') {
		$select = $this->getSelect()->from(['jbjc'=>'jbjobcode'])
									->whereEquals('jbjc.jbjobcode_status', "'active'")
									->order($sort);

		if ($this->configService->get('CP.JBJobGLAssociation', '0') == '1') {
			$select->isNotNull('jbjc.glaccount_id');
		}

		$params = [];
		if ($property_id !== null) {
			$select->whereNest('OR')
						->whereEquals('jbjc.property_id', '?')
						->whereIsNull('jbjc.property_id')
					->whereUnnest();

			$params[] = $property_id;
		}

		if ($jbcontract_id !== null) {
			$params[] = $jbcontract_id;
			if ($jbchangeorder_id === null) {
				$select->whereExists(
					Select::get()->from(['jbjcc'=>'jbcontract_job'])
								->whereEquals('jbjcc.jbjobcode_id', 'jbjc.jbjobcode_id')
								->whereEquals('jbjcc.jbcontract_id', '?')
				);
			} else {
				$params[] = $jbchangeorder_id;

				$select->whereExists(
					Select::get()->from(['jbctb'=>'jbcontractbudget'])
								->whereEquals('jbctb.jbjobcode_id', 'jbjc.jbjobcode_id')
								->whereEquals('jbctb.jbcontract_id', '?')
								->whereEquals('jbctb.jbchangeorder_id', '?')
				);
			}
		}

		if (!empty($keyword)) {
			$select->whereNest('OR')
						->whereLike('jbjc.jbjobcode_name', '?')
						->whereLike('jbjc.jbjobcode_desc', '?')
					->whereUnnest();

			$keyword .= '%';
			$params[] = $keyword;
			$params[] = $keyword;
		}

		return $this->adapter->query($select, $params);
	}

	/**
	 * Returns job codes associated to an entity (invoice or po) that are inactive
	 */
	public function findInactiveJobInEntity($table_name, $tablekey_id) {
		if ($table_name == 'invoice') {
			$lineTable = 'InvoiceItem';
		} else {
			$lineTable = 'PoItem';
		}
		$module = str_replace('item', '', strtolower($lineTable));
		$lineAlias = substr($lineTable, 0, 1) . 'i';
		$joinClass = "\\NP\\{$module}\\sql\\join\\{$lineTable}JobAssociationJoin";

		$select = Select::get()->distinct()
								->columns(array())
								->from(array($lineAlias=>$lineTable))
								->join(new $joinClass(array()))
								->join(new \NP\jobcosting\sql\join\JobAssociationJbJobCodeJoin())
								->whereEquals("{$table_name}_id", '?')
								->whereEquals('jbjc.jbjobcode_status', '?');

		return $this->adapter->query($select, array($tablekey_id, 'inactive'));
	}
}

?>