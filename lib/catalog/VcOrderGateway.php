<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 12/2/13
 * Time: 11:16 AM
 */

namespace NP\catalog;


use NP\core\AbstractGateway;
use NP\core\db\Expression;
use NP\core\db\Select;

class VcOrderGateway extends AbstractGateway {
	public function getOrderSummary($userprofile_id) {
		$select = new Select();

		$select->from(['o' => 'vcorder'])
				->columns([
					'totalItems'	=> new Expression('isnull(sum(o.vcorder_qty), 0)'),
					'totalPrice'	=> new Expression('isnull(sum(o.vcorder_qty*vi.vcitem_price), 0) + isnull(sum(o.vcorder_qty*o.vcitem_price), 0)')
				])
				->join(['vi' => 'vcitem'], 'o.vcitem_id = vi.vcitem_id', [], Select::JOIN_LEFT)
				->whereEquals('o.userprofile_id', '?')
				->whereNest('OR')
				->whereIsNotNull('o.vcitem_price')
				->whereEquals('vi.vcitem_status', '?')
				->whereUnNest();

		return $this->adapter->query($select, [$userprofile_id, 1]);
	}
} 