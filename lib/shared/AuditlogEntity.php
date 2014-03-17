<?php
namespace NP\shared;

/**
 * Entity class for Auditlog
 *
 * @author Thomas Messier
 */
class AuditlogEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'auditlog_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'userprofile_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'tablekey_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'auditactivity_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'audittype_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'field_name'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'field_new_value'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>3500)
			)
		),
		'field_old_value'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>3500)
			)
		),
		'DTS'	 => array(
			'timestamp' => 'created',
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'delegation_to_userprofile_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array(
                'table' => 'userprofile',
                'field' => 'userprofile_id'
            )
		)
	);

}
?>