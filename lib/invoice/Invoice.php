<?php

namespace NP\invoice;

use NP\core\AbstractEntity;

class Invoice extends AbstractEntity {
	
	protected $fields = array(
		'invoice_id',
		'property_id'    => array(
			'required'   => true,
			'displayName'=> 'Property ID',
			'default'    => 2.5,
			'validation' => array('int' => array())
		),
		'invoice_ref'    => array(
			'default' => '',
			'validation' => array(
				'uri' => array('allowRelative' => false)
			)
		),
		'invoice_amount' => array(
			'serializable' => false,
			'setable'      => false
		),
		'lines' => array(
			'default'      => array(),
			'serializable' => false
		)
	);

	public function setLines($lines) {
		foreach ($lines as $line) {
			$this->addLine($line);
		}
	}

	public function addLine(InvoiceItem $line) {
		$this->values['lines'][] = $line;
		$this->values['invoice_amount'] += $line->invoiceitem_amount + $line->invoiceitem_shipping + $line->invoiceitem_salestax;
	}

	public function removeLine($index) {
		$line = $this->values['lines'][$index];
		$this->values['invoice_amount'] -= ($line->invoiceitem_amount + $line->invoiceitem_shipping + $line->invoiceitem_salestax);
		unset($this->values['lines'][$index]);
	}
}

?>