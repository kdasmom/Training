<?php

namespace NP\invoice;

/**
 * HTML renderer for invoices
 *
 * @author Thomas Messier
 */
class InvoiceHtmlRenderer extends AbstractInvoiceRenderer implements InvoiceRendererInterface {
	
	public function renderHeader() {
		$propertyAddress = [
			'address_line1'  => $this->invoice['property_address_line1'],
			'address_line2'  => $this->invoice['property_address_line2'],
			'address_line3'  => $this->invoice['property_address_line3'],
			'address_city'   => $this->invoice['property_address_city'],
			'address_state'  => $this->invoice['property_address_state'],
			'address_zip'    => $this->invoice['property_address_zip'],
			'address_zipext' => $this->invoice['property_address_zipext'],
			'address_country'=> $this->invoice['property_address_country']
		];

		$propertyPhone = [
			'phone_number'      => $this->invoice['property_phone_number'],
			'phone_ext'         => $this->invoice['property_phone_ext'],
			'phone_countrycode' => $this->invoice['property_phone_countrycode']
		];
		
		echo '<link rel="stylesheet" href="resources/entity.css" />' .
			'<table width="100%" id="entityPrintTable">' .
			'<tr>' .
    			'<td width="75%">';

    	$clientName = $this->configService->get('PN.Main.ClientShortName', '');
    	if (!empty($clientName)) {
    		echo "<span id=\"clientShortName\">{$clientName}</span>";
    	}
    	echo
	    			'<br />' .
	    			"Status: {$this->getDisplayStatus()}" .
	    		'</td>' .
		    	'<td>' .
		    		"<span id=\"propertyName\">{$this->invoice['property_name']}</span>" .
		    		$this->getAddressHtml($propertyAddress) .
		    		"<div>{$this->getFullPhone($propertyPhone)}</div>" .
		    	'</td>' .
		    '</tr>';
	}

	public function renderBar() {
		echo '<tr><td colspan="2" class="spacer"></td></tr>';
		echo '<tr><td colspan="2" class="blackLine"></td></tr>';
		echo '<tr><td colspan="2" class="spacer"></td></tr>';
	}

	public function renderSubHeader() {
		echo '<tr>' .
				'<td id="vendorInfo">' .
					"{$this->invoice['vendor_name']}" .
					"<div>Vendor ID: {$this->invoice['vendor_id_alt']}</div>" .
					$this->getAddressHtml($this->invoice) .
	    			"<div>{$this->getFullPhone($this->invoice)}</div>" .
				'</td>' .
				'<td>' .
					"{$this->getIfNotBlank($this->invoice['invoice_ref'], 'Invoice')}" .
					"{$this->getIfNotBlank($this->invoice['invoice_datetm'], 'Invoice Date', 'date')}" .
					"{$this->getIfNotBlank($this->invoice['invoice_duedate'], 'Due Date', 'date')}" .
					"{$this->getIfNotBlank($this->invoice['entity_amount'], 'Invoice Total', 'currency')}" .
					"{$this->getIfNotBlank($this->invoice['created_by'], 'Created By')}" .
					"{$this->getIfNotBlank($this->invoice['invoice_createddatetm'], 'Created Date', 'date')}" .
					"{$this->getIfNotBlank($this->invoice['invoice_period'], $this->getSetting('PN.General.postPeriodTerm'), 'date', 'm/Y')}";
		
		$this->renderCustomFields($this->invoice, 'header');

		echo	'</td>' .
			'</tr>' .
		'</table>';
	}

	protected function renderCustomField($data, $customField) {
		echo $this->getIfNotBlank($data['universal_field' . $customField['fieldNumber']], $customField['label']);
	}

	public function renderLines() {
		echo '<table width="100%" id="entityPrintLines">' .
			'<tr>' .
				'<th width="150px">GL Account</th>' .
				'<th width="50px">QTY</th>' .
				'<th width="400px">Description</th>' .
				'<th width="100px">Item Price</th>' .
				'<th width="100px">Amount</th>' .
			'</tr>';

		parent::renderLines();
	}

