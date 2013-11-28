<?php

namespace NP\catalog;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the VCCAT table
 *
 * @author 
 */
class VcCatGateway extends AbstractGateway {

	public function getCatalogCategories($userprofile_id) {
		$select = new Select();

		$subQuery = new Select();
		$subQuery->from(['lp' => 'link_vc_property'])
				->join(['pu' => 'propertyuserprofile'], 'lp.property_id = pu.property_id', null)
				->whereEquals('lp.vc_id', 'v.vc_id')
				->where(['pu.userprofile_id' => '?']);

		$select->from(['l' => 'link_vc_vccat'])
				->columns(null)
				->join(['c' => 'vccat'], 'l.vccat_id = c.vccat_id', ['vccat_id', 'vccat_name'])
				->join(['v' => 'vc'], 'l.vc_id = v.vc_id', ['vc_id', 'vc_vendorname', 'vc_catalogname'])
				->where(['v.vc_status' => '?'])
				->whereNest('OR')
				->whereIn('v.vc_catalogtype', "'" . implode("','", ['pdf','url']) . "'")
				->whereExists($subQuery);

		return $this->adapter->query($select, [1, $userprofile_id]);
	}

}

?>