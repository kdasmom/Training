<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 11/5/13
 * Time: 10:46 AM
 */

namespace NP\system;


use NP\core\AbstractGateway;
use NP\core\db\Select;

class MessageGateway extends AbstractGateway{

	/**
	 * Retrieve message type by name
	 *
	 * @param $name
	 * @return mixed
	 */
	public function findMessageType($name) {
		$select = new Select();

		$select->from(['mt' => 'messagetype'])
				->columns(['messagetype_id'])
				->where(['messagetype_name' => '?']);

		$result = $this->adapter->query($select, [$name]);

		return $result[0]['messagetype_id'];
	}

} 