	public function renderLine($line) {
		echo 
			'<tr>' .
				"<td>{$line['glaccount_number']}<br />{$line['glaccount_name']}</td>" .
				'<td>' .
					"{$line['invoiceitem_quantity']}" .
					"{$this->getIfNotBlank($line['UtilityColumn_UsageType_Name'])}" .
				'</td>' .
				'<td>';

		if ($line['utilityaccount_id'] !== null) {
			echo 	"<div>Account Number: {$line['UtilityAccount_AccountNumber']}</div>" .
					"{$this->getIfNotBlank($line['UtilityAccount_MeterSize'], "Meter Number")}";
		}

		echo		"<div>{$line['invoiceitem_description']}</div>" .
					"{$this->getIfNotBlank($line['invoiceitem_description_alt'])}" .
					"{$this->getIfNotBlank($line['vcitem_number'], "Item Number")}";

		if (!empty($line['vcitem_uom'])) {
			echo	'<div>' .
						'UOM: ';

			if (!empty($line['unittype_material_name'])) {
				echo	"{$line['unittype_material_name']} ";
			}
						
			echo		"{$line['vcitem_uom']}" .
					'</div>';
		}
					
		$this->renderCustomFields($line, 'line');

		$this->renderJobCosting($line);

		echo		"{$this->getIfNotBlank($line['purchaseorder_ref'], "PO")}" .
				'</td>' .
				"<td class=\"align-right\">{$this->currencyFormat($line['invoiceitem_unitprice'])}</td>" .
				"<td class=\"align-right\">{$this->currencyFormat($line['invoiceitem_amount'])}</td>" .
			'</tr>';
	}

	public function renderJobCosting($line) {
		if ($line['invoiceitem_jobflag'] == 1) {
			$fields = [
				['setting'=>'pn.jobcosting.useContracts', 'field'=>'contract'],
				['setting'=>'JB_UseChangeOrders', 'field'=>'changeOrder'],
				['setting'=>'pn.jobcosting.useJobCodes', 'field'=>'jobCode'],
				['setting'=>'JB_UsePhaseCodes', 'field'=>'phaseCode'],
				['setting'=>'pn.jobcosting.useCostCodes', 'field'=>'costCode']
			];

			foreach ($fields as $field) {
				$fieldPrefix = 'jb' . strtolower($field['field']);
				if ($this->getSetting($field['setting'], '0') == '1' && !empty($line[$fieldPrefix . '_id'])) {
					$val = $line[$fieldPrefix . '_name'] . ' - ';
					if (!empty($line[$fieldPrefix . '_desc'])) {
						$val .= $line[$fieldPrefix . '_desc'];
					} else {
						$val .= 'No Desc.';
					}
					$termSetting = "PN.jobcosting.{$field['field']}Term";
					echo '<div>' .
	                        "<b>{$this->getSetting($termSetting)}:</b>" .
	                        " {$val}" .
	                    '</div>';
				}
			}
		}

		if (!empty($line['jbassociation_retamt']) && $line['jbassociation_retamt'] !== 0) {
			echo '<div>' .
                    "<b>Retention:</b> {$this->currencyFormat($line['jbassociation_retamt'])}" .
                '</div>';
		}
	}

	public function renderLineFooter() {
		echo '<tfoot>' .
        		'<tr>' .
                '<th colspan="4">' .
                    '<div>' . strtoupper($this->getSetting('PN.General.salesTaxTerm', 'Sales Tax')) . '</div>' .
                    '<div>SHIPPING</div>' .
                    '<div>';

        if ($this->getSetting('pn.jobcosting.jobcostingEnabled', '0')) {
        	echo		'GROSS ';
        }

        echo			'TOTAL' .
	                '</div>';

	    if ($this->getSetting('pn.jobcosting.jobcostingEnabled', '0')) {
	    	echo	'<div>NET AMOUNT</div>';
	    }

	    echo 		'</th>' .
                '<td>' .
                    "<div>{$this->currencyFormat($this->getTaxTotal())}</div>" .
                    "<div>{$this->currencyFormat($this->getShippingTotal())}</div>" .
                    "<div>{$this->currencyFormat($this->getGrossTotal())}</div>";

        if ($this->getSetting('pn.jobcosting.jobcostingEnabled', '0')) {
        	echo "<div>{$this->currencyFormat($this->getNetTotal())}</div>";
        }
                    
        echo	'</td>' .
            '</tr>' .
        '</tfoot>' .
		'</table>';
	}

