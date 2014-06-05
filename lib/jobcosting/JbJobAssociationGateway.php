<?php

namespace NP\jobcosting;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Expression;

/**
 * Gateway for the JBJOBASSOCIATION table
 *
 * @author Thomas Messier
 */
class JbJobAssociationGateway extends AbstractGateway {
	
	/**
	 * 
	 */
	public function findContractLinesByEntity($table_name, $entity_id) {
		if ($table_name == 'invoice') {
			$entityJoinClass  = "NP\invoice\sql\join\InvoiceItemInvoiceJoin";
			$itemJobJoinClass = "NP\invoice\sql\join\InvoiceItemJobAssociationJoin";
			$itemTable        = 'invoiceitem';
			$pk               = 'i.invoice_id';
		} else if ($table_name == 'purchaseorder') {
			$entityJoinClass  = "NP\po\sql\join\PoItemPurchaseorderJoin";
			$itemJobJoinClass = "NP\po\sql\join\PoItemJobAssociationJoin";
			$itemTable        = 'poitem';
			$pk               = 'p.purchaseorder_id';
		}

		$select = Select::get()
					->distinct()
					->columns([])
					->from([substr($pk, 0, 1) . 'i'=>$itemTable])
						->join(new $entityJoinClass([]))
						->join(new $itemJobJoinClass(null, Select::JOIN_INNER))
						->join(new sql\join\JobAssociationJbContractBudgetJoin())
					->whereEquals($pk, '?');

		return $this->adapter->query($select, [$entity_id]);
	}

	/**
	 * 
	 */
	public function findContractActualByFilter($jbcontract_id, $jbchangeorder_id, $jbjobcode_id, $jbphasecode_id, $jbcostcode_id) {
		$select = Select::get()
					->column(
						new Expression('SUM(ISNULL(ii.invoiceitem_salestax, 0) + ISNULL(ii.invoiceitem_shipping, 0) + ISNULL(ii.invoiceitem_amount, 0))'),
						'invoice_actual'
					)
					->from(['ii'=>'invoiceitem'])
						->join(new \NP\invoice\sql\join\InvoiceItemInvoiceJoin([]))
						->join(new \NP\invoice\sql\join\InvoiceItemJobAssociationJoin([], Select::JOIN_INNER))
						->join(new sql\join\JobAssociationJbContractBudgetJoin())
					->whereNotIn('i.invoice_status', "'paid', 'posted','rejected','draft','void'")
					->group('
						jbctb.jbcontractbudget_id,
						jbctb.jbcontractbudget_amt,
						jbctb.jbcontractbudget_amt_actual,
						jbctb.jbcontractbudget_amt_pnactual
					');

		$params = [];

		if (empty($jbcontract_id)) {
			$select->whereNest()
						->whereEquals('jb.jbcontract_id', 0)
						->whereIsNull('jb.jbcontract_id')
					->whereUnnest();
		} else {
			$select->whereEquals('jb.jbcontract_id', '?');
			$params[] = $jbcontract_id;
		}

		if (empty($jbchangeorder_id)) {
			$select->whereNest('OR')
						->whereEquals('jb.jbchangeorder_id', 0)
						->whereIsNull('jb.jbchangeorder_id')
					->whereUnnest();
		} else {
			$select->whereEquals('jb.jbchangeorder_id', '?');
			$params[] = $jbchangeorder_id;
		}

		$select->whereEquals('jb.jbjobcode_id', '?');
		$params[] = $jbjobcode_id;

		if (empty($jbphasecode_id)) {
			$select->whereNest('OR')
						->whereEquals('jb.jbphasecode_id', 0)
						->whereIsNull('jb.jbphasecode_id')
					->whereUnnest();
		} else {
			$select->whereEquals('jb.jbphasecode_id', '?');
			$params[] = $jbphasecode_id;
		}

		if (empty($jbcostcode_id)) {
			$select->whereNest('OR')
						->whereEquals('jb.jbcostcode_id', 0)
						->whereIsNull('jb.jbcostcode_id')
					->whereUnnest();
		} else {
			$select->whereEquals('jb.jbcostcode_id', '?');
			$params[] = $jbcostcode_id;
		}

		$res = $this->adapter->query($select, $params);

		if (count($res)) {
			return $res[0];
		}

		return null;
	}
}

?>