<?php

namespace NP\image\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

class ImageIndexImageTransferJoin extends Join {
    public function __construct($cols = [], $type = Select::JOIN_INNER, $toAlias = 'itransfer', $fromAlias = 'img') {
        $this
            ->setTable(array($toAlias => 'image_transfer'))
            ->setCondition("{$fromAlias}.Image_Index_Id = {$toAlias}.invoiceimage_id")
            ->setCols($cols)
            ->setType($type)
        ;
    }
}