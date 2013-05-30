<?php

namespace NP\po;

use NP\core\AbstractGateway;
use NP\core\db\Update;
use NP\core\db\Select;

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
}

?>