	public function renderNotes() {
		echo '<div class="noteLabel">Notes</div>' .
			$this->getDisplayNote($this->invoice['invoice_note']);
	}

	public function renderOverageNotes() {
		echo '<div class="noteLabel">Budget Overage Notes</div>' .
			$this->getDisplayNote($this->invoice['invoice_budgetoverage_note']);
	}

	public function renderHoldReason() {
		$reasons = $this->getHoldReasons();
		echo '<div class="noteLabel">On Hold Reasons</div>';

		if (count($reasons)) {
			echo '<table cellspacing="0" cellpadding="0" width="100%" border="0">';
			foreach ($reasons as $reason) {
				echo '<tr>' .
						'<td width="50%">';

				if (empty($reason['note'])) {
					echo $reason['reason_text'];
				} else {
					echo preg_replace('/[\n]/', '<br />', $reason['note']);
				}
				$noteDate = \DateTime::createFromFormat(\NP\util\Util::getServerDateFormat(), $reason['note_createddatetm']);
    			$noteDate = $noteDate->format($this->getSetting('PN.Intl.DateFormat', 'm/d/Y'));
				echo	'</td>' .
						'<td>{$noteDate}</td>' .
						"<td>{$reason['userprofile_username']}</td>" .
					'</tr>';
			}
			echo '</table>';
		} else {
			echo 'No information to display.';
		}
	}

	public function renderPayments() {
		$payments = $this->getPayments();

		echo '<div class="noteLabel">Invoice Payments</div>';

		if (count($payments)) {
			echo '<table cellpadding="0" cellspacing="0" border="0" width="100%" class="logTable">
					<thead>
						<tr>
							<th>Payment #</th>
							<th>Date</th>
							<th>Status</th>
							<th>Payment Method</th>
							<th>Amount</th>
						</tr>
					</thead>		
					<tbody>';

			foreach ($payments as $payment) {
				$paymentDate = \DateTime::createFromFormat(\NP\util\Util::getServerDateFormat(), $payment['invoicepayment_datetm']);
    			$paymentDate = $paymentDate->format($this->getSetting('PN.Intl.DateFormat', 'm/d/Y'));
				echo '<tr>' .
						"<td>{$payment['invoicepayment_number']}</td>" .
						"<td>{$paymentDate}</td>" .
						"<td>" . strtoupper($payment['invoicepayment_status']) ."</td>" .
						"<td>{$payment['invoicepayment_method']}</td>" .
						"<td>{$this->currencyFormat($payment['invoicepayment_amount'])}</td>" .
					'</tr>';
			}

			echo	'</tbody>' .
				'<table>';
		} else {
			echo 'No information to display';

			if ($this->invoice['invoice_status'] !== 'paid') {
				echo ' because the invoice status is not yet paid';
			}

			echo '.';
		}
	}

	public function renderHistory() {
		echo '<div class="noteLabel">History Log</div>';

		if ($this->invoice['invoice_status'] !== 'draft') {
			$historyRecs = $this->getHistory();
			if (count($historyRecs)) {
				echo '<table cellpadding="0" cellspacing="0" border="0" width="100%" class="logTable">
						<thead>
							<tr>
								<th>Date</th>
								<th>Message</th>
								<th>Submitted by</th>
								<th>Submitted to</th>
								<th>Action</th>
							</tr>
						</thead>		
						<tbody>';

				foreach ($historyRecs as $history) {
					$logDate = \DateTime::createFromFormat(\NP\util\Util::getServerDateFormat(), $history['approve_datetm']);
    				$logDate = $logDate->format($this->getSetting('PN.Intl.DateFormat', 'm/d/Y') . ' H:iA');
					echo '<tr>' .
							"<td>{$logDate}</td>" .
							"<td>{$history['message']}</td>" .
							"<td>" . strtoupper($history['userprofile_username']) ."</td>" .
							"<td>" . strtoupper($history['approver']) ."</td>" .
							"<td>" . strtoupper($history['approvetype_name']) ."</td>" .
						'</tr>';
				}

				echo	'</tbody>' .
					'<table>';

				return;
			}
		}

		echo 'No information to display.';
	}
}