<?php

namespace NP\user;

use NP\core\AbstractGateway;

use Zend\Db\Sql\Select;

class UserprofileGateway extends AbstractGateway {
	
	public $table = 'userprofile';
	
	public function authenticate($username, $pwd) {
		$select = new Select();
		$select->from("userprofile")
				->columns(array("userprofile_id"))
				->where("
					userprofile_username = ?
					AND PWDCOMPARE(?, userprofile_password) = 1
					AND userprofile_status = 'active'
					AND (userprofile_startdate IS NULL OR DATEDIFF(day, userprofile_startdate, getdate()) >= 0 )
					AND (userprofile_enddate IS NULL OR DATEDIFF(day, userprofile_enddate, getdate()) <= 0 )
				");
		
		$resultSet = $this->executeSelectWithParams($select, array($username, $pwd));
		
		if (count($resultSet)) {
			return $resultSet[0]["userprofile_id"];
		} else {
			return 0;
		}
	}
	
}