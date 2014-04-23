<?php

namespace NP\po;

use NP\core\AbstractGateway;
use NP\core\db\Update;
use NP\core\db\Select;
use NP\core\db\Where;

/**
 * Gateway for the POITEM table
 *
 * @author Thomas Messier
 */
class PoItemGateway extends AbstractGateway {

	protected $configService;

	public function setConfigService(\NP\system\ConfigService $configService) {
		$this->configService = $configService;
	}

	public function findLines($purchaseorder_id) {
		$select = new sql\PoItemSelect();

		$select->allColumns('pi')
				->columnBudgetVariance($this->configService->get('PN.Intl.budgetCompareWithTax', '1'))
				->join(new sql\join\PoItemPurchaseorderJoin())
				->join(new sql\join\PoItemInvoiceItemJoin(['invoiceitem_id','invoiceitem_amount','invoice_id']))
				->join(new \NP\invoice\sql\join\InvoiceItemInvoiceJoin(['invoice_ref'], Select::JOIN_LEFT))
				->join(new sql\join\PoItemPropertyJoin())
				->join(new sql\join\PoItemGlAccountJoin())
				->join(new sql\join\PoItemUnitJoin())
				->join(new sql\join\PoItemDfSplitJoin())
				->join(new sql\join\PoItemJobAssociationJoin())
				->join(new \NP\jobcosting\sql\join\JobAssociationJbContractJoin())
				->join(new \NP\jobcosting\sql\join\JobAssociationJbChangeOrderJoin())
				->join(new \NP\jobcosting\sql\join\JobAssociationJbJobCodeJoin())
				->join(new \NP\jobcosting\sql\join\JobAssociationJbPhaseCodeJoin())
				->join(new \NP\jobcosting\sql\join\JobAssociationJbCostCodeJoin())
				->join(new \NP\jobcosting\sql\join\JbContractJbContractBudgetJoin(
					$this->configService->get('PN.jobcosting.useJobBudgets', '0')
				))
				->join(new \NP\shared\sql\join\EntityLineGlAccountYearJoin('poitem'))
				->join(new \NP\shared\sql\join\EntityLineBudgetJoin('poitem'))
				->whereEquals('pi.purchaseorder_id', '?')
				->order('pi.poitem_linenum ASC');

		return $this->adapter->query($select, array($purchaseorder_id));
	}
	
	public function rollPeriod($property_id, $newAccountingPeriod, $oldAccountingPeriod) {
		$update = new Update();
		$subSelect = new Select();
		
		$newAccountingPeriod = \NP\util\Util::formatDateForDB($newAccountingPeriod);
		$oldAccountingPeriod = \NP\util\Util::formatDateForDB($oldAccountingPeriod);

		$update->table('poitem')
				->values(array('poitem_period'=>'?'))
				->whereEquals('poitem_period', '?')
				->whereEquals('property_id', '?')
				->whereIn(
					'purchaseorder_id',
					$subSelect->column('purchaseorder_id')
								->from('purchaseorder')
								->whereNotEquals('purchaseorder_status', '?')
				);
		$params = array($newAccountingPeriod, $oldAccountingPeriod, $property_id, 'closed');

		$this->adapter->query($update, $params);
	}

	public function unlinkFromInvoice($invoice_id) {
		$this->update(
			['reftable_name' => null, 'reftablekey_id' => null],
			Where::get()
				->equals('reftable_name', '?')
				->in(
					'reftablekey_id',
					Select::get()->column('invoiceitem_id')
								->from('invoiceitem')
								->whereEquals('invoice_id', '?')
				),
			['invoiceitem', $invoice_id]
		);
	}

	/**
	 * Returns information relevant to the PO item link to an invoice item
	 * (returns poitem info and invoiceitem info for linked items)
	 *
	 * @param  int $poitem_id
	 */
	public function findLinkByItem($poitem_id, $invoiceitem_id=null) {
		$select = Select::get()
			->columns(['poitem_id', 'purchaseorder_id', 'property_id'])
			->from(['pi'=>'poitem'])
			->join(new sql\join\PoItemInvoiceItemJoin(['invoiceitem_id','invoice_id'], Select::JOIN_INNER))
			->whereEquals('pi.poitem_id', '?');

		$params = [$poitem_id];

		if ($invoiceitem_id !== null) {
			$select->whereEquals('ii.invoiceitem_id', '?');
			$params[] = $invoiceitem_id;
		}

		$res = $this->adapter->query($select, $params);
		
		return $res;
	}

	/**
	 * 
	 */
	public function findItemTotal($purchaseorder_id, $taxItemsOnly=false) {
		$conditions = ['purchaseorder_id' => '?'];
		if ($taxItemsOnly) {
			$conditions['poitem_taxflag'] = "'Y'";
		}

		return $this->findValue(
			$conditions,
			[$purchaseorder_id],
			['total' => new Expression("SUM(poitem_amount)")]
		);
	}

	public function findTaxAndShippingTotal($purchaseorder_id) {
		return $this->find(
			['purchaseorder_id' => '?'],
			[$purchaseorder_id],
			null,
			[
				'tax'      => new Expression("SUM(poitem_salestax)"),
				'shipping' => new Expression("SUM(poitem_shipping)")
			]
		);
	}
}

?>