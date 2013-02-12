<?php

namespace NP\invoice;

use NP\core\AbstractEntity;

/**
 * Invoice entity
 *
 * @author Thomas Messier
 */
class Invoice extends AbstractEntity {
	
	/**
	 * Field definitions for the entity
	 *
	 * @var array
	 */
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
		'invoice_status' => array(
			'default' => 'open',
			'validation' => array(
				'inArray' => array(
					'haystack' => array('open','forapproval','saved','approved','rejected','sent','submitted','posted','paid','hold','draft','void')
				)
			),
		),
		'invoice_amount' => array(
			'serializable' => false,
			'setable'      => false
		),
		'lines' => array(
			'default'      => array(),
			'serializable' => false
		),
	);

	/**
	 * Sets all lines for the invoice
	 *
	 * @param NP\invoice\InvoiceItem[] $lines
	 */
	public function setLines($lines) {
		foreach ($lines as $line) {
			$this->addLine($line);
		}
	}

	/**
	 * Adds a line item to the invoice
	 *
	 * @param NP\invoice\InvoiceItem $line
	 */
	public function addLine(InvoiceItem $line) {
		$this->values['lines'][] = $line;
		$this->values['invoice_amount'] += $line->invoiceitem_amount + $line->invoiceitem_shipping + $line->invoiceitem_salestax;
	}

	/**
	 * Removes a line at the specified index for the invoice
	 *
	 * @param int $index The line number to remove
	 */
	public function removeLine($index) {
		$line = $this->values['lines'][$index];
		$this->values['invoice_amount'] -= ($line->invoiceitem_amount + $line->invoiceitem_shipping + $line->invoiceitem_salestax);
		array_splice($this->values['lines'], $index, 1);
	}
}

?>