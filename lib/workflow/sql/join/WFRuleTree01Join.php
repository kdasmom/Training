<?php
namespace NP\workflow\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

class WFRuleTree01Join extends Join {
    public function __construct($cols = [], $type = Select::JOIN_INNER, $toAlias = 't1', $fromAlias = 'WS') {
        $this
            ->setTable([$toAlias => 'tree'])
            ->setCondition("{$fromAlias}.tablekey_id = {$toAlias}.tablekey_id AND {$toAlias}.table_name = 'glaccount'")
            ->setCols($cols)
            ->setType($type)
        ;
    }
}