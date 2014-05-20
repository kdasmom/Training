<?php
namespace NP\workflow;

use NP\core\AbstractGateway;
use NP\core\db\Adapter;
use NP\core\db\Select;
use NP\core\db\Insert;
use NP\core\db\Expression;
use NP\core\db\Where;

class WfRuleScopeGateway extends AbstractGateway {
    protected $table = 'wfrulescope';

    public function copy($ruleid, $targetid) {
        $select = Select::get()
            ->columns([
                new \NP\core\db\Expression($ruleid),
                'table_name',
                'tablekey_id'
            ])
            ->from('wfrulescope')
            ->where(
                Where::get()->equals('wfrule_id', $targetid)
            );

        $insert = \NP\core\db\Insert::get()
            ->into('wfrulescope')
            ->columns([
                'wfrule_id',
				'table_name',
                'tablekey_id'
            ])
            ->values($select);

        $this->adapter->query($insert);
    }


	public function saveScopeList($wfrule_id, $tablename, $tablefield, $tablekeys) {
		$insert = new Insert();
		$select = new Select();
		$tablekeysPlaceHolders = $this->createPlaceholders($tablekeys);

		$this->delete(['wfrule_id' => '?'], [$wfrule_id]);

		$insert->into('wfrulescope')
			   ->columns(['wfrule_id', 'table_name', 'tablekey_id'])
			   ->values(
					$select->columns([new Expression($wfrule_id), new Expression("'{$tablename}'"), $tablefield])
						->from(['t'  => $tablename])
							->whereIn($tablefield, $tablekeysPlaceHolders)
				);

		return $this->adapter->query($insert, $tablekeys);
	}

	/**
	 *
	 * @param int $wfrule_id
	 * @param array $conflictRulesIdList
	 * @param string $tablename
	 * @return array
	 */
	public function getDuplicateRulesByOptions($wfrule_id, $conflictRulesIdList, $tablename) {
		$select = new Select();

		$rulePlaceHolders = $this->createPlaceholders($conflictRulesIdList);

		$select->distinct()->columns(['wfrule_id'])
				->from(['ws' => 'wfrulescope'])
				->join(['wsc' => 'wfrulescope'], 'ws.tablekey_id = wsc.tablekey_id', [])
					->whereEquals('wsc.wfrule_id', $wfrule_id)
					->whereEquals('ws.table_name', "'{$tablename}'")
					->whereEquals('wsc.table_name', "'{$tablename}'")
					->whereIn('ws.wfrule_id', $rulePlaceHolders);

		return $this->adapter->query($select, $conflictRulesIdList);
	}
}