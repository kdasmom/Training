<?php

namespace NP\invoice;

use NP\system\ConfigService;
use NP\core\GatewayManager;

/**
 * Abstract renderer for invoices; should be extended by concrete invoice renderers
 *
 * @author Thomas Messier
 */
abstract class AbstractInvoiceRenderer implements InvoiceRendererInterface {
	protected $invoiceService, $invoice, $options;

	public function __construct(ConfigService $configService, GatewayManager $gatewayManager, InvoiceService $invoiceService, $invoice_id=null, $options=[]) {
		$this->configService  = $configService;
		$this->invoiceService = $invoiceService;
		$this->gatewayManager = $gatewayManager;

		$this->setInvoice($invoice_id);
		$this->setOptions($options);
	}

	/**
	 * Sets the invoice to be renderered
	 */
	public function setInvoice($invoice_id) {
		if (!empty($invoice_id)) {
			$this->invoice = $this->invoiceService->get($invoice_id);
		}
	}

	/**
	 * Sets the options for rendering the invocie
	 */
	public function setOptions($options) {
		$this->options = $options;
	}

	/**
	 * Main rendering function
	 */
	public function render() {
		$this->renderHeader();
		$this->renderBar();
		$this->renderSubHeader();
		$this->renderLines();
		$this->renderLineFooter();

		if (in_array('notes', $this->options)) {
			$this->renderNotes();
		}
		
		if (in_array('overageNotes', $this->options)) {
			$this->renderOverageNotes();
		}
		
		if (in_array('holdReason', $this->options)) {
			$this->renderHoldReason();
		}
		
		if (in_array('payments', $this->options)) {
			$this->renderPayments();
		}
		
		if (in_array('history', $this->options)) {
			$this->renderHistory();
		}
	}

	abstract function renderBar();

	public function renderCustomFields($data, $type) {
		if (in_array($type.'Custom', $this->options)) {
			$customFields = $this->configService->getInvoicePoCustomFields();
			$customFields = $customFields[$type]['fields'];
			foreach ($customFields as $customField) {
				if ($customField['invOn']) {
	    			$this->renderCustomField($data, $customField);
	    		}
			}
		}
	}

	abstract protected function renderCustomField($data, $customField);

	public function renderLines() {
		$this->invoice['total']           = 0;
		$this->invoice['tax_total']       = 0;
		$this->invoice['shipping_total']  = 0;
		$this->invoice['retention_total'] = 0;

		foreach ($this->invoice['lines'] as $line) {
			// Add to totals
			$this->invoice['total'] += $line['invoiceitem_amount'] + $line['invoiceitem_salestax'] + $line['invoiceitem_shipping'];
			$this->invoice['tax_total']      += $line['invoiceitem_salestax'];
			$this->invoice['shipping_total'] += $line['invoiceitem_shipping'];

			$line['jbassociation_retamt'] = (float)$line['jbassociation_retamt'];
			if (is_numeric($line['jbassociation_retamt'])) {
				$this->invoice['retention_total'] += $line['jbassociation_retamt'];
			}

			$this->renderLine($line);
		}
	}

	protected function getGrossTotal() {
		return $this->invoice['total'];
	}

	protected function getNetTotal() {
		return $this->getGrossTotal() - $this->getRententionTotal();
	}

	protected function getRententionTotal() {
		return $this->invoice['retention_total'];
	}

	protected function getTaxTotal() {
		return $this->invoice['tax_total'];
	}

	protected function getShippingTotal() {
		return $this->invoice['shipping_total'];
	}

	abstract function renderLine($line);

	protected function getDisplayStatus() {
		$status = $this->invoice['invoice_status'];
		if ($status == 'forapproval') {
			return 'Pending Approval';
		} else if ($status == 'open') {
			return 'In Progress';
		} else if ($status == 'saved') {
			return 'Completed';
		} else if ($status == 'draft') {
			return 'Template';
		} else if ($status == 'closed') {
			return 'Invoiced';
		} else {
			return ucfirst($status);
		}
	}

