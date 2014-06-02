<?php

namespace NP\po;

use NP\core\AbstractGateway;
use NP\core\db\Update;
use NP\core\db\Select;
use NP\core\db\Where;
use NP\core\db\Expression;

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

	public function findLines($purchaseorder_id, $combineSplit=false) {
		$params = [$purchaseorder_id];

		// If not combining lines, do "normal" query getting most info for the line item
		if (!$combineSplit) {
			$select = $this->getPoLineSelect();
		}
		// Otherwise, when combining lines, retrieve "simple" list so that group by works properly
		// (must exclude property, GL, etc.)
		else {
			$select = Select::get()
						->columns([
							'poitem_description', 
							'poitem_description_alt', 
							'poitem_unitprice',
							'vcitem_number',
							'vcorder_aux_part_id',
							'vcitem_uom',
							'universal_field1',
							'universal_field2',
							'universal_field3',
							'universal_field4',
							'universal_field5',
							'universal_field6',
							'universal_field7',
							'universal_field8',
							'poitem_amount',
							'poitem_shipping',
							'poitem_salestax',
							'poitem_quantity'
						])
						->from('poitem')
						->whereEquals('purchaseorder_id', '?')
						->whereEquals('poitem_split', 0)
						->union(
							Select::get()
								->columns([
									'poitem_description', 
									'poitem_description_alt', 
									'poitem_unitprice',
									'vcitem_number',
									'vcorder_aux_part_id',
									'vcitem_uom',
									new Expression('pc.universal_field1'),
									new Expression('pc.universal_field2'),
									new Expression('pc.universal_field3'),
									new Expression('pc.universal_field4'),
									new Expression('pc.universal_field5'),
									new Expression('pc.universal_field6'),
									new Expression('pc.universal_field7'),
									new Expression('pc.universal_field8'),
									'poitem_amount' => new Expression('SUM(pi.poitem_amount)'),
									'poitem_shipping' => new Expression('SUM(pi.poitem_shipping)'),
									'poitem_salestax' => new Expression('SUM(pi.poitem_salestax)'),
									'poitem_quantity' => new Expression('SUM(pi.poitem_quantity)')
								])
								->from(['pi'=>'poitem'])
									->join(
										[
											'pc' => Select::get()
													->columns([
														'universal_field1',
														'universal_field2',
														'universal_field3',
														'universal_field4',
														'universal_field5',
														'universal_field6',
														'universal_field7',
														'universal_field8',
														'poitem_linenum'
													])
													->from('poitem')
													->whereEquals('purchaseorder_id', '?')
													->order('poitem_linenum')
													->limit(1)
										],
										null,
										[],
										Select::JOIN_CROSS
									)
								->whereEquals('pi.purchaseorder_id', '?')
								->whereEquals('pi.poitem_split', 1)
								->group('pi.poitem_description, pi.poitem_description_alt, pi.poitem_unitprice, pi.vcitem_number,
										pi.vcorder_aux_part_id, pi.vcitem_uom, pc.universal_field1, pc.universal_field2,
										pc.universal_field3, pc.universal_field4, pc.universal_field5, pc.universal_field6,
										pc.universal_field7, pc.universal_field8')
						);

			array_push($params, $purchaseorder_id, $purchaseorder_id);
		}

		return $this->adapter->query($select, $params);
	}

	private function getPoLineSelect() {
		$select = new sql\PoItemSelect();

		$select->allColumns('pi')
				->columnBudgetVariance($this->configService->get('PN.Intl.budgetCompareWithTax', '1'))
				->join(new sql\join\PoItemPurchaseorderJoin())
				->join(new sql\join\PoItemInvoiceItemJoin(['invoiceitem_id','invoiceitem_amount','invoice_id']))
				->join(new \NP\invoice\sql\join\InvoiceItemInvoiceJoin(['invoice_ref'], Select::JOIN_LEFT))
				->join(new sql\join\PoItemRctItemJoin(['rctitem_status']))
				->join(new sql\join\RctItemReceiptJoin(['receipt_ref','receipt_createdt','receipt_status']))
				->join(new sql\join\ReceiptUserprofileJoin(['receipt_creator'=>'userprofile_username']))
				->join(
					['upc'=>'userprofile'],
					'pi.poitem_cancel_userprofile_id = upc.userprofile_id',
					['cancel_userprofile_username'=>'userprofile_username'],
					Select::JOIN_LEFT
				)
				->join(new sql\join\PoItemPropertyJoin(['property_name','property_id_alt','property_salestax','property_status']))
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

		return $select;
	}

	/**
	 * Used when saving a PO to get lines that don't match the lines that were sent for saving so
	 * they can be deleted
	 */
	public function getDeletedLines($purchaseorder_id, $poitem_id_list) {
		$select = Select::get()
				->column('poitem_id')
				->from('poitem')
				->whereEquals('purchaseorder_id', '?');

		$params = [$purchaseorder_id];

		if (count($poitem_id_list)) {
			$select->whereNotIn('poitem_id', $this->createPlaceholders($poitem_id_list));
			$params = array_merge($params, $poitem_id_list);
		}

		return $this->adapter->query($select, $params);
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
		$res = $this->find(
			['purchaseorder_id' => '?'],
			[$purchaseorder_id],
			null,
			[
				'tax'      => new Expression("SUM(poitem_salestax)"),
				'shipping' => new Expression("SUM(poitem_shipping)")
			]
		);

		return array_pop($res);
	}

	public function findLinkedItems($purchaseorder_id) {
		return $this->adapter->query(
			Select::get()
				->from('poitem')
				->whereEquals('purchaseorder_id', '?')
				->whereEquals('reftable_name', "'invoiceitem'")
				->whereNotEquals('reftablekey_id', 0)
				->whereIsNotNull('reftablekey_id'),
			[$purchaseorder_id]
		);
	}

	public function findUnlinkedItems($purchaseorder_id) {
		return $this->adapter->query(
			Select::get()
				->from('poitem')
				->whereEquals('purchaseorder_id', '?')
				->whereIsNull('reftable_name')
				->whereIsNull('reftablekey_id'),
			[$purchaseorder_id]
		);
	}

	/**
	 * Finds lines on an PO that would be invalid if the property were changed to
	 * the property passed in
	 */
	public function findInvalidLinesForProperty($purchaseorder_id, $property_id) {
		$select = Select::get()
					->column('poitem_id')
					->from(['pi'=>'poitem'])
						->join(new sql\join\PoItemPurchaseorderJoin())
					->whereEquals('pi.purchaseorder_id', '?')
					->whereEquals('pi.property_id', 'p.property_id')
					->whereExists(
						Select::get()->from(['pg'=>'propertyglaccount'])
									->whereEquals('pg.glaccount_id', 'pi.glaccount_id')
									->whereEquals('pg.property_id', '?')
					);

		return $this->adapter->query($select, [$purchaseorder_id, $property_id]);
	}

	public function findPoLinkableLines($purchaseorder_id, $receiptRequired) {
		$select = $this->getPoLineSelect();

		$select->whereIsEmpty('pi.reftable_name');

		if ($receiptRequired == 1) {
			$select->whereEquals('ri.rctitem_status', "'approved'");
		}

		return $this->adapter->query($select, [$purchaseorder_id]);
	}

	public function findUnlinkedLines($purchaseorder_id, $cols=null) {
		$select = $this->getSelect()
					->columns($cols)
					->whereEquals('purchaseorder_id', '?')
					->whereIsEmpty('reftable_name');

		return $this->adapter->query($select, [$purchaseorder_id]);
	}
}

?>