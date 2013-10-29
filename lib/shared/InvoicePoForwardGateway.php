<?php

namespace NP\shared;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Expression;

/**
 * Gateway for the INVOICEPOFORWARD table
 *
 * @author Thomas Messier
 */
class InvoicePoForwardGateway extends AbstractGateway {

	/**
	 * Returns forward records for an specified entity
	 *
	 * @param  string $table_name  Indicates the entity type we're getting forwards for; can be either 'invoice' or 'purchaseorder'
	 * @param  int    $tablekey_id The ID of the entity we're getting forwards for (invoice_id, for example)
	 * @return array               Array of forward records
	 */
	public function findByEntity($table_name, $tablekey_id) {
		$select = Select::get()->column(new Expression('*'))
								->from(array('ipf'=>'invoicepoforward'))
								->join(new sql\join\InvoicePoForwardFromUserJoin())
								->join(new \NP\user\sql\join\UserUserroleJoin(array(), 'urf', 'uf'))
								->join(new \NP\user\sql\join\UserroleStaffJoin(array(), 'sf', 'urf'))
								->join(new \NP\user\sql\join\StaffPersonJoin(
									array(
										'from_person_firstname' => 'person_firstname',
										'from_person_lastname' => 'person_lastname'
									),
									'pef',
									'sf'
								))
								->join(new sql\join\InvoicePoForwardToUserJoin())
								->join(new \NP\user\sql\join\UserUserroleJoin(array(), 'urt', 'ut'))
								->join(new \NP\user\sql\join\UserroleStaffJoin(array(), 'st', 'urt'))
								->join(new \NP\user\sql\join\StaffPersonJoin(
									array(
										'to_person_firstname' => 'person_firstname',
										'to_person_lastname' => 'person_lastname'
									),
									'pet',
									'st'
								))
								->join(new sql\join\InvoicePoForwardDelegationUserJoin())
								->whereEquals('ipf.table_name', '?')
								->whereEquals('ipf.tablekey_id', '?')
								->order('ipf.forward_datetm');

		return $this->adapter->query($select, array($table_name, $tablekey_id));
	}
}

?>