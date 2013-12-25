<?php

namespace NP\catalog;

use NP\core\AbstractGateway;
use NP\core\db\Expression;
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
	public function searchItems($userprofile_id, $vc_id, $filterItem, $keyword, $property, $pageSize = null, $page = 1, $order = 'vcitem_number') {
		$select = new Select();

		$select->from(['vi' => 'vcitem'])
				->join(['vf' => 'vcfav'], 'vi.vcitem_id = vf.vcitem_id and vf.userprofile_id = ?', ['vcfav_id'], Select::JOIN_LEFT)
				->join(['un' => 'UNSPSC_Commodity'], 'vi.UNSPSC_Commodity_Commodity = un.UNSPSC_Commodity_Commodity', [], Select::JOIN_LEFT)
				->join(['vo' => 'vcorder'], 'vo.vcitem_id = vi.vcitem_id and vo.userprofile_id = ?', ['vcorder_id'], Select::JOIN_LEFT)
				->where(['vi.vcitem_status' => '?']);

		$params = [$userprofile_id, $userprofile_id, 1];

		if ($property) {
			$select->join(['lp' => 'link_vc_property'], 'lp.vc_id = vi.vc_id', [])
					->whereEquals('lp.property_id', '?');
			$params[] = $property;
		}

		if (!empty($vc_id) && $vc_id !== 'null') {
			$select->whereIn('vi.vc_id', '?');
			$params[] = !is_array($vc_id) ? $vc_id : implode(',', $vc_id);
		}

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
			$select->whereLike('vi.vcitem_number', "'" . $keyword . "%'");
		}
		if ($filterItem == 'vcitem_desc') {
			$select->whereLike('vi.vcitem_desc', "'%" . $keyword . "%'");
		}
		if ($filterItem == 'brand') {
			$select->whereLike('vi.vcitem_manufacturer', "'%" . $keyword . "%'");
		}
		if ($filterItem == 'upc') {
			$select->whereLike('vi.vcitem_upc', "'%" . $keyword . "%'");
		}

		if ($filterItem == 'any') {
			$select->whereNest('OR')
				->whereLike('un.UNSPSC_Commodity_FamilyTitle', "'%" . $keyword . "%'")
				->whereLike('vi.vcitem_category_name', "'%" . $keyword . "%'")
				->whereLike('un.UNSPSC_Commodity_CommodityTitle', "'%" . $keyword . "%'")
				->whereLike('vi.vcitem_type', "'%" . $keyword . "%'")
				->whereLike('vi.vcitem_number', "'" . $keyword . "%'")
				->whereLike('vi.vcitem_desc', "'%" . $keyword . "%'")
				->whereLike('vi.vcitem_manufacturer', "'%" . $keyword . "%'")
				->whereLike('vi.vcitem_upc', "'%" . $keyword . "%'")
				->whereUnNest();
		}
		$select->order($order);

		return $this->getPagingArray($select, $params, $pageSize, $page);
	}

	/**
	 * Retrieve order items
	 *
	 * @param $userprofile_id
	 * @param $vc_id
	 * @param $property_id
	 * @param $vcorder_id
	 * @param $usePropGL
	 * @param $catalogType
	 * @return array|bool
	 */
	public function getOrderItems($userprofile_id, $vc_id, $property_id, $vcorder_id, $usePropGL, $catalogType) {
		$select = new Select();

		$subselect = new Select();
		$params = [];

		$subselect->from(['l' => 'link_vcitemcat_gl'])
				->limit(1)
				->column('glaccount_id');
		if ($usePropGL) {
			$subselect->join(['pg' => 'propertyglaccount'], 'l.glaccount_id = pg.glaccount_id', [])
						->whereEquals('property_id', '?');

			$params[] = $property_id;
		}
		if ($catalogType == 'excel') {
			$subselect->whereEquals('vi.vc_id', 'l.vc_id');
		} else {
			$subselect->whereEquals('vo.vc_id', 'l.vc_id');
		}


		if ($catalogType == 'excel') {
			$select->from(['vo' => 'vcorder'])
					->columns([
						'vcorder_id',
						'vcorder_qty',
						'vcorder_aux_part_id',
						Select::get()->column($subselect, 'glaccount_id')
					])
					->join(['vi' => 'vcitem'], 'vo.vcitem_id = vi.vcitem_id', null)
					->where(
						[
							'userprofile_id'	=> '?',
							'vi.vc_id'			=> '?',
							'vi.vcitem_status'	=> '?',
							'vi.vcitem_status'	=> '?'
						]
					)
					->whereIn('vo.vcorder_id', $vcorder_id);
			$params = array_merge($params, [$userprofile_id, $vc_id, 1, 1]);
		} else {
			$select->from(['vo' => 'vcorder'])
					->allColumns('vo')
					->column(Select::get()->column($subselect, 'glaccount_id'))
					->where([
						'userprofile_id'	=> '?',
						'vo.vc_id'			=> '?'
					])
					->whereIn('vo.vcorder_id', $vcorder_id);
			$params = array_merge($params, [$userprofile_id, $vc_id]);
		}

		return $this->adapter->query($select, $params);
	}

	/**
	 * Retrieve vcitem details
	 *
	 * @param $item_id
	 * @param $userprofile_id
	 * @return array|bool
	 */
	public function getItemDetails($item_id, $userprofile_id) {
		$select = new Select();
		$subSelect = new Select();

		$subSelect->from(['vf' => 'vcfav'])
					->count()
					->whereEquals('vi.vcitem_id', 'vf.vcitem_id')
					->whereEquals('vf.userprofile_id', '?');

		$select->from(['vi' => 'vcitem'])
				->columns([
					'vcitem_id', 'vc_id', 'vcitem_status', 'UNSPSC_Commodity_Commodity', 'vcitem_category_name', 'vcitem_type', 'vcitem_number', 'vcitem_price', 'vcitem_desc',
					'vcitem_uom', 'vcitem_pkg_qty', 'vcitem_case_qty', 'vcitem_desc_ext', 'vcitem_min_qty', 'vcitem_manufacturer', 'vcitem_color', 'vcitem_upc',
					'vcitem_mft_partnumber', 'vcitem_imageurl', 'vcitem_infourl', 'universal_field1', 'universal_field2', 'universal_field3', 'universal_field4', 'universal_field5',
					'universal_field6', 'vcitem_weight',
					'favCount' => $subSelect])
				->where(['vi.vcitem_id' => '?']);

		return $this->adapter->query($select, [$userprofile_id, $item_id]);
	}

	/**
	 * Return favorite items
	 *
	 * @param $userprofile_id
	 * @param $order
	 * @param $pageSize
	 * @param $page
	 * @return array|bool
	 */
	public function getFavorites($userprofile_id, $order, $pageSize, $page) {
		$select = new Select();

		$select->from(['vf' => 'vcfav'])
			->columns(['vcfav_id'])
			->join(['vi' => 'vcitem'], 'vf.vcitem_id = vi.vcitem_id', null)
			->join(['vo' => 'vcorder'], 'vo.vcitem_id = vi.vcitem_id and vo.userprofile_id = vf.userprofile_id', ['vcorder_id'], Select::JOIN_LEFT)
			->where(['vf.userprofile_id' => '?'])
			->order($order)
			->offset($pageSize * ($page - 1))
			->limit($pageSize);

		return $this->adapter->query($select, [$userprofile_id]);
	}

	/**
	 * Return categories with items count
	 *
	 * @param $vc_id
	 * @return array|bool
	 */
	public function getCategoriesWithItemsCount($vc_id) {
		$select1 = new Select();
		$select2 = new Select();

		$select1->from(['vi' => 'vcitem'])
				->columns(['total_items' => new Expression('count(*)')])
				->join(['un' => 'unspsc_commodity'], 'vi.unspsc_commodity_commodity = un.unspsc_commodity_commodity', ['category' => 'UNSPSC_Commodity_FamilyTitle', 'commodityid' => 'UNSPSC_Commodity_Commodity'], Select::JOIN_LEFT)
				->where(
					[
						'vi.vc_id' => '?',
						'vi.vcitem_status' => '?'
					]
				)
				->whereIsNotNull('vi.UNSPSC_Commodity_Commodity')
				->group('un.UNSPSC_Commodity_FamilyTitle, un.UNSPSC_Commodity_Commodity');

		$select2->from(['vi' => 'vcitem'])
				->distinct()
				->columns(['total_items' => new Expression('count(*)'), 'category' => 'vcitem_category_name'])
				->join(['un' => 'unspsc_commodity'], 'vi.unspsc_commodity_commodity = un.unspsc_commodity_commodity', ['commodityid' => 'UNSPSC_Commodity_Commodity'], Select::JOIN_LEFT)
				->where(
					[
						'vi.vc_id' => '?',
						'vi.vcitem_status' => '?'
					]
				)
				->whereIsNull('vi.UNSPSC_Commodity_Commodity')
				->whereIsNotNull('vi.vcitem_category_name')
				->whereNotEquals('vi.vcitem_category_name', '?')
				->group('vi.vcitem_category_name, un.UNSPSC_Commodity_Commodity');

		$sql = $select1->toString() . ' union all ' . $select2->toString() . ' order by category asc';

		return $this->adapter->query($sql, [$vc_id, 1, $vc_id, 1, '']);
	}

	/**
	 * return barnds with items count
	 *
	 * @param $vc_id
	 * @return array|bool
	 */
	public function getBrandsWithItemsCount($vc_id) {
		$select = new Select();

		$select->from(['vi' => 'vcitem'])
				->columns(['total_items' => new Expression('count(*)'), 'vcitem_manufacturer'])
				->where([
					'vc_id' => '?',
					'vcitem_status' => '?'
				])
				->group('vcitem_manufacturer')
				->order('vcitem_manufacturer');

		return $this->adapter->query($select, [$vc_id, 1]);
	}

	/**
	 * Return brands with start letter
	 *
	 * @return array|bool
	 */
	public function getBrands() {
		$select = new Select();

		$select->from(['vi' => 'vcitem'])
				->columns([
					'letter' => new Expression("case
							when upper(left(vi.vcitem_manufacturer, 1)) in ('0','1','2','3','4','5','6','7','8','9') then '0-9'
							else upper(left(vi.vcitem_manufacturer, 1))
						end"),
					'vcitem_manufacturer',
					'vc_id'])
				->where(['vcitem_status' => '?'])
				->whereExists('SELECT *
					FROM vc
						INNER JOIN link_vc_vccat l ON l.vc_id = vc.vc_id
					WHERE vc.vc_id = vi.vc_id')
				->whereNotEquals('vcitem_manufacturer', '?')
				->group('vcitem_manufacturer, vc_id')
				->order('vcitem_manufacturer');

		return $this->adapter->query($select, [1, '']);
	}

	public function getItemsByTypesAndPrices($userprofile_id, $vc_id, $filterItem, $keyword, $types, $prices, $order) {
		$select = new Select();

		$select->from(['vi' => 'vcitem'])
			->join(['vf' => 'vcfav'], 'vi.vcitem_id = vf.vcitem_id and vf.userprofile_id = ?', ['vcfav_id'], Select::JOIN_LEFT)
			->join(['un' => 'UNSPSC_Commodity'], 'vi.UNSPSC_Commodity_Commodity = un.UNSPSC_Commodity_Commodity', [], Select::JOIN_LEFT)
			->join(['vo' => 'vcorder'], 'vo.vcitem_id = vi.vcitem_id and vo.userprofile_id = ?', ['vcorder_id'], Select::JOIN_LEFT)
			->where(['vi.vcitem_status' => '?']);

		$params = [$userprofile_id, $userprofile_id, 1];

		$select->whereIn('vi.vc_id', '?');
		$params[] = !is_array($vc_id) ? $vc_id : implode(',', $vc_id);

		if ($filterItem == 'category' && !$types) {
			$select->whereNest('OR')
				->whereLike('un.UNSPSC_Commodity_FamilyTitle', "'%" . $keyword . "%'")
				->whereLike('vi.vcitem_category_name', "'%" . $keyword . "%'")
				->whereUnNest();
		}

		if ($filterItem == 'brand' && !$types) {
			$select->whereLike('vi.vcitem_manufacturer', "'%" . $keyword . "%'");
		}

		if ($prices) {
			$prices = $prices == 1 ? 0 : $prices;

			if ($prices != 100) {
				$select->whereBetween('vi.vcitem_price', '?', '?');

				$params[] = $prices;
				$params[] = $prices + 25;
			} else {
				$select->whereGreaterThan('vi.vcitem_price', '?');
				$params[] = $prices;
			}
		}

		if ($types) {
			$select->whereIn('vi.vcitem_type', '?');
			$params[] = !is_array($types) ? $types : implode(',', $types);
		}

		$select->order($order);

		return $this->adapter->query($select, $params);
	}

	public function getTypesForItemsFromCategoryOrBrands($userprofile_id, $vc_id, $field, $value) {
		$select = new Select();

		$select->from(['vi' => 'vcitem'])
			->columns(['vcitem_type'])
			->join(['un' => 'UNSPSC_Commodity'], 'vi.UNSPSC_Commodity_Commodity = un.UNSPSC_Commodity_Commodity', [], Select::JOIN_LEFT)
			->where(['vi.vcitem_status' => '?'])
			->group('vcitem_type')
			->order('vcitem_type');

		$params = [1];

		$select->whereIn('vi.vc_id', '?');
		$params[] = !is_array($vc_id) ? $vc_id : implode(',', $vc_id);

		if ($field == 'category') {
			$select->whereNest('OR')
				->whereLike('un.UNSPSC_Commodity_FamilyTitle', "'%" . $value . "%'")
				->whereLike('vi.vcitem_category_name', "'%" . $value . "%'")
				->whereUnNest();
		}

		if ($field == 'brand') {
			$select->whereLike('vi.vcitem_manufacturer', "'%" . $value . "%'");
		}

		return $this->adapter->query($select, $params);
	}

}

?>