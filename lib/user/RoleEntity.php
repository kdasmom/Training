<?php
namespace NP\user;

/**
 * Entity class for Role
 *
 * @author Thomas Messier
 */
class RoleEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'role_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'asp_client_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'role_name'	 => array(
			'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'table_name'	 => array(
			'required'   => true,
			'defaultValue' => 'staff',
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'role_entrypage'	 => array(
			'defaultValue' => 'executive_view.cfm',
			'validation' => array(
				'stringLength' => array('max'=>200)
			)
		),
		'is_admin_role'	 => array(
			'required' => true,
			'defaultValue' => 0,
			'validation' => array(
				'digits' => array()
			)
		),
		'role_updated_by'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'role_updated_datetm'	 => array(
			'timestamp'  => 'updated',
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		)
	);

}
?>