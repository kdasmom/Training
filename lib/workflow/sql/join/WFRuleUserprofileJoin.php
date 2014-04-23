<?php
namespace NP\workflow\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

class WFRuleUserprofileJoin extends Join {
    public function __construct($cols = ['userprofile_username'], $type = Select::JOIN_LEFT, $toAlias = 'u', $fromAlias = 'WF') {
        $this
            ->setTable([$toAlias => 'userprofile'])
            ->setCondition("{$fromAlias}.wfrule_lastupdatedby = {$toAlias}.userprofile_id")
            ->setCols($cols)
            ->setType($type)
        ;
    }
}