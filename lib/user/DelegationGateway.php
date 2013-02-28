<?php

namespace NP\user;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the DELEGATION table
 *
 * @author Thomas Messier
 */
class DelegationGateway extends AbstractGateway {
	
	/**
	 * Gets delegation to or from a user
	 *
	 * @param  int $userprofile_id    ID of user in relation to whom you want delegations
	 * @param  int $toOrFrom          Whether you want to get delegations to a user or from a user; valid values are "to" or "from"
	 * @param  int $delegation_status Retrieve only records with a specific delegation_status (optional); default is null, 1 and 0 are other valid values
	 * @return array
	 */
	public function findUserDelegations($userprofile_id, $toOrFrom, $delegation_status=null) {
		if ($toOrFrom != 'to' && $toOrFrom != 'from') {
			throw new \NP\core\Exception("The value of the \$toOrFrom argument, '{$toOrFrom}', is invalid. It must be either 'to' or 'from'.");
		}

		$select = new Select();

		if ($toOrFrom == "from") {
			$joinField = "delegation_to_userprofile_id";
			$whereField = "userprofile_id";
		} else if ($toOrFrom == "to") {
			$joinField = "userprofile_id";
			$whereField = "delegation_to_userprofile_id";
		}

		$select->from(array('d'=>'delegation'))
				->columns(array('delegation_id','delegation_startdate','delegation_stopdate','delegation_status','delegation_to_userprofile_id'))
				->join(array('u'=>'userprofile'),
						"d.{$joinField} = u.userprofile_id",
						array('userprofile_id','userprofile_username'))
				->join(array('ur'=>'userprofilerole'),
						"u.userprofile_id = ur.userprofile_id",
						array('role_id'))
				->join(array('s'=>'staff'),
						"ur.tablekey_id = s.staff_id",
						array())
				->join(array('p'=>'person'),
						"s.person_id = p.person_id",
						array('person_firstname','person_lastname'))
				->order('d.delegation_startdate, p.person_lastname');
		
		$where = "d.{$whereField} = ?";
		if ($delegation_status == 1) {
			$where .= "
				AND d.delegation_status = 1
				AND d.delegation_startdate <= getDate()
				AND d.delegation_stopdate > getDate()
			";
		} else if ($delegation_status == 0) {
			$where .= "
				AND (
					d.delegation_status = 0
					OR d.delegation_startdate > getDate()
					OR d.delegation_stopdate <= getDate()
				)
			";
		}
		
		$select->where($where);

		return $this->adapter->query($select, array($userprofile_id));
	}
	
}

?>