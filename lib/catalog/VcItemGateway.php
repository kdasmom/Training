<?php

namespace NP\catalog;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the VCITEM table
 *
 * @author Thomas Messier
 */
class VcItemGateway extends AbstractGateway {

	public function findCatalogItems($vc_id, $filter_type=null, $category=null, $pageSize=null, $page=1, $sort='vcitem_category_name') {
		$select = new Select();
		$select->from(array('vi'=>'vcitem'))
			   ->join(array('uc'=>'unspsc_commodity'),
			          'uc.unspsc_commodity_commodity = vi.unspsc_commodity_commodity',
			          array('UNSPSC_Commodity_FamilyTitle','UNSPSC_Commodity_CommodityTitle'),
			          Select::JOIN_LEFT)
			   ->where(array(
			   		'vc_id'=>'?'
			   	))
			   ->order($sort);

		$params = array($vc_id);
		
		if (in_array($filter_type, ['active','inactive','category'])) {
			$select->whereEquals('vi.vcitem_status', '?');
			$params[] = ($filter_type == 'inactive') ? 0 : 1;
		}
		if ($filter_type == 'category') {
			$select->whereNest('OR')		
					->whereEquals('vi.vcitem_category_name', '?');
			if (is_int($category)) {
				$select->whereEquals('vi.UNSPSC_Commodity_Commodity', '?');
			}
			$params[] = $category;
		}

		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, $params, $pageSize, $page);
		} else {
			return $this->adapter->query($select, $params);
		}
	}

	public function getCategories($vc_id) {
		$select = '
			SELECT
				DISTINCT 
				CASE
					WHEN un.UNSPSC_Commodity_Commodity IS NULL THEN vi.vcitem_category_name
					ELSE CAST(un.UNSPSC_Commodity_Family AS varchar)
				END AS category_id,
				CASE
					WHEN un.UNSPSC_Commodity_Commodity IS NULL THEN vi.vcitem_category_name
					ELSE un.UNSPSC_Commodity_FamilyTitle
				END AS category_name
			FROM VCITEM vi
				LEFT JOIN UNSPSC_Commodity un ON un.UNSPSC_Commodity_Commodity = vi.UNSPSC_Commodity_Commodity
			WHERE vi.vc_id = ?
			ORDER BY 
				CASE
					WHEN un.UNSPSC_Commodity_Commodity IS NULL THEN vi.vcitem_category_name
					ELSE un.UNSPSC_Commodity_FamilyTitle
				END
		';

		return $this->adapter->query($select, array($vc_id));
	}

	/**
	 * Retrieve categories list
	 *
	 * @param $userprofile_id
	 * @return array|bool
	 */
	public function findCatalogCategories($userprofile_id) {
		$select = new Select();
		$subSelect = new Select;

		$subSelect->from(['lp' => 'link_vc_property'])
				->join(['pu' => 'propertyuserprofile'], 'lp.property_id = pu.property_id', null)
				->whereEquals('lp.vc_id', 'v.vc_id')
				->where(['pu.userprofile_id' => '?']);

		$select->from(['l' => 'link_vc_vccat'])
				->join(['c' => 'vccat'], 'l.vccat_id = c.vccat_id', ['vccat_id', 'vccat_name'])
				->join(['v' => 'vc'], 'l.vc_id = v.vc_id', ['vc_id', 'vc_vendorname', 'vc_catalogname'])
				->where(['vc.status' => '?'])
				->whereNest('OR')
				->whereIn('vc_catalogtype', ['pdf', 'url'])
				->whereExists($subSelect)
				->whereUnNest()
				->order(['c.vccat_name', 'v.vc_vendorname']);

		return $this->adapter->query($select, [1, $userprofile_id]);
	}

	/**
	 * Find items by the catalog_id
	 *
	 * @param $userprofile_id
	 * @param $vc_id
	 * @param $filterItem
	 * @param $keyword
	 * @param null $pageSize
	 * @param int $page
	 * @param $order
	 * @return array|bool
	 */
	public function searchItems($userprofile_id, $vc_id, $filterItem, $keyword, $pageSize = null, $page = 1, $order) {
		$select = new Select();

		$select->from(['vi' => 'vcitem'])
				->join(['vf' => 'vcfav'], 'vi.vcitem_id = vf.vcitem_id', ['vcfav_id'], Select::JOIN_LEFT)
				->join(['un' => 'UNSPSC_Commodity'], 'vi.UNSPSC_Commodity_Commodity = un.UNSPSC_Commodity_Commodity', null, Select::JOIN_LEFT)
				->where(['vi.vc_id' => '?'])
				->where(['vi.vcitem_status' => '?']);

		if ($filterItem == 'category') {
			$select->whereNest('OR')
					->whereLike('un.UNSPSC_Commodity_FamilyTitle', "'%" . $keyword . "%'")
					->whereLike('vi.vcitem_category_name', "'%" . $keyword . "%'")
					->whereUnNest();
		}
		if ($filterItem == 'itemType') {
			$select->whereNest('OR')
				->whereLike('un.UNSPSC_Commodity_CommodityTitle', "'%" . $keyword . "%'")
				->whereLike('vi.vcitem_type', "'%" . $keyword . "%'")
				->whereUnNest();
		}
		if ($filterItem == 'vcitem_number') {
			$select->whereLike('un.vcitem_number', "'" . $keyword . "%'");
		}
		if ($filterItem == 'vcitem_desc') {
			$select->whereLike('un.vcitem_desc', "'%" . $keyword . "%'");
		}
		if ($filterItem == 'brand') {
			$select->whereLike('un.vcitem_manufacturer', "'%" . $keyword . "%'");
		}
		if ($filterItem == 'upc') {
			$select->whereLike('un.vcitem_upc', "'%" . $keyword . "%'");
		}

		return $this->adapter->query($select, [$userprofile_id, 1]);
	}
}

?>