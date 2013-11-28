<?php

namespace NP\catalog;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the VC table
 *
 * @author Thomas Messier
 */
class VcGateway extends AbstractGateway {

	public function findRegister($vc_status=null, $pageSize=null, $page=1, $sort='vc_vendorname') {
		$select = new sql\VcSelect();

		$select->columns(array('vc_id','vc_vendorname','vc_catalogname','vc_catalogtype','vc_createdby','vc_createdt','vc_lastupdateby','vc_lastupdatedt','vc_status'))
				->columnNumberOfItems()
				->joinCreator(array('creator_userprofile_username'=>'userprofile_username'))
				->joinUpdater(array('updater_userprofile_username'=>'userprofile_username'))
				->order($sort);

		$params = array();
		if ($vc_status !== null) {
			$status_list = explode(',', $vc_status);

			// If more than one status was specified, use IN operator
			if (count($status_list) > 1) {
				$placeHolders = implode(',', array_fill(0, count($status_list), '?'));
				$select->where("v.vc_status IN ({$placeHolders})");
				$params = $status_list;
			} else {
				$select->where('v.vc_status = ?');
				$params = array($vc_status);
			}
		}
		
		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, $params, $pageSize, $page);
		} else {
			return $this->adapter->query($select, $params);
		}
	}

	/**
	 * Retrieve catalog list
	 *
	 * @param $catalog_type
	 * @return array|bool
	 */
	public function getCatalogs($catalog_type) {
		$select = new Select();

		$where = [];
		$params = [];

		if ($catalog_type) {
			$where['vc_catalogtype'] = '?';
			$params[] = $catalog_type;
		}
		$select->from('vc')
				->where($where)
				->order(['vc_catalogname']);

		return $this->adapter->query($select, $params);
	}

	/**
	 * Retrieve catalog list from the search action
	 *
	 * @param $userprofile_id
	 * @param $filterItem
	 * @param $propertyId
	 * @param $keyword
	 * @param $page
	 * @param $pagesize
	 * @return array|bool
	 */
	public function findCatalogsByFilter($userprofile_id, $filterItem, $propertyId, $keyword, $page = 1, $pagesize = null) {
		$select = new Select();
		$select2 = new Select();
		$subQuery = new Select();

		$where = [
			'pup.userprofile_id' => '?'
		];
		$params = [$userprofile_id];
		if ($propertyId) {
			$where['lvp.property_id'] = '?';
			$params = [$propertyId, $propertyId];
		}

		$subQuery->from(['lvp' => 'LINK_VC_PROPERTY'])
			->join(['pup' => 'PROPERTYUSERPROFILE'], 'pup.property_id = lvp.property_id', [])
			->where($where)
			->whereEquals('lvp.vc_id', 'v.vc_id');

		$select->from(['vi' => 'vcitem'])
			->join(['v' => 'vc'], 'vi.vc_id = v.vc_id', ['vc_id', 'vc_catalogname', 'vc_vendorname'])
			->join(['un' => 'UNSPSC_Commodity'], 'vi.UNSPSC_Commodity_Commodity = un.UNSPSC_Commodity_Commodity', null)
			->columns(null)
			->distinct()
			->where(['v.vc_status' => '?'])
			->where(['vi.vcitem_status' => '?'])
			->whereIsNotNull('vi.UNSPSC_Commodity_Commodity')
			->whereExists($subQuery);
		$select2->from(['vi' => 'vcitem'])
			->join(['v' => 'vc'], 'vi.vc_id = v.vc_id', ['vc_id', 'vc_catalogname', 'vc_vendorname'])
			->columns(null)
			->distinct()
			->where(['v.vc_status' => '?'])
			->where(['vi.vcitem_status' => '?'])
			->whereIsNull('vi.UNSPSC_Commodity_Commodity')
			->whereExists($subQuery);

		if ($filterItem == 'category') {
			$select->whereLike('un.UNSPSC_Commodity_FamilyTitle', "'%" . $keyword . "%'");
			$select2->whereLike('un.UNSPSC_Commodity_FamilyTitle', "'%" . $keyword . "%'");
		}
		if ($filterItem == 'itemType') {
			$select->whereLike('un.UNSPSC_Commodity_CommodityTitle', "'%" . $keyword . "%'");
			$select2->whereLike('un.UNSPSC_Commodity_CommodityTitle', "'%" . $keyword . "%'");
		}
		if ($filterItem == 'vcitem_number') {
			$select->whereLike('un.vcitem_number', "'" . $keyword . "%'");
			$select2->whereLike('un.vcitem_number', "'" . $keyword . "%'");
		}
		if ($filterItem == 'vcitem_desc') {
			$select->whereLike('un.vcitem_desc', "'%" . $keyword . "%'");
			$select2->whereLike('un.vcitem_desc', "'%" . $keyword . "%'");
		}
		if ($filterItem == 'brand') {
			$select->whereLike('un.vcitem_manufacturer', "'%" . $keyword . "%'");
			$select2->whereLike('un.vcitem_manufacturer', "'%" . $keyword . "%'");
		}

		$sql = $select->toString() . ' union all ' . $select2->toString();

		return $this->adapter->query($sql, $params);
	}
}

?>