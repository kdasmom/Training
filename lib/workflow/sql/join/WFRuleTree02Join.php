<?php
namespace NP\workflow\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

class WFRuleTree02Join extends Join {
    public function __construct($cols = [], $type = Select::JOIN_INNER, $toAlias = 't2', $fromAlias = 't1') {
        $this
            ->setTable([$toAlias => 'tree'])
            ->setCondition("{$fromAlias}.tree_id = {$toAlias}.tree_parent")
            ->setCols($cols)
            ->setType($type)
        ;
    }
}