	protected function getAddressHtml($addressData) {
		$html  = '';
		$city  = ($addressData['address_city'] === null) ? '' : $addressData['address_city'];
		$state = ($addressData['address_state'] === null) ? '' : $addressData['address_state'];
		$zip   = ($addressData['address_zip'] === null) ? '' : $addressData['address_zip'];

		for ($i=1; $i<=3; $i++) {
			if ($addressData['address_line'.$i] != '' && $addressData['address_line'.$i] !== null) {
				$html .= '<div>' . $addressData['address_line'.$i] . '</div>';
			}
		}

		if ($city != '' || $state != '' || $zip != '') {
			$html .= '<div>';
			if ($city != '') {
				$html .= $city;
				if ($state != '') {
					$html .= ', ';
				} else if ($zip != '') {
					$html .= ' ';
				}
			}
			if ($state != '') {
				$html .= $state;
				if ($zip != '') {
					$html .= ' ';
				}
			}
			if ($zip != '') {
				$html .= $zip;
				if ($addressData['address_zipext'] != '' && $addressData['address_zipext'] !== null) {
					$html .= '-' . $addressData['address_zipext'];
				}
			}

			$html .= '</div>';
		}

		if ($addressData['address_country'] !== null) {
			$country = $this->gatewayManager->get('CountryGateway')->findSingle('country_id = ?', [$addressData['address_country']]);
			if ($country !== null) {
				$html .= '<div>' . $country['country_name'] . '</div>';
			}
		}

		return $html;
	}

	protected function getFullPhone($phoneData) {
		$fullPhone   = '';
		$phoneNumber = ($phoneData['phone_number'] === null) ? '' : $phoneData['phone_number'];

		if ($phoneData['phone_countrycode'] != '' && $phoneData['phone_countrycode'] !== null) {
			$fullPhone .= '+' . $phoneData['phone_countrycode'];
		}

		if ($phoneNumber != '') {
			$phoneStripped = preg_replace('/[^\d]/', '', $phoneNumber);
			if (strlen($phoneStripped) == 10) {
				$phoneNumber = '(' . substr($phoneStripped, 0, 3) . ') ' . substr($phoneStripped, 3, 3) . '-' . substr($phoneStripped, 6, 4);
			}
			if ($fullPhone != '') {
				$fullPhone .= ' ';
			}
			$fullPhone .= $phoneNumber;

			if ($phoneData['phone_ext'] != '' && $phoneData['phone_ext'] !== null) {
				$fullPhone .= ' x' . $phoneData['phone_ext'];
			}
		}

		return $fullPhone;
	}

	protected function getIfNotBlank($val, $label='', $type='string', $format=null) {
		if ($format === null) {
			if ($type == 'date') {
				$format = 'm/d/Y';
			}	
		}

    	if (!empty($val)) {
    		if ($type == 'date') {
    			$val = \DateTime::createFromFormat(\NP\util\Util::getServerDateFormat(), $val);
    			$val = $val->format($this->getSetting('PN.Intl.DateFormat', 'm/d/Y'));
    		} else if ($type == 'currency') {
    			$val = $this->currencyFormat($val);
    		}

    		if ($label != '') {
    			$label .= ': ';
    		}
    		return '<div>' . $label . $val . '</div>';
    	}

    	return '';
	}
	protected function getDisplayNote($note) {
		if (!empty($note)) {
			return $note;	
		} else {
			return 'No information to display.';
		}
	}

	protected function currencyFormat($val) {
		return $this->configService->get('PN.Intl.currencySymbol', '$') . number_format($val, 2);
	}

	protected function getSetting($setting, $defaultVal='') {
		return $this->configService->get($setting, $defaultVal);
	}

	protected function getHoldReasons() {
		return $this->gatewayManager->get('NoteGateway')->findHoldNotes($this->invoice['invoice_id']);
	}

	protected function getPayments() {
		return $this->invoiceService->getPayments($this->invoice['invoice_id']);
	}

	protected function getHistory() {
		return $this->invoiceService->getHistoryLog($this->invoice['invoice_id']);
	}
}