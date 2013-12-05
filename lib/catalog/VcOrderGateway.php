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
use NP\core\db\Update;

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

	/**
	 * Retireve user's orders
	 *
	 * @param $userprofile_id
	 * @return array|bool
	 */
	public function getOrders($userprofile_id) {
		$select1 = new Select();
		$select2 = new Select();

		$select1->from(['vo' => 'vcorder'])
				->columns(['vcorder_id', 'vcorder_qty'])
				->join(['vi' => 'vcitem'], 'vo.vcitem_id = vi.vcitem_id', ['vcitem_id', 'vcitem_number' => 'vcitem_number', 'vcitem_price', 'vcitem_desc', 'vcitem_uom', 'vcitem_manufacturer', 'vcitem_mft_partnumber', 'vcitem_status'], Select::JOIN_INNER)
				->join(['v' => 'vc'], 'vi.vc_id = v.vc_id', ['vc_id', 'vc_catalogname', 'vc_catalogtype', 'vc_vendorname'], Select::JOIN_INNER)
				->join(['un' => 'UNSPSC_Commodity'], 'vi.UNSPSC_Commodity_Commodity = un.UNSPSC_Commodity_Commodity', [], Select::JOIN_LEFT)
				->where(['vo.userprofile_id' => '?']);

		$select2->from(['vo' => 'vcorder'])
			->columns([
				'vcorder_id',
				'vcorder_qty',
				'vcitem_id' 		=> new Expression('?'),
				'vcitem_number'		=> 'vcitem_number',
				'vcitem_price',
				'vcitem_desc',
				'vcitem_uom',
				'vcitem_manufacturer',
				'vcitem_mft_partnumber',
				'vcitem_status'		=> new Expression('?')
			])
			->join(['v' => 'vc'], 'vo.vc_id = v.vc_id', ['vc_id', 'vc_catalogname', 'vc_catalogtype', 'vc_vendorname'], Select::JOIN_INNER)
			->join(['un' => 'UNSPSC_Commodity'], 'vo.UNSPSC_Commodity_Commodity = un.UNSPSC_Commodity_Commodity', [], Select::JOIN_LEFT)
			->where(['vo.userprofile_id' => '?']);

		$sql = $select1->toString() . ' union all ' . $select2->toString() . ' order by v.vc_vendorname asc, vcitem_number asc';

		return $this->adapter->query($sql, [$userprofile_id, 0, 1, $userprofile_id]);
	}

	/**
	 * Update order items quantity
	 *
	 * @param $vcorder_id
	 * @param $userprofile_id
	 * @param $quantity
	 * @return array|bool
	 */
	public function updateQuantity($vcorder_id, $userprofile_id, $quantity) {
		$update = new Update();
		$update->table('vcorder')
			->values(['vcorder_qty' => '?'])
			->where(['vcorder_id' => '?', 'userprofile_id' => '?']);

		return $this->adapter->query($update, [$quantity, $vcorder_id, $userprofile_id]);
	}
} 