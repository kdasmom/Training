<?php

namespace NP\image\sql;

use NP\core\db\Select;
use NP\core\db\Where;
use NP\core\db\Expression;

class ImageSearchSelect extends ImageSelect {
    public function __construct() {
        parent::__construct();

        $this
            ->columns([
                'Image_Index_Id',
                'Image_Index_Name',
                'Image_Index_Date_Entered',
            ])
            ->from(['ii' => 'image_index'])
                ->join(['it' => 'image_tableref'], 'ii.tableref_id = it.image_tableref_id', ['image_tableref_name'], Select::JOIN_INNER)
                ->join(['idt' => 'image_doctype'], 'ii.image_doctype_id = idt.image_doctype_id', ['image_doctype_name'], Select::JOIN_INNER)
                ->join(['p' => 'property'], 'ii.property_id = p.property_id', ['property_name'], Select::JOIN_LEFT)
                ->join(['vs' => 'vendorsite'], 'ii.image_index_vendorsite_id = vs.vendorsite_id', [], Select::JOIN_LEFT)
                ->join(['v' => 'vendor'], 'vs.vendor_id = v.vendor_id', ['vendor_name'], Select::JOIN_LEFT)
        ;
    }
}