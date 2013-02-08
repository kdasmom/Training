<?php

namespace NP\invoice;

use NP\core\AbstractEntity;

class InvoiceItem extends AbstractEntity {
	
	protected $fields = array(
		'invoiceitem_id'		=> array(),
		'invoice_id'			=> array(),
		'property_id'			=> array(),
		'invoiceitem_linenum'	=> array(),
		'invoiceitem_quantity'	=> array(
			'default' => 1,
			'validation' => array('numeric'=>array())
		),
		'invoiceitem_amount'	=> array(
			'default' => 0,
			'validation' => array('numeric'=>array())
		),
		'invoiceitem_shipping'	=> array(
			'default' => 0,
			'validation' => array(
				array(
					'numeric'     =>array(),
					'greaterThan' =>array(
						'min'       => 0,
						'inclusive' => true)
				)
			)
		),
		'invoiceitem_salestax'	=> array(
			'default'    => 0,
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