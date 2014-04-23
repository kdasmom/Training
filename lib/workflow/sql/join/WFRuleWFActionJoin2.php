<?php
namespace NP\workflow\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

class WFRuleWFActionJoin2 extends Join {
    public function __construct($cols = [], $type=Select::JOIN_INNER, $toAlias = 'WA', $fromAlias='WF') {
        $this
            ->setTable([$toAlias => 'wfaction'])
            ->setCondition("{$fromAlias}.wfrule_id = {$toAlias}.wfrule_id")
            ->setCols($cols)
            ->setType($type)
        ;
    }
}