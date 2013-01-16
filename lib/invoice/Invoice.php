<?php

namespace NP\invoice;

use NP\core\AbstractEntity;

class Invoice extends AbstractEntity {
	
	protected $fields = array(
		'invoice_id'=>null,
		'property_id'=>null,
		'invoice_ref'=>'',
		'invoice_amount'=>0,
	);
	
	public function toArray() {
		return array(
			'invoice_id'=>$this->invoice_id,
			'property_id'=>$this->property_id,
			'invoice_ref'=>$this->invoice_ref,
		);
	}
	
}

?>