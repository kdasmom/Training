<?php
namespace NP\workflow\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

class WFRuleVendorJoin extends Join {
    public function __construct($cols = [], $type = Select::JOIN_INNER, $toAlias = 'V', $fromAlias = 'WS') {
        $this
            ->setTable([$toAlias => 'vendor'])
            ->setCondition("{$fromAlias}.tablekey_id = {$toAlias}.vendor_id")
            ->setCols($cols)
            ->setType($type)
        ;
    }
}