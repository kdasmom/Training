<?php

namespace NP\contact;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the PHONE table
 *
 * @author Thomas Messier
 */
class PhoneGateway extends AbstractGateway {
	const PHONE_TYPE_FAX = 5;
	const PHONE_TYPE_MAIN = 6;

	/**
	 * Delete from table rows depended by table_name and tablekey_id
	 *
	 * @param $table_name
	 * @param $tablekey_id
	 * @return array|bool
	 */
	public function deleteByTablenameAndKey($table_name, $tablekey_id) {
		$delete = new Delete();
		$delete->from('phone')
			->where(['table_name' => '?'])
			->whereIn(['tablekey_id'], Select::get()->column('contact_id')
				->from(['c' => 'contact'])
				->where(['c.table_name' => '?', 'c.tablekey_id' => '?']));
		$result = $this->adapter->query($delete, ['contact', $table_name, $tablekey_id]);

		return $result;
	}
}

?>