<?php
namespace NP\invoice;

/**
 * Entity class for InvoiceHold
 *
 * @author Thomas Messier
 */
class InvoiceHoldEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'invoicehold_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'invoice_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'approve_id'	 => array(
			'required' => true,
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array()
		),
		'activate_userprofile_id'	 => array(
			'validation' => array(
				'digits' => array()
			),
			'tableConstraint' => array(
				'table' => 'userprofile',
				'field' => 'userprofile_id'
			)
		),
		'invoicehold_activate_datetm'	 => array(
			'validation' => array(
				'date' => array('format'=>'Y-m-d H:i:s.u')
			)
		),
		'invoicehold_inv_status'	 => array(
			'required' => true,
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'invoicehold_active'	 => array(
			'required' => true,
			'defaultValue' => 1
		),
		'activate_delegation_to_userprofile_id'	 => array(
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