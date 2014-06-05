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
		if ($filterItem == 'upc') {
			$select->whereLike('un.vcitem_upc', "'%" . $keyword . "%'");
			$select2->whereLike('un.vcitem_upc', "'%" . $keyword . "%'");
		}

		$sql = $select->toString() . ' union all ' . $select2->toString();

		return $this->adapter->query($sql, $params);
	}

	/**
	 * Retrieve order vendors
	 *
	 * @param $vc_id
	 * @param $property_id
	 * @return array|bool
	 */
	public function getOrderVendors($vc_id, $property_id) {
		$select = new Select();

		$subSelect = new Select();

		$subSelect->from(['l' => 'link_vc_vendor'])
			->whereEquals('l.vendor_id', 'v.vendor_id')
			->whereEquals('l.vc_id', '?');

		$select->from(['v' => 'vendor'])
			->distinct()
			->columns(['vendor_id_alt', 'vendor_name', 'vendor_id'])
			->join(['vs' => 'vendorsite'], 'v.vendor_id = vs.vendor_id', ['vendorsite_id'])
			->join(['a' => 'address'], 'a.tablekey_id = vs.vendorsite_id', ['address_city', 'address_zip'], Select::JOIN_LEFT)
			->whereEquals('v.vendor_status', "'active'")
			->whereEquals('vs.vendorsite_status', "'active'")
			->whereEquals('a.table_name', "'vendorsite'")
			->whereEquals('v.integration_package_id', Select::get()->column('integration_package_id')
				->from(['p' => 'property'])
				->where(['property_id' => '?']))
			->whereExists($subSelect)
			->order('vendor_name asc');

		return $this->adapter->query($select, [$property_id, $vc_id]);
	}

	/**
	 * Finds the catalog that needs to be used when electronically submitting a PO
	 */
	public function findCatalogForPoSubmit($vendor_id, $property_id) {
		$res = $this->adapter->query(
			Select::get()
				->column('vc_id')
				->from('vc')
					->join(new sql\join\VcLinkVcVendorJoin())
					->join(new sql\join\VcLinkVcPropertyJoin())
				->whereEquals('lvv.vendor_id', '?')
				->whereEquals('lvp.property_id', '?')
				->whereIsNotEmpty('vc.vc_posubmit_url')
				->limit(1),
			[$vendor_id, $property_id]
		);

		if (count($res)) {
			$res[0]['vc_id'];
		} else {
			return null;
		}
	}
}

?>