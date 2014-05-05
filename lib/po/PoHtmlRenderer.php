<?php

namespace NP\po;

use NP\shared\EntityRendererInterface;
use NP\shared\AbstractEntityHtmlRenderer;

/**
 * HTML renderer for POs
 *
 * @author Thomas Messier
 */
class PoHtmlRenderer extends AbstractEntityHtmlRenderer implements EntityRendererInterface {
	public function getPrefix() {
		return 'purchaseorder';
	}

	public function getItemPrefix() {
		return 'poitem';
	}

	public function renderSubHeaderRightCol() {
		echo "{$this->getIfNotBlank($this->entity['purchaseorder_ref'], 'PO Number')}" .
			"{$this->getIfNotBlank($this->entity['purchaseorder_datetm'], 'Date', 'date')}" .
			"{$this->getIfNotBlank($this->entity['entity_amount'], 'PO Total', 'currency')}" .
			"{$this->getIfNotBlank($this->entity['created_by'], 'Created By')}" .
			"{$this->getIfNotBlank($this->entity['purchaseorder_created'], 'Created Date', 'date')}" .
			"{$this->getIfNotBlank($this->entity['purchaseorder_period'], $this->getSetting('PN.General.postPeriodTerm'), 'date', 'm/Y')}";
	}

	public function getHistoryLog() {
		return $this->gatewayManager->get('PurchaseOrderGateway')->findHistoryLog($this->entity_id);
	}
}