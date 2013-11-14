<?php

namespace NP\image\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

class ImageIndexTablerefJoin extends Join {
    public function __construct($cols = ['image_tableref_name'], $type=Select::JOIN_LEFT, $toAlias='imgt', $fromAlias='img') {
        $this
            ->setTable(array($toAlias => 'image_tableref'))
            ->setCondition("{$fromAlias}.tableref_id = {$toAlias}.image_tableref_id")
            ->setCols($cols)
            ->setType($type)
        ;
    }
}