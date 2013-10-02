<?php
namespace NP\import;

/**
 * Entity class for User import
 *
 * @author Thomas Messier
 */
class UserImportEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'person_firstname'	 => array(
			'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'person_middlename'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'person_lastname'	 => array(
			'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'userprofile_username'     => array(
            'required'   => true,
            'validation' => array(
                'stringLength' => array('max'=>50)
            )
        ),
		'role_name'     => array(
            'required'   => true,
            'validation' => array(
                'stringLength' => array('max'=>255)
            ),
            'tableConstraint' => array(
            	'table' => 'role',
            	'field' => 'role_name'
            )
        ),
        'address_line1'   => array(
            'validation' => array(
                'stringLength' => array('max'=>255)
            )
        ),
		'address_line2'	 => array(
			'validation' => array(
                'stringLength' => array('max'=>255)
            )
		),
        'address_city'  => array(
            'validation' => array(
                'stringLength' => array('max'=>100)
            )
        ),
        'address_state'  => array(
            'validation' => array(
                'stringLength' => array('max'=>50)
            )
        ),
        'address_zip'  => array(
            'validation' => array(
                'stringLength' => array('max'=>10)
            )
        ),
        'email_address'  => array(
            'validation' => array(
                'stringLength' => array('max'=>255),
                'emailAddress' => array()
            )
        ),
        'home_phone_number'  => array(
            'validation' => array(
                'stringLength' => array('max'=>14)
            )
        ),
        'work_phone_number'  => array(
            'validation' => array(
                'stringLength' => array('max'=>14)
            )
        ),
	);
}
?>