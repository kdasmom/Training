<?php
namespace NP\workflow\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

class WFRuleHourWFRule extends Join {
    public function __construct($cols = [], $type = Select::JOIN_INNER, $toAlias = 'WF', $fromAlias = 'WFH') {
        $this
            ->setTable([$toAlias => 'wfrule'])
            ->setCondition("{$fromAlias}.wfrule_id = {$toAlias}.wfrule_id")
            ->setCols($cols)
            ->setType($type)
        ;
    }
}