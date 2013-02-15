<?php
namespace NP\invoice\validation;

use NP\core\validation\AbstractValidator;

/**
 * A class to validate invoice line item data sets
 *
 * See NP\core\validation\AbstractValidator.
 * 
 * @author Thomas Messier
 */
class InvoiceItemValidator extends AbstractValidator {
	
	protected $rules = array(
		'invoice_id'			=> array(),
		'property_id'			=> array(
			'required' => true,
			'validation' => array(
				array(
					'int' => array(),
					'greaterThan' =>array(
						'min'       => 0
					)
				)
			)
		),
		'invoiceitem_linenum'	=> array(
			'required'=> true,
			'validation' => array(
				array(
					'int' => array(),
					'greaterThan' =>array(
						'min'       => 0
					)
				)
			)
		),
		'invoiceitem_quantity'	=> array(
			'default' => 1,
			'required'=> true,
			'validation' => array('numeric'=>array())
		),
		'invoiceitem_amount'	=> array(
			'default' => 0,
			'required'=> true,
			'validation' => array('numeric'=>array())
		),
		'invoiceitem_shipping'	=> array(
			'default' => 0,
			'required'=> true,
			'validation' => array(
				array(
					'numeric'     =>array(),
					'greaterThan' =>array(
						'min'       => 0,
						'inclusive' => true
					)
				)
			)
		),
		'invoiceitem_salestax'	=> array(
			'default'    => 0,
			'required'=> true,
			'validation' => array(
				array(
					'numeric'     =>array(),
					'greaterThan' =>array(
						'min'       => 0,
						'inclusive' => true)
				)
			)
		)
	);
}

?>