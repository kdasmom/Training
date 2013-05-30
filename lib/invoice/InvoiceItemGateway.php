<?php

namespace NP\invoice;

use NP\core\AbstractGateway;
use NP\core\db\Update;
use NP\core\db\Select;

/**
 * Gateway for the INVOICEITEM table
 *
 * @author Thomas Messier
 */
class InvoiceItemGateway extends AbstractGateway {
	
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