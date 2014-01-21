<?php
namespace NP\image;

/**
 * Entity class for ImageIndex
 *
 * @author Thomas Messier
 */
class ImageIndexEntity extends \NP\core\AbstractEntity {
    
    protected $fields = array(
        'Image_Index_Id'     => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'Image_Index_Id_Alt'     => array(
            'defaultValue'  => 0,
            'validation' => array(
                'digits' => array()
            )
        ),
        'Property_Id'    => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'Image_Index_Name'   => array(
            'defaultValue'  => 'Invoice Image',
            'validation' => array(
                'stringLength' => array('max'=>255)
            )
        ),
        'Image_Index_Type'   => array(
            'validation' => array(
                'stringLength' => array('max'=>5)
            )
        ),
        'Image_Index_Ref'    => array(
            'validation' => array(
                'stringLength' => array('max'=>512)
            )
        ),
        'Image_Index_VendorSite_Id'  => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'Image_Index_Vendor_Id_Alt'  => array(
            'validation' => array(
                'stringLength' => array('max'=>32)
            )
        ),
        'Image_Index_Invoice_Date'   => array(
            'validation' => array(
                'date' => array('format'=>'Y-m-d H:i:s.u')
            )
        ),
        'Image_Index_Due_Date'   => array(
            'validation' => array(
                'date' => array('format'=>'Y-m-d H:i:s.u')
            )
        ),
        'Image_Index_Amount'     => array(
            'validation' => array(
                'numeric' => array()
            )
        ),
        'Image_Index_PO_Ref'     => array(
            'validation' => array(
                'stringLength' => array('max'=>32)
            )
        ),
        'Image_Index_User'   => array(
            'validation' => array(
                'stringLength' => array('max'=>32)
            )
        ),
        'Image_Index_Date_Entered'   => array(
            'validation' => array(
                'date' => array('format'=>'Y-m-d H:i:s.u')
            )
        ),
        'Image_Index_DTS'    => array(
            'validation' => array(
                'date' => array('format'=>'Y-m-d H:i:s.u')
            )
        ),
        'Tablekey_Id'    => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'Image_Index_Status'     => array(
            'defaultValue'  => -1,
            'validation' => array(
                'numeric' => array()
            )
        ),
        'Image_Index_Primary'    => array(
            'defaultValue'  => 0,
            'validation' => array(
                'digits' => array()
            )
        ),
        'Image_Index_Source_Id'  => array(
            'defaultValue'  => 1,
            'validation' => array(
                'digits' => array()
            )
        ),
        'asp_client_id'  => array(
            'required'      => true,
            'validation' => array(
                'digits' => array()
            )
        ),
        'Tableref_Id'    => array(
            'defaultValue'  => 0,
            'validation' => array(
                'digits' => array()
            )
        ),
        'Image_Doctype_Id'   => array(
            'defaultValue'  => 0,
            'validation' => array(
                'digits' => array()
            )
        ),
        'remit_advice'   => array(
            'defaultValue'  => 0,
            'validation' => array(
                'digits' => array()
            )
        ),
        'image_index_draft_invoice_id'   => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'image_index_notes'  => array(
            'validation' => array(
                'stringLength' => array('max'=>1000)
            )
        ),
        'universal_field1'   => array(
            'validation' => array(
                'stringLength' => array('max'=>255)
            )
        ),
        'universal_field2'   => array(
            'validation' => array(
                'stringLength' => array('max'=>255)
            )
        ),
        'universal_field3'   => array(
            'validation' => array(
                'stringLength' => array('max'=>255)
            )
        ),
        'PriorityFlag_ID_Alt'    => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'image_index_NeededBy_datetm'    => array(
            'validation' => array(
                'date' => array('format'=>'Y-m-d H:i:s.u')
            )
        ),
        'universal_field4'   => array(
            'validation' => array(
                'stringLength' => array('max'=>255)
            )
        ),
        'universal_field5'   => array(
            'validation' => array(
                'stringLength' => array('max'=>255)
            )
        ),
        'universal_field6'   => array(
            'validation' => array(
                'stringLength' => array('max'=>255)
            )
        ),
        'Image_Index_Exception_by'   => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'Image_Index_Exception_datetm'   => array(
            'validation' => array(
                'date' => array('format'=>'Y-m-d H:i:s.u')
            )
        ),
        'Image_Index_Exception_End_datetm'   => array(
            'validation' => array(
                'date' => array('format'=>'Y-m-d H:i:s.u')
            )
        ),
        'Image_Index_Exception_reason'   => array(
            'validation' => array(
                'stringLength' => array('max'=>1000)
            )
        ),
        'universal_field7'   => array(
            'validation' => array(
                'stringLength' => array('max'=>255)
            )
        ),
        'universal_field8'   => array(
            'validation' => array(
                'stringLength' => array('max'=>255)
            )
        ),
        'image_index_indexed_datetm'     => array(
            'validation' => array(
                'date' => array('format'=>'Y-m-d H:i:s.u')
            )
        ),
        'image_index_indexed_by'     => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'image_index_deleted_datetm'     => array(
            'validation' => array(
                'date' => array('format'=>'Y-m-d H:i:s.u')
            )
        ),
        'idimageindex'   => array(),
        'image_index_GUID'   => array(
            'validation' => array(
                'stringLength' => array('max'=>24)
            )
        ),
        'image_index_deleted_by'     => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'utilityaccount_id'  => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'cycle_from'     => array(
            'validation' => array(
                'date' => array('format'=>'Y-m-d H:i:s.u')
            )
        ),
        'cycle_to'   => array(
            'validation' => array(
                'date' => array('format'=>'Y-m-d H:i:s.u')
            )
        ),
        'utilityaccount_accountnumber'   => array(
            'validation' => array(
                'stringLength' => array('max'=>64)
            )
        ),
        'utilityaccount_metersize'   => array(
            'validation' => array(
                'stringLength' => array('max'=>64)
            )
        )
    );

}
?>