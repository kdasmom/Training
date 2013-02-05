<?php

namespace NP\property;

use NP\core\AbstractGateway;
use NP\core\SqlSelect;

class PropertyGateway  extends AbstractGateway {
	
	public function findByUser($userprofile_id, $delegation_to_userprofile_id) {
		$select = new SqlSelect();
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

		return $this->executeSelectWithParams($select, $params);
	}
	
	public function findForInvoiceItemComboBox($userprofile_id, $delegation_to_userprofile_id, $property_keyword) {
		$select = new SqlSelect();
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
		
		return $this->executeSelectWithParams($select, array($userprofile_id,$property_keyword,$property_keyword));
	}
	
	public function getPropertyFilterSubSelect($userprofile_id, $delegation_to_userprofile_id, $propertyFilterType, $propertyFilterSelection) {
		if ($propertyFilterType == 'property') {
			$sql = ' = ?';
			$params = array($propertyFilterSelection);
		} else if ($propertyFilterType == 'region') {
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
				$params = array($propertyFilterSelection, $userprofile_id);
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
				$params = array($userprofile_id, $delegation_to_userprofile_id, $propertyFilterSelection);
			}
		} else if ($propertyFilterType == 'all') {
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

	/*
	public function getBasePropertySQL($property_type,	// Can be 'all', 'region', 'multiple', 'single'
										$property_status,	// Can be 1 (active), 0 (inactive), or -1 (on hold) (or a list with those)
										$userprofile_id,
										$delegation_to_userprofile_id,
										$property_id_list,
										$returnFields="p.property_id") {
		
		// Figure out the property_status SQL first, since it's the same everywhere
		if (listFindNoCase($property_status, "1") 
				&& listFindNoCase($property_status, "0") 
				&& listFindNoCase($property_status, "-1")) {
			$statusSQL = "";
		} else {
			$statusSQL = " AND __prop.property_status IN ( :property_status )";
		}
		
		// For multiple and single property, just use the property list passed
		if (listFindNoCase('multiple,single', $property_type)) {
			$sql = "SELECT :property_id_list";
		// For region and all property types, use a similar query, but region_id filters down more
		} else if (listFindNoCase('all,region', $property_type)) {
			// First, define the fiscal calendar joins since they repeat for both region and all
			$fiscalJoins = "
				INNER JOIN fiscalcal f ON __prop.property_id = f.property_id
				INNER JOIN fiscalcalmonth fm ON f.fiscalcal_id = fm.fiscalcal_id
			";
			
			$today = Now();
			today = dateFormat(today, "m/d/yyyy") & " " & timeFormat(today, "H:mm:ss");
			
			// If dealing with user in his own account, get his properties
			if ($userprofile_id EQ $delegation_to_userprofile_id) {
				$sql = "
					SELECT
						#$returnFields#
					FROM property p
						INNER JOIN PROPERTYUSERPROFILE pu On __prop.property_id = pu.property_id
						#fiscalJoins#
					WHERE pu.userprofile_id = :userprofile_id
						#statusSQL#
				";
			// If dealing with a delegated user, get only delegated properties and coding only properties
			} else {
				$sql = "
					SELECT
						#$returnFields#
					FROM delegation d
						INNER JOIN delegationprop dp ON d.delegation_id = dp.delegation_id
						INNER JOIN property p ON dp.property_id = __prop.property_id
						#fiscalJoins#
					WHERE d.userprofile_id = :userprofile_id
						AND d.delegation_to_userprofile_id = :delegation_to_userprofile_id
						AND d.delegation_status = 1
						AND d.delegation_startdate <= '#today#'
						AND d.delegation_stopdate > '#today#'
						AND EXISTS (
							SELECT *
							FROM PROPERTYUSERPROFILE pu
							WHERE pu.property_id = dp.property_id
								AND pu.userprofile_id = d.userprofile_id
						)
						#statusSQL#
				";
			}
			
			// Add the fiscal calendar filtering
			sql &= "
				AND fm.fiscalcalmonth_num = #month(today)#
				AND f.fiscalcal_year = #year(today)#
			";
			
			// If dealing with regions, add the region_id filter to the query
			if ($property_type == 'region') {
				sql &= "AND __prop.region_id IN ( :region_id_list )";
			}
		}
		
		return sql;
	}
	*/
	
}

?>