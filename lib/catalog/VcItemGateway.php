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
			          array('unspsc_commodity_familytitle','unspsc_commodity_commoditytitle'),
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
			$select->nest('OR')		
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

}

?>