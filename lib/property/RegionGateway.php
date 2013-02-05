<?php

namespace NP\property;

use NP\core\AbstractGateway;
use NP\core\SqlSelect;

class RegionGateway  extends AbstractGateway {
	
	public function findByUser($userprofile_id, $delegation_to_userprofile_id) {
		$select = new SqlSelect();
		$select->from(array('r'=>'region'))
				->order("r.region_name");

		if ($userprofile_id == $delegation_to_userprofile_id) {
			$select->where("
				region_id IN (
					SELECT
						p.region_id
					FROM property p
						INNER JOIN propertyuserprofile pu ON p.property_id = pu.property_id
					WHERE p.region_id = r.region_id
						AND pu.userprofile_id = ?
				)
			");
			$params = array($userprofile_id, $delegation_to_userprofile_id);
		} else {
			$select->where('EXISTS (
							SELECT p.property_id
							FROM delegation d
								INNER JOIN delegationprop dp ON d.delegation_id = dp.delegation_id
								INNER JOIN PROPERTY p ON dp.property_id = p.property_id
							WHERE d.userprofile_id = ?
								AND d.delegation_to_userprofile_id = ?
								AND p.region_id = r.region_id
								AND d.delegation_status = 1
								AND d.delegation_startdate <= getDate()
								AND d.delegation_stopdate > getDate()
						)
					');
			$params = array($userprofile_id, $delegation_to_userprofile_id);
		}

		return $this->executeSelectWithParams($select, $params);
	}
	
}

?>