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
            'Image_Index_Id_Alt',
            'Property_Id',
            'Image_Index_Name',
            'Image_Index_Type',
            'Image_Index_Ref',
            'Image_Index_VendorSite_Id',
            'Image_Index_Vendor_Id_Alt',
            'Image_Index_Invoice_Date',
            'Image_Index_Due_Date',
            'Image_Index_Amount',
            'Image_Index_PO_Ref',
            'Image_Index_User',
            'Image_Index_Date_Entered',
            'Image_Index_DTS',
            'Tablekey_Id',
            'Image_Index_Status',
            'Image_Index_Primary',
            'Image_Index_Source_Id',
            'asp_client_id',
            'Tableref_Id',
            'Image_Doctype_Id',
            'remit_advice',
            'image_index_draft_invoice_id',
            'image_index_notes',
            'universal_field1',
            'universal_field2',
            'universal_field3',
            'PriorityFlag_ID_Alt',
            'Image_Index_neededby_datetm AS neededby_datetm',
            'Image_Index_neededby_datetm',
            'universal_field4',
            'universal_field5',
            'universal_field6',
            'Image_Index_Exception_by',
            'Image_Index_Exception_datetm',
            'Image_Index_Exception_End_datetm',
            'Image_Index_Exception_reason',
            'universal_field7',
            'universal_field8',
            'image_index_indexed_datetm',
            'image_index_indexed_by',
            'image_index_deleted_datetm',
            'image_index_GUID',
            'image_index_deleted_by',
            'utilityaccount_id',
            'cycle_from',
            'cycle_to',
            'utilityAccount_accountNumber',
            'utilityAccount_meterSize'
        ]);
    }
}