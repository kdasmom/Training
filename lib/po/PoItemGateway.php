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