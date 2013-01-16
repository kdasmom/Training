<?php

namespace NP\invoice;

use NP\core\AbstractEntity;

class InvoiceItem extends AbstractEntity {
	
	protected $fields = array(
		'invoiceitem_id'		=> null,
		'invoice_id'			=> null,
		'property_id'			=> null,
		'invoiceitem_linenum'	=> 0,
		'invoiceitem_quantity'	=> 0,
		'invoiceitem_amount'	=> 0,
		'invoiceitem_shipping'	=> 0,
		'invoiceitem_salestax'	=> 0
	);
	
}

?>