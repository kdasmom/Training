<?php

namespace NP\invoice;

use NP\core\AbstractGateway;
use NP\core\db\Update;
use NP\core\db\Select;
use NP\core\db\Expression;

/**
 * Gateway for the INVOICEITEM table
 *
 * @author Thomas Messier
 */
class InvoiceItemGateway extends AbstractGateway {
	protected $tableAlias = 'ii';
	
	protected $configService;

	public function setConfigService(\NP\system\ConfigService $configService) {
		$this->configService = $configService;
	}

	public function findLines($invoice_id) {
		$select = new sql\InvoiceItemSelect();

		$select->allColumns('ii')
				->columnBudgetVariance($this->configService->get('PN.Intl.budgetCompareWithTax', '1'))
				->join(new sql\join\InvoiceItemInvoiceJoin())
				->join(new sql\join\InvoiceItemPoItemJoin(['poitem_id','poitem_amount','purchaseorder_id']))
				->join(new \NP\po\sql\join\PoItemPurchaseorderJoin(['purchaseorder_ref'], Select::JOIN_LEFT))
				->join(new sql\join\InvoiceItemPropertyJoin())
				->join(new sql\join\InvoiceItemGlAccountJoin())
				->join(new sql\join\InvoiceItemUnitJoin())
				->join(new sql\join\InvoiceItemDfSplitJoin())
				->join(new sql\join\InvoiceItemUtilUsageTypeJoin())
				->join(new sql\join\InvoiceItemUtilityAccountJoin())
				->join(new \NP\vendor\sql\join\UtilityAccountUtilityJoin(['UtilityType_Id'], Select::JOIN_LEFT))
				->join(new \NP\vendor\sql\join\UtilityUtilityTypeJoin(['UtilityType','universal_field_status'], Select::JOIN_LEFT))
				->join(new sql\join\InvoiceItemUnitTypeMaterialJoin())
				->join(new sql\join\InvoiceItemJobAssociationJoin())
				->join(new \NP\jobcosting\sql\join\JobAssociationJbContractJoin())
				->join(new \NP\jobcosting\sql\join\JobAssociationJbChangeOrderJoin())
				->join(new \NP\jobcosting\sql\join\JobAssociationJbJobCodeJoin())
				->join(new \NP\jobcosting\sql\join\JobAssociationJbPhaseCodeJoin())
				->join(new \NP\jobcosting\sql\join\JobAssociationJbCostCodeJoin())
				->join(new \NP\jobcosting\sql\join\JbContractJbContractBudgetJoin(
					$this->configService->get('PN.jobcosting.useJobBudgets', '0')
				))
				->join(new \NP\shared\sql\join\EntityLineGlAccountYearJoin('invoiceitem'))
				->join(new \NP\shared\sql\join\EntityLineBudgetJoin('invoiceitem'))
				->whereEquals('ii.invoice_id', '?')
				->order('ii.invoiceitem_linenum ASC');

		return $this->adapter->query($select, array($invoice_id));
	}

	/**
	 * Used when saving an invoice to get lines that don't match the lines that were sent for saving so
	 * they can be deleted
	 */
	public function getDeletedLines($invoice_id, $invoiceitem_id_list) {
		$select = Select::get()
				->column('invoiceitem_id')
				->from('invoiceitem')
				->whereEquals('invoice_id', '?');

		$params = [$invoice_id];

		if (count($invoiceitem_id_list)) {
			$select->whereNotIn('invoiceitem_id', $this->createPlaceholders($invoiceitem_id_list));
			$params = array_merge($params, $invoiceitem_id_list);
		}

		return $this->adapter->query($select, $params);
	}
	
	public function rollPeriod($property_id, $newAccountingPeriod, $oldAccountingPeriod) {
		$update = new Update();
		$subSelect = new Select();
		
		$newAccountingPeriod = \NP\util\Util::formatDateForDB($newAccountingPeriod);
		$oldAccountingPeriod = \NP\util\Util::formatDateForDB($oldAccountingPeriod);

		$update->table('invoiceitem')
				->values(array('invoiceitem_period'=>'?'))
				->whereEquals('invoiceitem_period', '?')
				->whereEquals('property_id', '?')
				->whereIn(
					'invoice_id',
					$subSelect->column('invoice_id')
								->from('invoice')
								->whereNotIn('invoice_status', '?,?,?,?,?')
				);
		$params = array($newAccountingPeriod, $oldAccountingPeriod, $property_id, 'posted', 'paid','sent','submitted', 'void');
		
		$this->adapter->query($update, $params);
	}

	/**
	 * Returns information relevant to the invoice item link to a PO item 
	 * (returns invoiceitem info and poitem info for linked items)
	 *
	 * @param  int $invoiceitem_id
	 * @return array
	 */
	public function findLinkByItem($invoiceitem_id) {
		$select = Select::get()
			->columns(['invoiceitem_id','invoice_id', 'property_id'])
			->from(['ii'=>'invoiceitem'])
			->join(new sql\join\InvoiceItemPoItemJoin(['poitem_id','purchaseorder_id'], Select::JOIN_INNER))
			->whereEquals('ii.invoiceitem_id', '?');

		$res = $this->adapter->query($select, [$invoiceitem_id]);

		return $res;
	}

	/**
	 * 
	 */
	public function findItemTotal($invoice_id, $taxItemsOnly=false) {
		$conditions = ['invoice_id' => '?'];
		if ($taxItemsOnly) {
			$conditions['invoiceitem_taxflag'] = "'Y'";
		}

		return $this->findValue(
			$conditions,
			[$invoice_id],
			['total' => new Expression("SUM(invoiceitem_amount)")]
		);
	}

	public function findTaxAndShippingTotal($invoice_id) {
		$res = $this->find(
			['invoice_id' => '?'],
			[$invoice_id],
			null,
			[
				'tax'      => new Expression("SUM(invoiceitem_salestax)"),
				'shipping' => new Expression("SUM(invoiceitem_shipping)")
			]
		);

		return array_pop($res);
	}

	/**
	 * Returns all invoice lines for an invoice that have either an inactive job contract
	 * or inactive job code
	 *
	 * @param  int $invoice_id
	 * @return array
	 */
	public function findLinesWithInactiveJobCodes($invoice_id) {
		$select = Select::get()
					->from(['ii'=>'invoiceitem'])
						->join(new sql\join\InvoiceItemJobAssociationJoin([]))
						->join(new \NP\jobcosting\sql\join\JobAssociationJbContractJoin())
						->join(new \NP\jobcosting\sql\join\JobAssociationJbJobCodeJoin())
					->whereEquals('ii.invoice_id', '?')
					->whereNest('OR')
						->whereEquals('jbct.jbcontract_status', "'inactive'")
						->whereEquals('jbjc.jbjobcode_status', "'inactive'")
					->whereUnnest();

		return $this->adapter->query($select, [$invoice_id]);
	}
}

?>