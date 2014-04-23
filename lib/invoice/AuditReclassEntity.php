<?php
namespace NP\invoice;

/**
 * Entity class for AuditReclass
 *
 * @author Thomas messier
 */
class AuditReclassEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'auditreclass_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'userprofile_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoice_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'audit_note'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>2000)
			)
		),
		'auditreclass_date'	 => array(
			'timestamp' => 'created',
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'invoiceitem_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'field'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'old_val'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>4000)
			)
		),
		'new_val'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>4000)
			)
		),
		'delegation_to_userprofile_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		)
	);

}
?>