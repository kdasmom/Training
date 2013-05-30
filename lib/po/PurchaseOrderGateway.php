<?php

namespace NP\po;

use NP\core\AbstractGateway;
use NP\core\db\Update;

/**
 * Gateway for the PURCHASEORDER table
 *
 * @author Thomas Messier
 */
class PurchaseOrderGateway extends AbstractGateway {

	public function rollPeriod($property_id, $newAccountingPeriod, $oldAccountingPeriod) {
		$update = new Update();

		$newAccountingPeriod = \NP\util\Util::formatDateForDB($newAccountingPeriod);
		$oldAccountingPeriod = \NP\util\Util::formatDateForDB($oldAccountingPeriod);

		$update->table('purchaseorder')
				->values(array('purchaseorder_period'=>'?'))
				->whereEquals('purchaseorder_period', '?')
				->whereEquals('property_id', '?')
				->whereNotEquals('purchaseorder_status', '?');

		$params = array($newAccountingPeriod, $oldAccountingPeriod, $property_id, 'closed');

		$this->adapter->query($update, $params);
	}
}

?>