<?php

namespace NP\image\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

class ImageIndexUserprofileJoin extends Join {
    public function __construct($cols = ['userprofile_username'], $type = Select::JOIN_INNER, $toAlias = 'up', $fromAlias = 'itransfer') {
        $this
            ->setTable(array($toAlias => 'userprofile'))
            ->setCondition("{$fromAlias}.transfer_srcTablekey_id = {$toAlias}.userprofile_id")
            ->setCols($cols)
            ->setType($type)
        ;
    }
}