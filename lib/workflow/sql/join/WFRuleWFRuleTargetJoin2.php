<?php
namespace NP\workflow\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

class WFRuleWFRuleTargetJoin2 extends Join {
    public function __construct($cols = [], $type = Select::JOIN_INNER, $toAlias = 'WFT', $fromAlias = 'WF') {
        $this
            ->setTable([$toAlias => 'wfruletarget'])
            ->setCondition("{$fromAlias}.wfrule_id = {$toAlias}.wfrule_id")
            ->setCols($cols)
            ->setType($type)
        ;
    }
}