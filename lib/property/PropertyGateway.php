<?php

namespace NP\property;

use NP\core\AbstractGateway;
use NP\core\SqlSelect;

class PropertyGateway  extends AbstractGateway {
	
	/*
	public function getForInvoiceItemComboBox($userprofile_id, $delegation_to_userprofile_id, $property_keyword) {
		$property_type = "all";
		$property_status = 1;
		$property_keyword &= "%";
		
		$sql = getBasePropertySQL(
			argumentCollection=arguments,
			returnFields="p.*"
		);
		
		sql &= "
				AND (
					property_name LIKE :property_keyword
					OR property_id_alt LIKE :property_keyword
				)
			ORDER BY p.property_name
		";
		
		return runQuery(sql, arguments);
	}
	
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
			$statusSQL = " AND p.property_status IN ( :property_status )";
		}
		
		// For multiple and single property, just use the property list passed
		if (listFindNoCase('multiple,single', $property_type)) {
			$sql = "SELECT :property_id_list";
		// For region and all property types, use a similar query, but region_id filters down more
		} else if (listFindNoCase('all,region', $property_type)) {
			// First, define the fiscal calendar joins since they repeat for both region and all
			$fiscalJoins = "
				INNER JOIN fiscalcal f ON p.property_id = f.property_id
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
						INNER JOIN PROPERTYUSERPROFILE pu On p.property_id = pu.property_id
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
						INNER JOIN property p ON dp.property_id = p.property_id
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
				sql &= "AND p.region_id IN ( :region_id_list )";
			}
		}
		
		return sql;
	}
	*/
	
}

?>