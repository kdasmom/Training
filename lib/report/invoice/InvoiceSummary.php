<?php

namespace NP\report\invoice;

use NP\report\ReportInterface;
use NP\report\AbstractReport;
use NP\report\ReportGroup;
use NP\report\ReportColumn;
use NP\util\Util;
use NP\core\db\Select;
use NP\property\sql\PropertyFilterSelect;

/**
 * Invoice Summary report
 *
 * @author Thomas Messier
 */
class InvoiceSummary extends AbstractReport implements ReportInterface {
	
	private $showUnit;

	public function init() {
		$this->addCols([
			new ReportColumn('Vendor', 'vendor_name', 0.2),
			new ReportColumn('Property', 'property_name', 0.15, 'string', 'left', [$this, 'renderProperty'])
		]);

		$this->showUnit = $this->configService->get('pn.InvoiceOptions.AllowUnitAttach', '0');
		if ($this->showUnit == '1') {
			$this->addCol(new ReportColumn('Unit', 'unit_number', 0.04));
		}

		$this->addCols([
			new ReportColumn('Invoice #', 'invoice_ref', 0.1, 'string', 'left', null, [$this, 'renderNumber']),
			new ReportColumn('Invoice Date', 'invoice_datetm', 0.06, 'date', 'left'),
			new ReportColumn('Post Period', 'invoice_period', 0.06, 'period', 'left'),
			new ReportColumn('Inv Amount', 'entity_amount', 0.05, 'currency', 'right'),
			new ReportColumn('PO Amount', 'po_amount', 0.05, 'currency', 'right'),
			new ReportColumn('Created By', 'created_by', 0.1),
			new ReportColumn('Last Approved By', 'approved_by', 0.1),
			new ReportColumn('Status', 'invoice_status_display', 0.09, 'string', 'left', [$this, 'renderStatus'])
		]);

		$this->addGroups([
			new ReportGroup('vendor_name', ['entity_amount','po_amount']),
			new ReportGroup('property_name', ['entity_amount','po_amount'], false)
		]);
	}

	public function renderProperty($val, $row, $report) {
		if ($row['property_status'] == -1) {
			return "{$val} (On Hold)";
		} else if ($row['property_status'] == 0) {
			return "{$val} (Inactive)";
		} else {
			return $val;
		}
	}

	public function renderNumber($val, $row, $report) {
		return "javascript:window.opener.NP.app.addHistory('Invoice:showView:{$row['invoice_id']}');";
	}

	public function renderStatus($val, $row, $report) {
		return "{$val} {$row['payment_details']}";
	}

	public function getTitle() {
		return 'Invoice Summary Report';
	}

