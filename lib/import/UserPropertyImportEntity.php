<?php
namespace NP\import;

/**
 * Entity class for User Property import
 *
 * @author Thomas Messier
 */
class UserPropertyImportEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'userprofile_username'     => array(
            'required'   => true,
            'validation' => array(
                'stringLength' => array('max'=>50)
            ),
            'tableConstraint' => array(
                'table' => 'userprofile',
                'field' => 'userprofile_username'
            )
        ),
        'property_id_alt'     => array(
            'required'   => true,
            'validation' => array(
                'stringLength' => array('max'=>50)
            ),
            'tableConstraint' => array(
                'table' => 'property',
                'field' => 'property_id_alt'
            )
        )
	);
}
?>