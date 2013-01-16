<?php

namespace NP\invoice;

use NP\core\AbstractGateway;

use Zend\Db\Sql\Select;
use Zend\Db\ResultSet\ResultSet;

abstract class AbstractPOInvoiceGateway extends AbstractGateway {
	
	public function canUserApprove($table_name, $tablekey_id, $userprofile_id) {
		$sql = "
			SELECT count(*) AS total
			FROM approve a 
			WHERE a.table_name = :table_name
				AND a.tablekey_id = :tablekey_id
				AND a.approve_status = 'active'
				AND (
					((a.forwardto_tablekeyid = (SELECT role_id FROM userprofilerole WHERE userprofile_id = :userprofile_id)) AND a.forwardto_tablename = 'role') OR
					((a.forwardto_tablekeyid IN (SELECT userprofilerole_id FROM USERPROFILEROLE WHERE (userprofile_id = :userprofile_id ))) AND (a.forwardto_tablename = 'userprofilerole'))
				)
				AND (
					a.wftarget_id IS NULL OR (SELECT wft.tablekey_id FROM WFRULETARGET wft WHERE wft.wfruletarget_id = a.wftarget_id AND wft.table_name = 'property') IN (
						SELECT p.property_id
						FROM property p
						WHERE EXISTS (
							SELECT 1
							FROM PROPERTYUSERPROFILE pu
							WHERE pu.property_id = p.property_id
								AND pu.userprofile_id = :userprofile_id
						)
					)
				)
		";
		
		$statement = $this->adapter->createStatement($sql, array(
			'table_name'	=> $table_name, 
			'tablekey_id'	=> $tablekey_id, 
			'userprofile_id'=> $userprofile_id
		));
		$resultSet = new ResultSet();
		$resultSet->initialize($statement->execute())->toArray();
		
		if ($resultSet[0]["total"] > 0) {
			return true;
		} else {
			return false;
		}
	}
	
}

?>