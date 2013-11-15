<?php

namespace NP\image\sql;

use NP\core\db\Select;
use NP\core\db\Where;
use NP\core\db\Expression;

class ImageIndexSelect extends ImageSelect {
    public function __construct() {
        parent::__construct();

        $this->columns([
            'Image_Index_Id',
            'Image_Index_Date_Entered',
            'Image_Index_Due_Date',
            'Image_Index_Invoice_Date',
            'Image_Index_Amount',
            'Image_Index_Ref',
            'Image_Index_PO_Ref',
            'Image_Index_VendorSite_Id',
            'Image_Index_Vendor_Id_Alt',
            'Image_Index_Status',
            'universal_field1',
            'universal_field2',
            'universal_field3',
            'universal_field4',
            'universal_field5',
            'universal_field6',
            'universal_field7',
            'universal_field8',
            'Image_Index_Name',
            'Tableref_Id',
            'Tablekey_id',
            'Image_Doctype_Id',
            'remit_advice',
            'image_index_draft_invoice_id',
            'PriorityFlag_ID_Alt',
            'Image_Index_neededby_datetm AS neededby_datetm',
            'Image_Index_Exception_reason',
            'utilityaccount_id',
            'utilityAccount_accountNumber',
            'utilityAccount_meterSize',
            'cycle_from',
            'cycle_to'
        ]);
    }
}