	public function getData() {
		$extraParams     = $this->getExtraParams();
		$dateType        = $extraParams['date_filter'];
		$dateFrom = $this->getOptions()->dateFrom;
		$dateTo = $this->getOptions()->dateTo;

		$showUnit = $this->configService->get('pn.InvoiceOptions.AllowUnitAttach', '0');
    	$queryParams = [];

    	$propertyFilterSelect = new PropertyFilterSelect($this->getOptions()->propertyContext);

    	$group = " i.invoice_id";

		if ($showUnit == '1') {
			$group .= ",unt.unit_number";
		}

		$group .= ",i.invoice_ref, v.vendor_name, v.vendor_id, vs.vendorsite_code, 
				i.invoice_datetm, i.invoice_period, i.universal_field1, i.reftablekey_id, 
				pr.property_name, pr.property_id, pr.property_status, i.invoice_status,
				ipkt.Integration_Package_Type_Display_Name";

    	$select = new \NP\invoice\sql\InvoiceSelect();

    	$select->columns(['invoice_id','invoice_ref','invoice_datetm','invoice_period',
    					'universal_field1','reftablekey_id'])
    			->columnCreatedBy()
    			->columnApprovedBy()
    			->columnAmount()
    			->columnStatusDisplay()
    			->columnPaymentDetails(1, $this->configService->get('PN.Intl.DateFormat'))
    			->columnPoAmount($extraParams['only_cap_ex'])
    			->join(new \NP\invoice\sql\join\InvoiceVendorsiteJoin([]))
    			->join(new \NP\vendor\sql\join\VendorsiteVendorJoin(['vendor_id','vendor_name']))
    			->join(new \NP\invoice\sql\join\InvoiceInvoiceItemJoin())
    			->join(new \NP\invoice\sql\join\InvoiceItemPropertyJoin(['property_id','property_name','property_status']))
    			->join(new \NP\property\sql\join\PropertyIntPkgJoin([]))
    			->join(new \NP\system\sql\join\IntPkgIntPkgTypeJoin())
    			->whereNotEquals('i.invoice_status', "'draft'")
    			->whereIn('ii.property_id', $propertyFilterSelect)
    			->group($group)
    			->order("v.vendor_name ASC, pr.property_name ASC");

    	if ($showUnit) {
    		$select->join(new \NP\invoice\sql\join\InvoiceItemUnitJoin(['unit_number']));
    		if (!empty($unit_id)) {
    			$select->whereEquals('unt.unit_id', '?');
    			$queryParams[] = $unit_id;
    		}
    	}

    	if ($extraParams['only_cap_ex'] == 1) {
    		$select->join(new \NP\invoice\sql\join\InvoiceItemGlAccount([]));
    		$select->whereEquals('g.glaccounttype_id', 1);
    	}

    	if ($dateFrom !== null && $dateTo !== null) {
			$queryParams[] = \NP\util\Util::formatDateForDB($dateFrom);
			$queryParams[] = \NP\util\Util::formatDateForDB($dateTo);

			if ($dateType == 'periodRange' || $dateType == 'quarter') {
				$select->whereBetween('i.invoice_period', '?', '?');
			} else if ($dateType == 'submitted') {
				$select->whereBetween('i.invoice_submitteddate', '?', '?');
			} else if ($dateType == 'approval') {
				$select->whereBetween(
					Select::get()->column(new Expression('dbo.DateNoTime(a.approve_datetm)'))
								->from(['a'=>'approve'])
									->join(new \NP\workflow\sql\join\ApproveApproveTypeJoin([]))
								->whereEquals('a.tablekey_id', 'i.invoice_id')
								->whereEquals('a.table_name', "'invoice'")
								->whereIn('at.approvetype_name', "'approved','self approved'")
								->order('a.approve_datetm DESC')
								->limit(1),
					'?',
					'?'
				);
			} else if ($dateType == 'created') {
				$select->whereBetween('i.invoice_createddatetm', '?', '?');
			} else if ($dateType == 'paid') {
				$select->whereExists(
					Select::get()->from(['ip'=>'invoicepayment'])
								->whereEquals('ip.invoice_id', 'i.invoice_id')
								->whereBetween('ip.invoicepayment_datetm', '?', '?')
				);
			} else if ($dateType == 'invoice') {
				$select->whereBetween('i.invoice_datetm', '?', '?');
			}
		}

		if ($extraParams['only_without_pos'] === true) {
			$select->whereNotIn(
				'ii.invoiceitem_id',
				Select::get()->column('reftablekey_id')
							->from('poitem')
							->whereEquals('reftable_name', "'invoiceitem'")
							->whereIn('property_id', $propertyFilterSelect)
			);
		}

		if (!empty($extraParams['vendor_id'])) {
			$sql .= " AND v.vendor_id = ?)";
			$queryParams[] = $extraParams['vendor_id'];
		}

		if (!empty($extraParams['invoice_status'])) {
			$placeHolders = array_fill(0, count($extraParams['invoice_status']), '?');
			$placeHolders = implode(',', $placeHolders);
			$sql .= " AND i.invoice_status IN ({$placeHolders})";

			$queryParams = array_merge($queryParams, $extraParams['invoice_status']);
		}

		if (!empty($extraParams['created_by'])) {
			$select->join(new \NP\invoice\sql\join\InvoiceRecauthorJoin([]))
					->whereEquals('ra.userprofile_id', '?');

			$queryParams[] = $extraParams['created_by'];
		}

		if (!empty($extraParams['approved_by'])) {
			$select->whereExists(
				Select::get()->from(['a'=>'approve'])
								->join(new \NP\workflow\sql\join\ApproveApproveTypeJoin([]))
							->whereEquals('a.tablekey_id', 'i.invoice_id')
							->whereEquals('a.table_name', "'invoice'")
							->whereEquals('a.userprofile_id', '?')
							->whereIn('at.approvetype_name', "'approved','self approved'")
			);

			$queryParams[] = $extraParams['approved_by'];
		}

		$adapter = $this->gatewayManager->get('InvoiceGateway')->getAdapter();
		return $adapter->getQueryStmt($select, $queryParams);
	}
}

?>