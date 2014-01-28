<?php
namespace NP\image;

/**
 * Entity class for ImageTransfer
 *
 * @author Thomas Messier
 */
class ImageTransferEntity extends \NP\core\AbstractEntity {
    
    protected $fields = array(
        'image_transfer_id'  => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'transfer_type'  => array(
            'required'      => true,
            'validation' => array(
                'stringLength' => array('max'=>50)
            )
        ),
        'transfer_datetm'    => array(
            'timestamp' => 'created',
            'validation' => array(
                'date' => array('format'=>'Y-m-d H:i:s.u')
            )
        ),
        'transfer_status'    => array(
            'required'      => true,
            'defaultValue'  => 1,
            'validation' => array(
                'digits' => array()
            )
        ),
        'transfer_filename'  => array(
            'required'      => true,
            'validation' => array(
                'stringLength' => array('max'=>255)
            )
        ),
        'transfer_documentid'    => array(
            'defaultValue'  => 0,
            'validation' => array(
                'digits' => array()
            )
        ),
        'transfer_databaseid'    => array(
            'defaultValue'  => 0,
            'validation' => array(
                'digits' => array()
            )
        ),
        'invoiceimage_id'    => array(
            'required'      => true,
            'validation' => array(
                'digits' => array()
            ),
            'tableConstraint' => array(
                'table' => 'image_index',
                'field' => 'Image_Index_Id'
            )
        ),
        'transfer_srcTableName'  => array(
            'validation' => array(
                'stringLength' => array('max'=>50)
            )
        ),
        'transfer_srcTablekey_id'    => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'nxskofax_batch_id'  => array(
            'validation' => array(
                'digits' => array()
            )
        )
    );

}
?>