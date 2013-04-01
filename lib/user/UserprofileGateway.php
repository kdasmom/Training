<?php

namespace NP\user;

use NP\core\AbstractGateway;

/**
 * Gateway for the USERPROFILE table
 *
 * @author Thomas Messier
 */
class UserprofileGateway extends AbstractGateway {
	
	/**
	 * @param  string $username 
	 * @param  string $pwd      
	 * @return int    If authentication succeeds, returns the userprofile_id of the user, otherwise returns 0
	 */
	public function authenticate($username, $pwd) {
		$select = new sql\UserprofileSelect();
		$select->columns(array("userprofile_id"))
				->where("
					userprofile_username = ?
					AND PWDCOMPARE(?, userprofile_password) = 1
					AND userprofile_status = 'active'
					AND (userprofile_startdate IS NULL OR DATEDIFF(day, userprofile_startdate, getdate()) >= 0 )
					AND (userprofile_enddate IS NULL OR DATEDIFF(day, userprofile_enddate, getdate()) <= 0 )
				");
		
		$resultSet = $this->adapter->query($select, array($username, $pwd));
		
		if (count($resultSet)) {
			return $resultSet[0]["userprofile_id"];
		} else {
			return 0;
		}
	}

	/**
	 * @param  int   $userprofile_id The ID of the user you want details for
	 * @return array                 An array with data for the specified user, including userprofile, role, person, address, and email
	 */
	public function findUserDetails($userprofile_id) {
		$select = new sql\UserprofileSelect();
		$cols = array(
			'userprofile_id',
			'userprofile_username',
			'userprofile_preferred_property',
			'userprofile_default_dashboard',
			'userprofile_splitscreen_size',
			'userprofile_splitscreen_ishorizontal',
			'userprofile_splitscreen_imageorder',
			'userprofile_splitscreen_loadwithoutimage',
			'userprofile_preferred_region'
		);
		for ($i=1;$i<=6;$i++) {
			$cols[] = "security_question{$i}";
			$cols[] = "security_answer{$i}";
		}
		
		$select->columns($cols)
				->joinUserprofilerole(array('userprofilerole_id'))
				->joinRole(array('role_id','role_name','is_admin_role'))
				->joinStaff(array())
				->joinPerson(array('person_firstname','person_middlename','person_lastname'))
				->joinEmail(array('email_address'))
				->joinAddress(array('address_line1','address_line2','address_city','address_state','address_zip','address_zipext'))
				->joinPhone('Home', array('home_phone_number'=>'phone_number'))
				->joinPhone('Work', array('work_phone_number'=>'phone_number'))
				->where('u.userprofile_id = ?');

		return array_pop($this->adapter->query($select, array($userprofile_id)));
	}
	
}