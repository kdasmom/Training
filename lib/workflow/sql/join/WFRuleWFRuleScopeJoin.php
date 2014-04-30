<?php
namespace NP\workflow\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

class WFRuleWFRuleScopeJoin extends Join {
    public function __construct($scopeTableName = false, $cols = [], $type = Select::JOIN_INNER, $toAlias = 'WS', $fromAlias = 'WF') {
        $condition = 
            "{$fromAlias}.wfrule_id = {$toAlias}.wfrule_id"
        ;
        if (!empty($scopeTableName)) {
            $condition .= " AND {$toAlias}.table_name = 'glaccount'";
        }

        $this
            ->setTable([$toAlias => 'wfrulescope'])
            ->setCondition($condition)
            ->setCols($cols)
            ->setType($type)
        ;
    }
}