<?php

namespace NP\invoice;

use NP\shared\EntityRendererInterface;
use NP\shared\AbstractEntityHtmlRenderer;

/**
 * HTML renderer for invoices
 *
 * @author Thomas Messier
 */
class InvoiceHtmlRenderer extends AbstractEntityHtmlRenderer implements EntityRendererInterface {
	public function getPrefix() {
		return 'invoice';
	}

	public function getItemPrefix() {
		return 'invoiceitem';
	}

	public function renderSubHeaderRightCol() {
		echo "{$this->getIfNotBlank($this->entity['invoice_ref'], 'Invoice')}" .
			"{$this->getIfNotBlank($this->entity['invoice_datetm'], 'Invoice Date', 'date')}" .
			"{$this->getIfNotBlank($this->entity['invoice_duedate'], 'Due Date', 'date')}" .
			"{$this->getIfNotBlank($this->entity['entity_amount'], 'Invoice Total', 'currency')}" .
			"{$this->getIfNotBlank($this->entity['created_by'], 'Created By')}" .
			"{$this->getIfNotBlank($this->entity['invoice_createddatetm'], 'Created Date', 'date')}" .
			"{$this->getIfNotBlank($this->entity['invoice_period'], $this->getSetting('PN.General.postPeriodTerm'), 'date', 'm/Y')}";
	}
}