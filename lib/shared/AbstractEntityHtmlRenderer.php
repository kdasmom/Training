<?php

namespace NP\shared;

/**
 * HTML renderer for invoices
 *
 * @author Thomas Messier
 */
abstract class AbstractEntityHtmlRenderer extends AbstractEntityRenderer implements EntityRendererInterface {
	
	public function renderHeader() {
		$propertyAddress = [
			'address_line1'  => $this->entity['property_address_line1'],
			'address_line2'  => $this->entity['property_address_line2'],
			'address_line3'  => $this->entity['property_address_line3'],
			'address_city'   => $this->entity['property_address_city'],
			'address_state'  => $this->entity['property_address_state'],
			'address_zip'    => $this->entity['property_address_zip'],
			'address_zipext' => $this->entity['property_address_zipext'],
			'address_country'=> $this->entity['property_address_country']
		];

		$propertyPhone = [
			'phone_number'      => $this->entity['property_phone_number'],
			'phone_ext'         => $this->entity['property_phone_ext'],
			'phone_countrycode' => $this->entity['property_phone_countrycode']
		];
		
		$this->renderCssTag();

		echo '<table width="100%" id="entityPrintTable">' .
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
		    		"<span id=\"propertyName\">{$this->entity['property_name']}</span>" .
		    		$this->getAddressHtml($propertyAddress) .
		    		"<div>{$this->getFullPhone($propertyPhone)}</div>" .
		    	'</td>' .
		    '</tr>';
	}

	public function renderCssTag() {
		echo '<link rel="stylesheet" href="' . $this->configService->getLoginUrl() . '/resources/entity.css" />';
	}

	public function renderBar() {
		echo '<tr><td colspan="2" class="spacer"></td></tr>';
		echo '<tr><td colspan="2" class="blackLine"></td></tr>';
		echo '<tr><td colspan="2" class="spacer"></td></tr>';
	}

	public function renderSubHeader() {
		echo '<tr>' .
				'<td id="vendorInfo">' .
					$this->getVendorHtml() .
				'</td>' .
				'<td>';
		
		$this->renderSubHeaderRightCol();

		$this->renderCustomFields($this->entity, 'header');

		echo	'</td>' .
			'</tr>' .
		'</table>';
	}

	public function getVendorHtml() {
		return "{$this->entity['vendor_name']}" .
				"<div>Vendor ID: {$this->entity['vendor_id_alt']}</div>" .
				$this->getAddressHtml($this->entity) .
				"<div>{$this->getFullPhone($this->entity)}</div>";
	}

	abstract public function renderSubHeaderRightCol();

	protected function renderCustomField($data, $customField, $type) {
		echo $this->getIfNotBlank($data['universal_field' . $customField['fieldNumber']], $customField['label']);
	}

	public function renderLines() {
		$lineNumHtml = '';
		if ($this->options['lineNumbers']) {
			$lineNumHtml = '<th width="50px">Line #</th>';
		}

		$glHtml = '';
		if (!$this->options['combineSplit'] && $this->options['glCode']) {
			$glHtml = '<th width="150px">GL Account</th>';
		}

		echo '<table width="100%" id="entityPrintLines">' .
			'<tr>' .
				$lineNumHtml .
				$glHtml .
				'<th width="50px">QTY</th>' .
				'<th width="400px">Description</th>' .
				'<th width="100px">Item Price</th>' .
				'<th width="100px">Amount</th>' .
			'</tr>';

		parent::renderLines();
	}

