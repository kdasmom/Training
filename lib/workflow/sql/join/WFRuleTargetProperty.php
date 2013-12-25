<?php
namespace NP\workflow\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

class WFRuleTargetProperty extends Join {
    public function __construct($cols = ['property_id', 'property_name'], $type = Select::JOIN_INNER, $toAlias = 'p', $fromAlias = 'WFT') {
        $this
            ->setTable([$toAlias => 'property'])
            ->setCondition("{$fromAlias}.tablekey_id = {$toAlias}.property_id")
            ->setCols($cols)
            ->setType($type)
        ;
    }
}