<?php

namespace NP\property;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the PROPERTY table
 *
 * @author Thomas Messier
 */
class PropertyGateway  extends AbstractGateway {
	
	/**
	 * Find properties for a given user
	 *
	 * @param  int    $userprofile_id              The active user ID, can be a delegated account
	 * @param  int    $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @return array                               Array of property records
	 */
	public function findByUser($userprofile_id, $delegation_to_userprofile_id) {
		$select = new Select();
		$select->from(array('p'=>'property'))
				->order("p.property_name");
		if ($userprofile_id == $delegation_to_userprofile_id) {
			$select->join(array('pu'=>'propertyuserprofile'),
							"p.property_id = pu.property_id",
							array())
					->where("
						pu.userprofile_id = ?
						AND p.property_status <> 0
					");
			$params = array($userprofile_id);
		} else {
			$select->join(array('dp'=>'delegationprop'),
							"p.property_id = dp.property_id",
							array())
					->join(array('d'=>'delegation'),
							"dp.delegation_id = d.delegation_id",
							array())
					->where('
						d.userprofile_id = ?
						AND d.delegation_to_userprofile_id = ?
						AND d.delegation_status = 1
						AND d.delegation_startdate <= getDate()
						AND d.delegation_stopdate > getDate()
					');
			$params = array($userprofile_id, $delegation_to_userprofile_id);
		}

		return $this->adapter->query($select, $params);
	}
	
	/**
	 * @param  int    $userprofile_id              The active user ID, can be a delegated account
	 * @param  int    $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @param  string $property_keyword            A keyword
	 * @return array                               Array of property records
	 */
	public function findForInvoiceItemComboBox($userprofile_id, $delegation_to_userprofile_id, $property_keyword) {
		$select = new Select();
		$select->from(array('p'=>'property'))
				->where('
					EXISTS (
						SELECT *
						FROM propertyuserprofile pu
						WHERE pu.property_id = p.property_id
							AND pu.userprofile_id = ?
					)
					AND (
						property_name LIKE ?
						OR property_id_alt LIKE ?
					)
				')
				->order('p.property_name');
		
		$property_keyword = $property_keyword . '%';
		
		return $this->adapter->query($select, array($userprofile_id,$property_keyword,$property_keyword));
	}
	
	/**
	 * Returns a string of SQL for filtering something by property ID given a certain context
	 *
	 * @param  int    $userprofile_id              The active user ID, can be a delegated account
	 * @param  int    $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @param  string $contextFilterType           The context filter type; valid values are 'property','region', and 'all'
	 * @param  int    $contextFilterSelection      The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
	 * @return string                              String of SQL, including the = or IN operator
	 */
	public function getPropertyFilterSubSelect($userprofile_id, $delegation_to_userprofile_id, $contextFilterType, $contextFilterSelection) {
		if ($contextFilterType == 'property') {
			if (!is_numeric($contextFilterSelection)) {
				throw new \NP\core\Exception('Invalid arguments for getPropertyFilterSubSelect(); when \$contextFilterType is "property", \$contextFilterSelection should be an integer representing a property ID');
			}
			$sql = ' = ?';
			$params = array($contextFilterSelection);
		} else if ($contextFilterType == 'region') {
			if (!is_int($contextFilterSelection)) {
				throw new \NP\core\Exception('Invalid arguments for getPropertyFilterSubSelect(); when \$contextFilterType is "region", \$contextFilterSelection should be an integer representing a region ID');
			}
			if ($userprofile_id == $delegation_to_userprofile_id) {
				$sql = '
					IN (
						SELECT 
							__prop.property_id 
						FROM property __prop
						WHERE __prop.region_id = ?
							AND EXISTS (
								SELECT *
								FROM propertyuserprofile __propuser
								WHERE __propuser.property_id = __prop.property_id
									AND __propuser.userprofile_id = ?
							)
					)
				';
				$params = array($contextFilterSelection, $userprofile_id);
			} else {
				$sql = '
					IN (
						SELECT __delegProp.property_id
						FROM delegation __deleg
							INNER JOIN delegationprop __delegProp ON __deleg.delegation_id = __delegProp.delegation_id
							INNER JOIN property __prop ON __delegProp.property_id = __prop.property_id
						WHERE __deleg.userprofile_id = ?
							AND __deleg.delegation_to_userprofile_id = ?
							AND __deleg.delegation_status = 1
							AND __deleg.delegation_startdate <= getDate()
							AND __deleg.delegation_stopdate > getDate()
							AND __prop.region_id = ?
							AND EXISTS (
								SELECT *
								FROM PROPERTYUSERPROFILE pu
								WHERE pu.property_id = __delegProp.property_id
									AND pu.userprofile_id = __deleg.userprofile_id
							)
					)
				';
				$params = array($userprofile_id, $delegation_to_userprofile_id, $contextFilterSelection);
			}
		} else if ($contextFilterType == 'all') {
			if ($userprofile_id == $delegation_to_userprofile_id) {
				$sql = '
					IN (
						SELECT 
							__prop.property_id 
						FROM property __prop
						WHERE EXISTS (
							SELECT *
							FROM propertyuserprofile __propuser
							WHERE __propuser.property_id = __prop.property_id
								AND __propuser.userprofile_id = ?
						)
					)
				';
				$params = array($userprofile_id);
			} else {
				$sql = '
					IN (
						SELECT __delegProp.property_id
						FROM delegation __deleg
							INNER JOIN delegationprop __delegProp ON __deleg.delegation_id = __delegProp.delegation_id
						WHERE __deleg.userprofile_id = ?
							AND __deleg.delegation_to_userprofile_id = ?
							AND __deleg.delegation_status = 1
							AND __deleg.delegation_startdate <= getDate()
							AND __deleg.delegation_stopdate > getDate()
							AND EXISTS (
								SELECT *
								FROM PROPERTYUSERPROFILE pu
								WHERE pu.property_id = __delegProp.property_id
									AND pu.userprofile_id = __deleg.userprofile_id
							)
					)
				';
				$params = array($userprofile_id, $delegation_to_userprofile_id);
			}
		}

		return array('sql'=>$sql, 'params'=>$params);
	}
	
}

?>