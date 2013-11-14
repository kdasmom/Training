<?php
namespace NP\image;

class ImageIndexEntity extends \NP\core\AbstractEntity {
    protected $fields = [
        'Image_Index_Id'            => [
            'validation' => array(
                'digits' => array()
            )            
        ],
        'Image_Index_Id_Alt'        => [
            'defaultValue'  => 0
        ],

        'Property_Id'               => [
            'defaultValue'  => null
        ],
        'Image_Index_Name'          => [
            'defaultValue'  => 'Invoice Image'
        ],
        'Image_Index_Type'          => [],
        'Image_Index_Ref'           => [
            'defaultValue'  => null
        ],
        'Image_Index_VendorSite_Id' => [
            'defaultValue'  => null
        ],
        'Image_Index_Vendor_Id_Alt' => [],
        'Image_Index_Invoice_Date'  => [
            'defaultValue'  => null
        ],
        'Image_Index_Due_Date'      => [],
        'Image_Index_Amount'        => [
            'defaultValue'  => null
        ],
        'Image_Index_PO_Ref'        => [],
        'Image_Index_User'          => [],
        'Image_Index_Date_Entered'  => [],
        'Image_Index_DTS'           => [],

        'Tablekey_Id'               => [
            'defaultValue'  => 0
        ],

        'Image_Index_Status'        => [
            'defaultValue'  => 0
        ],
        'Image_Index_Primary'       => [
            'defaultValue'  => 1
        ],
        'Image_Index_Source_Id'     => [
            'defaultValue'  => 1
        ],

        'asp_client_id'             => [
            'required'      => true
        ],

        'Tableref_Id'               => [
            'defaultValue'  => 0
        ],
        
        'Image_Doctype_Id'          => [
            'defaultValue'  => 0
        ],
        'remit_advice'              => [
            'defaultValue'  => 0
        ],
        'image_index_draft_invoice_id'  => [],
        'image_index_notes'         => [],
        'universal_field1'          => [],
        'universal_field2'          => [],
        'universal_field3'          => [],
        'PriorityFlag_ID_Alt'       => [],
        'image_index_NeededBy_datetm'   => [],
        'universal_field4'          => [],
        'universal_field5'          => [],
        'universal_field6'          => [],
        'Image_Index_Exception_by'  => [],
        'Image_Index_Exception_datetm'  => [],
        'Image_Index_Exception_End_datetm'  => [],
        'Image_Index_Exception_reason'  => [],
        'universal_field7'          => [],
        'universal_field8'          => [],
        'image_index_indexed_datetm'=> [
            'defaultValue'  => null
        ],
        'image_index_indexed_by'    => [
            'defaultValue'  => null
        ],
        'image_index_deleted_datetm'    => [],
        'image_index_GUID'          => [],
        'image_index_deleted_by'    => [],
        'utilityaccount_id'         => [],
        'cycle_from'                => [],
        'cycle_to'                  => [],
        'utilityaccount_accountnumber'  => [],
        'utilityaccount_metersize'  => []
    ];
}