	public function renderLine($line, $lineNum) {
		$prefix = $this->getItemPrefix();

		$lineNumHtml = '';
		if ($this->options['lineNumbers']) {
			$lineNumHtml = "<td>{$lineNum}</td>";
		}

		$glHtml = '';
		if (!$this->options['combineSplit'] && $this->options['glCode']) {
			$glHtml = "<td>{$line['glaccount_number']}<br />{$line['glaccount_name']}</td>";
		}

		echo 
			'<tr>' .
				$lineNumHtml .
				$glHtml .
				'<td>' .
					$line["{$prefix}_quantity"];

		if (array_key_exists('UtilityColumn_UsageType_Name', $line)) {
			echo $this->getIfNotBlank($line['UtilityColumn_UsageType_Name']);
		}
					
		echo 	'</td>' .
				'<td>';

		if (array_key_exists('utilityaccount_id', $line) && $line['utilityaccount_id'] !== null) {
			echo 	"<div>Account Number: {$line['UtilityAccount_AccountNumber']}</div>" .
					"{$this->getIfNotBlank($line['UtilityAccount_MeterSize'], "Meter Number")}";
		}

		echo		"<div>" . $line["{$prefix}_description"] . "</div>" .
					$this->getIfNotBlank($line["{$prefix}_description_alt"]);

		if ($this->options['lineItemNum']) {
			echo $this->getIfNotBlank($line['vcitem_number'], "Item Number");
		}

		if ($this->options['lineItemUom'] && !empty($line['vcitem_uom'])) {
			echo	'<div>' .
						'UOM: ';

			if (!$this->options['combineSplit'] && array_key_exists('unittype_material_name', $line) && !empty($line['unittype_material_name'])) {
				echo	"{$line['unittype_material_name']} ";
			}
						
			echo		"{$line['vcitem_uom']}" .
					'</div>';
		}
					
		$this->renderCustomFields($line, 'line');

		if ($this->options['job']) {
			$this->renderJobCosting($line);
		}

		echo		$this->getIfNotBlank($line['purchaseorder_ref'], "PO") .
				'</td>' .
				"<td class=\"align-right\">" . $this->currencyFormat($line["{$prefix}_unitprice"]) . "</td>" .
				"<td class=\"align-right\">" . $this->currencyFormat($line["{$prefix}_amount"]) . "</td>" .
			'</tr>';
	}

	public function renderJobCosting($line) {
		$prefix = $this->getItemPrefix();

		if ($line["{$prefix}_jobflag"] == 1) {
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
		$colspan = 3;

		if ($this->options['lineNumbers']) {
			$colspan++;
		}
		if (!$this->options['combineSplit'] && $this->options['glCode']) {
			$colspan++;
		}

		echo '<tfoot>' .
        		'<tr>' .
                '<th colspan="' . $colspan . '">' .
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
		$prefix = $this->getPrefix();
		
		echo '<div class="noteLabel">Notes</div>' .
			$this->getDisplayNote($this->entity["{$prefix}_note"]);
	}

	public function renderOverageNotes() {
		$prefix = $this->getPrefix();
		
		echo '<div class="noteLabel">Budget Overage Notes</div>' .
			$this->getDisplayNote($this->entity["{$prefix}_budgetoverage_note"]);
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
		$prefix = $this->getPrefix();

		echo '<div class="noteLabel">History Log</div>';

		if ($this->entity["{$prefix}_status"] !== 'draft') {
			$historyRecs = $this->getHistoryLog();
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

	public function renderForwards($type) {
		$prefix = $this->getPrefix();

		echo '<div class="noteLabel">Forwards</div>';

		$forwardRecs = $this->getForwardsLog($type);
		if (count($forwardRecs)) {
			echo '<table cellpadding="0" cellspacing="0" border="0" width="100%" class="logTable">
					<thead>
						<tr>
							<th>Sent From</th>
							<th>Sent To Email</th>
							<th>Sent To</th>
							<th>Date Forwarded</th>
						</tr>
					</thead>		
					<tbody>';

			foreach ($forwardRecs as $forward) {
				$forwardDate = \DateTime::createFromFormat(\NP\util\Util::getServerDateFormat(), $forward['forward_datetm']);
				$forwardDate = $forwardDate->format($this->getSetting('PN.Intl.DateFormat', 'm/d/Y') . ' H:iA');

				$from = "{$forward['from_person_firstname']} {$forward['from_person_lastname']}";
				if (
					$forward['forward_from_userprofile_id'] !== $forward['from_delegation_to_userprofile_id']
					&& !empty($forward['forward_from_userprofile_id'])
					&& !empty($forward['from_delegation_to_userprofile_id'])
				) {
					$from .= " (done by {$forward['userprofile_username']} on behalf of {$forward['delegation_userprofile_username']})";
				}

				echo '<tr>' .
						"<td>{$from}</td>" .
						"<td>{$forward['forward_to_email']}</td>" .
						"<td>{$forward['to_person_firstname']} {$forward['to_person_lastname']}</td>" .
						"<td>{$forwardDate}</td>" .
					'</tr>';
			}

			echo	'</tbody>' .
				'<table>';

			return;
		}

		echo 'No information to display.';
	}
}