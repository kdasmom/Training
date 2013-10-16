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

	public function findInvoiceLines($invoice_id) {
		$select = new sql\InvoiceItemSelect();

		$select->allColumns('ii')
				->columnBudgetVariance($this->configService->get('PN.Intl.budgetCompareWithTax', '1'))
				->join(new sql\join\InvoiceItemInvoiceJoin())
				->join(new sql\join\InvoiceItemPoItemJoin())
				->join(new \NP\po\sql\join\PoItemPurchaseorderJoin(['purchaseorder_ref'], Select::JOIN_LEFT))
				->join(new sql\join\InvoiceItemPropertyJoin())
				->join(new sql\join\InvoiceItemGlAccountJoin())
				->join(new sql\join\InvoiceItemUnitJoin())
				->join(new sql\join\InvoiceItemDfSplitJoin())
				->join(new sql\join\InvoiceItemUtilUsageTypeJoin())
				->join(new sql\join\InvoiceItemUtilityAccountJoin())
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
	
}

?>