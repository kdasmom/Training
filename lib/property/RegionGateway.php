<?php

namespace NP\property;

use NP\core\AbstractGateway;
use NP\core\SqlSelect;

class RegionGateway  extends AbstractGateway {
	
	public function findByUser($userprofile_id) {
		$select = new SqlSelect();
		$select->from(array('r'=>'region'))
				->where("
					region_id IN (
						SELECT
							p.region_id
						FROM property p
							INNER JOIN propertyuserprofile pu ON p.property_id = pu.property_id
						WHERE p.region_id = r.region_id
							AND pu.userprofile_id = ?
					)
				")
				->order("r.region_name");

		return $this->executeSelectWithParams($select, array($userprofile_id));
	}
	
}

?>