<?php
namespace NP\workflow\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

class WFRuleWFRuleTypeJoin2 extends Join {
    public function __construct($cols = ['wfruletype_name'], $type = Select::JOIN_INNER, $toAlias = 'WT', $fromAlias = 'WF') {
        $this
            ->setTable([$toAlias => 'wfruletype'])
            ->setCondition("{$fromAlias}.wfruletype_id = {$toAlias}.wfruletype_id")
            ->setCols($cols)
            ->setType($type)
        ;
    }
}