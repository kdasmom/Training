<?php

namespace NP\shared;

use NP\system\ConfigService;
use NP\core\GatewayManager;
use NP\core\AbstractService;

/**
 * Abstract renderer for entities (invoices, POs); should be extended by concrete entity renderers
 *
 * @author Thomas Messier
 */
abstract class AbstractEntityRenderer implements EntityRendererInterface {
	protected $service, $entity_id, $entity;

	protected $options = [
		'notes'        => false,
		'overageNotes' => false,
		'holdReason'   => false,
		'payments'     => false,
		'history'      => false,
		'forward'      => false,
		'headerCustom' => false,
		'lineCustom'   => false,
		'lineNumbers'  => false,
		'combineSplit' => false,
		'lineItemNum'  => true,
		'lineItemUom'  => true,
		'glCode'       => true,
		'job'          => true,
		'unit'         => true,
		'created'      => true,
		'allImages'    => false,
		'mainImage'    => false
	];

	public function __construct(ConfigService $configService, GatewayManager $gatewayManager, AbstractService $service, $entity_id=null, $options=[]) {
		$this->configService  = $configService;
		$this->gatewayManager = $gatewayManager;
		$this->service        = $service;
		$this->entity_id      = $entity_id;

		$this->initEntity();

		$this->setOptions($options);
	}

	public function initEntity() {
		// We check if the value is true to prevent a call to the invoice service function with an invalid
		// argument, since there's no option to combine splits for invoices
		if ($this->options['combineSplit']) {
			$this->entity = $this->service->get($this->entity_id, true);
		} else {
			$this->entity = $this->service->get($this->entity_id);
		}
	}

	abstract public function getPrefix();
	abstract public function getItemPrefix();

	/**
	 * Sets the options for rendering the invocie
	 */
	public function setOptions($options) {
		foreach ($options as $option) {
			$this->options[$option] = true;
		}
	}

	public function getOptions() {
		return $this->options;
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

		if ($this->options['notes']) {
			$this->renderNotes();
		}
		
		if ($this->options['overageNotes']) {
			$this->renderOverageNotes();
		}
		
		if ($this->options['holdReason']) {
			$this->renderHoldReason();
		}
		
		if ($this->options['payments']) {
			$this->renderPayments();
		}
		
		if ($this->options['history']) {
			$this->renderHistory();
		}
	}

	abstract function renderBar();
	abstract function renderSubHeader();

	public function renderCustomFields($data, $type) {
		if ($this->options["{$type}Custom"]) {
			$customFields = $this->configService->getInvoicePoCustomFields();
			$customFields = $customFields[$type]['fields'];
			foreach ($customFields as $customField) {
				if (array_key_exists('invoice_id', $data) || array_key_exists('invoiceitem_id', $data)) {
					$onKey = 'invOn';
				} else {
					$onKey = 'poOn';
				}
				if ($customField[$onKey]) {
	    			$this->renderCustomField($data, $customField, $type);
	    		}
			}
		}
	}

	abstract protected function renderCustomField($data, $customField, $type);

	public function renderLines() {
		$this->entity['total']           = 0;
		$this->entity['tax_total']       = 0;
		$this->entity['shipping_total']  = 0;
		$this->entity['retention_total'] = 0;

		foreach ($this->entity['lines'] as $lineNum=>$line) {
			// Add to totals
			$prefix = $this->getItemPrefix();
			$this->entity['total'] += $line["{$prefix}_amount"] + $line["{$prefix}_salestax"] + $line["{$prefix}_shipping"];
			$this->entity['tax_total']      += $line["{$prefix}_salestax"];
			$this->entity['shipping_total'] += $line["{$prefix}_shipping"];

			$line['jbassociation_retamt'] = (float)$line['jbassociation_retamt'];
			if (is_numeric($line['jbassociation_retamt'])) {
				$this->entity['retention_total'] += $line['jbassociation_retamt'];
			}

			$this->renderLine($line, $lineNum);
		}
	}

	abstract function renderLine($line, $lineNum);

	protected function getGrossTotal() {
		return $this->entity['total'];
	}

	protected function getNetTotal() {
		return $this->getGrossTotal() - $this->getRententionTotal();
	}

	protected function getRententionTotal() {
		return $this->entity['retention_total'];
	}

	protected function getTaxTotal() {
		return $this->entity['tax_total'];
	}

	protected function getShippingTotal() {
		return $this->entity['shipping_total'];
	}

	public function getDisplayStatus() {
		$prefix = $this->getPrefix();

		$status = $this->entity["{$prefix}_status"];
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

	abstract protected function getHistoryLog();

	public function getForwardsLog($type) {
		return $this->gatewayManager->get('InvoicePoForwardGateway')->findByEntity($type, $this->entity_id);
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
}