<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 5/8/2014
 * Time: 11:05 AM
 */

namespace NP\report\invoice;


use NP\core\db\Expression;
use NP\core\db\Select;
use NP\report\AbstractReport;
use NP\report\ReportColumn;
use NP\report\ReportInterface;

class Export extends AbstractReport implements ReportInterface {
	public function init() {
		$this->addCols([
			new ReportColumn('PropertyCode', 'property_id_alt', 0.2),
			new ReportColumn('InvoiceNumber', 'invoice_ref', 0.15, 'string', 'left'),
			new ReportColumn('VendorCode', 'vendor_id_alt', 0.15, 'string', 'left'),
			new ReportColumn('InvoiceDate', 'invoice_datetm', 0.15, 'string', 'left'),
			new ReportColumn('InvoicePeriod', 'invoice_period', 0.15, 'string', 'left'),
			new ReportColumn('DueDate', 'invoice_duedate', 0.15, 'string', 'left'),
			new ReportColumn('InvoiceCreatedDate', 'invoice_createddatetm', 0.15, 'string', 'left'),
			new ReportColumn('InvoiceCustomField1', 'header_unifield1', 0.15, 'string', 'left'),
			new ReportColumn('InvoiceCustomField2', 'header_unifield2', 0.15, 'string', 'left'),
			new ReportColumn('InvoiceCustomField3', 'header_unifield3', 0.15, 'string', 'left'),
			new ReportColumn('InvoiceCustomField4', 'header_unifield4', 0.15, 'string', 'left'),
			new ReportColumn('InvoiceCustomField5', 'header_unifield5', 0.15, 'string', 'left'),
			new ReportColumn('InvoiceCustomField6', 'header_unifield6', 0.15, 'string', 'left'),
			new ReportColumn('InvoiceLineNumber', 'invoiceitem_linenum', 0.15, 'string', 'left'),
			new ReportColumn('AccountNumber', 'Account_Number', 0.15, 'string', 'left'),
			new ReportColumn('DepartmentCode', 'unit_number', 0.15, 'string', 'left'),
			new ReportColumn('InvoiceItemQuantity', 'InvoiceItem_Quantity', 0.15, 'string', 'left'),
			new ReportColumn('InvoiceItemUnitPrice', 'InvoiceItem_UnitPrice', 0.15, 'string', 'left'),
			new ReportColumn('InvoiceItemAmount', 'InvoiceItem_Amount', 0.15, 'string', 'left'),
			new ReportColumn('InvoiceItemSalesTax', 'InvoiceItem_SalesTax', 0.15, 'string', 'left'),
			new ReportColumn('InvoiceItemShipping', 'InvoiceItem_shipping', 0.15, 'string', 'left'),
			new ReportColumn('InvoiceItemDescription', 'InvoiceItem_Description', 0.15, 'string', 'left'),
			new ReportColumn('InvoiceItemContract', 'jbcontract_name', 0.15, 'string', 'left'),
			new ReportColumn('InvoiceItemJobCode', 'jbjobcode_name', 0.15, 'string', 'left'),
			new ReportColumn('InvoiceItemCostCode', 'jbcostcode_name', 0.15, 'string', 'left'),
			new ReportColumn('InvoiceItemCustomField1', 'universal_field1', 0.15, 'string', 'left'),
			new ReportColumn('InvoiceItemCustomField2', 'universal_field2', 0.15, 'string', 'left'),
			new ReportColumn('InvoiceItemCustomField3', 'universal_field3', 0.15, 'string', 'left'),
			new ReportColumn('InvoiceItemCustomField4', 'universal_field4', 0.15, 'string', 'left'),
			new ReportColumn('InvoiceItemCustomField5', 'universal_field5', 0.15, 'string', 'left'),
			new ReportColumn('InvoiceItemCustomField6', 'universal_field6', 0.15, 'string', 'left'),
		]);
	}

	public function getTitle() {
		return 'Invoice Export';
	}

