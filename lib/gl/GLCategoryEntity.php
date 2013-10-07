<?php
namespace NP\gl;

/**
 * Entity class for GlAccount
 *
 * @author Thomas Messier
 */
class GLCategoryEntity extends \NP\core\AbstractEntity {
    
    protected $fields = array(
        'glaccount_id'   => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'glaccount_name'     => array(
            'required'   => true,
            'validation' => array(
                'stringLength' => array('max'=>255)
            )
        ),
        'glaccount_number'   => array(
            'validation' => array(
                'stringLength' => array('max'=>50)
            )
        ),
        'glaccount_status'   => array(
            'required'     => true,
            'defaultValue' => 'active',
            'validation'   => array(
                'stringLength' => array('max'=>50)
            )
        ),
        'glaccount_amount'   => array(
            'validation' => array(
                'numeric' => array()
            )
        ),
        'glaccounttype_id'   => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'glaccount_level'    => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'glaccount_usable'   => array(
            'defaultValue' => 'Y',
            'validation' => array(
                'stringLength' => array('max'=>1)
            )
        ),
        'glaccount_order'    => array(
            'validation' => array(
                'digits' => array()
            )
        ),
        'integration_package_id'     => array(
            'required'   => true,
            'tableConstraint' => array(
                'table' => 'integrationpackage',
                'field' => 'integration_package_id'
            ),
            'validation' => array(
                'digits' => array()
            )
        ),
        'glaccount_updateby'     => array(
            'tableConstraint' => array(
                'table' => 'userprofile'
            ),
            'validation' => array(
                'digits' => array()
            )
        ),
        'glaccount_updatetm'     => array(
            'timestamp' => 'updated',
            'validation' => array(
                'date' => array('format'=>'Y-m-d H:i:s.u')
            )
        )
    );

}
?>