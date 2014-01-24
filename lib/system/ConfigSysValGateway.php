<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 1/17/14
 * Time: 5:10 PM
 */

namespace NP\system;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Update;

class ConfigSysValGateway extends AbstractGateway {

	public function updateCustomField($value, $name) {
		$update = new Update();
		$subSelect = new Select();

		$subSelect->from(['c' => 'configsys'])
			->column('configsys_id')
			->where(['configsys_name' => '?']);

		$update->table('configsysval')
			->values(['configsysval_val' => '?'])
			->whereEquals('configsys_id', $subSelect);

		return $this->adapter->query($update, [$value, $name]);
	}

	public function updateUniversalFieldLength($length, $number) {

		$update = new Update();

		$update->table('integrationrequirements')
			->values(['custom_field' . $number . '_maxlength' => $length]);

		return $this->adapter->query($update);
	}

	public function updateUniversalFieldType($type, $number) {
		$update = new Update();
		$select = new Select();

		$select->from(['c' => 'configsys'])
			->column('configsys_id')
			->where(['configsys_name' => '?']);

		$update->table('configsysval')
			->values(['configsysval_val' => '?'])
			->whereEquals('configsys_id', $select);

		return $this->adapter->query($update, [$type, 'CP.CUSTOM_FIELD' . $number . '_TYPE']);
	}
}