	public function getData() {
		$extraParams = $this->getExtraParams();

		$select = new Select();

		$select->from(['i' => 'invoice'])
				->columns([
					'invoice_id',
					'invoice_ref',
					'invoice_datetm',
					'invoice_period',
					'invoice_duedate',
					'invoice_createddatetm',
					'invoice_id' => new Expression('isnull(i.invoice_id,0)'),
					'header_unifield1'	=> 'universal_field1',
					'header_unifield2'	=> 'universal_field2',
					'header_unifield3'	=> 'universal_field3',
					'header_unifield4'	=> 'universal_field4',
					'header_unifield5'	=> 'universal_field5',
					'header_unifield6'	=> 'universal_field6',
					'invoiceitem_id'	=> new Expression("isnull(ii.invoiceitem_id,0)"),
					'invoiceitem_linenum'	=> new Expression("isnull(ii.invoiceitem_linenum,0)"),
					'Account_Number'		=> new Expression("ISNULL(g.glaccount_number,'')"),
					'InvoiceItem_Quantity'	=> new Expression("ISNULL(CONVERT(decimal(18,2),ii.InvoiceItem_Quantity),0)"),
					'InvoiceItem_UnitPrice'	=> new Expression("ISNULL(CONVERT(decimal(18,2),ii.InvoiceItem_UnitPrice),0)"),
					'InvoiceItem_Amount'	=> new Expression("ISNULL(CONVERT(decimal(18,2),ii.InvoiceItem_Amount),0)"),
					'InvoiceItem_SalesTax'	=> new Expression("ISNULL(CONVERT(decimal(18,2),ii.invoiceitem_salestax),0)"),
					'InvoiceItem_shipping'	=> new Expression("ISNULL(CONVERT(decimal(18,2),ii.invoiceitem_shipping),0)"),
					'InvoiceItem_Description'	=> new Expression("ISNULL(ii.InvoiceItem_Description,'')"),
					'jbcontract_name'		=> new Expression("ISNULL(jc.jbcontract_name,'')"),
					'jbjobcode_name'		=> new Expression("ISNULL(jj.jbjobcode_name,'')"),
					'jbcostcode_name'		=> new Expression("ISNULL(jcc.jbcostcode_name,'')")
				])
				->join(['ii' => 'invoiceitem'], 'i.invoice_id = ii.invoice_id', ['universal_field1', 'universal_field2', 'universal_field3', 'universal_field4', 'universal_field5', 'universal_field6'])
				->join(['p' => 'property'], 'ii.property_id = p.property_id', ['property_id_alt'])
				->join(['g' => 'glaccount'], 'ii.glaccount_id = g.glaccount_id', [])
				->join(['vs' => 'vendorsite'], 'vs.vendorsite_id = i.paytablekey_id', [])
				->join(['v' => 'vendor'], 'v.vendor_id = vs.vendor_id', ['vendor_id_alt'])
				->join(['u' => 'unit'], 'p.property_id = u.property_id', ['unit_number'], Select::JOIN_LEFT)
				->join(['ja' => 'jbjobassociation'], "ja.tablekey_id = ii.invoiceitem_id AND ja.table_name = 'invoiceitem'", [], Select::JOIN_LEFT)
				->join(['jj' => 'jbjobcode'], "jj.jbjobcode_id = ja.jbjobcode_id", [], Select::JOIN_LEFT)
				->join(['jc' => 'jbcontract'], "jc.jbcontract_id = ja.jbcontract_id and jbcontract_name <> 'nxsDefault'", [], Select::JOIN_LEFT)
				->join(['jcc' => 'jbcostcode'], "jcc.jbcostcode_id = ja.jbcostcode_id and jbcostcode_name <> 'nxsDefault'", [], Select::JOIN_LEFT)
				->where([
					'i.invoice_status'	=> '?',
					'p.Integration_Package_Id'	=> '?',
					'g.Integration_Package_Id'	=> '?',
					'p.Sync'	=> '?'
				])
				->limit(1000)
				->whereIn('v.vendor_status', "'" . implode("','", ["active", "approved"]) . "'")
				->whereIn('p.property_id', implode(',', json_decode($extraParams['properties'])))
				->order(['p.property_name', 'i.invoice_ref']);

		$adapter = $this->gatewayManager->get('InvoiceGateway')->getAdapter();
		return $adapter->getQueryStmt($select, ['submitted', $extraParams['integration_package_id'], $extraParams['integration_package_id'], 1]);
	}
} 