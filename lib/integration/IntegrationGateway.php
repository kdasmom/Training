<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 3/5/14
 * Time: 12:55 PM
 */

namespace NP\integration;


use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Update;

class IntegrationGateway extends AbstractGateway {

	/**
	 * Retrieve integration settings list by integration package id
	 *
	 * @param $integration_package_id
	 * @return array|bool
	 */
	public function getSettings($integration_package_id) {
		$select = new Select();

		$select->from(['i' => 'integrationrequirements'])
			->where(
				[
					'integration_package_id'	=> '?'
				]
			);

		$result = $this->adapter->query($select, [$integration_package_id]);

		return $result[0];
	}

	/**
	 * Save settings
	 *
	 * @param $data
	 * @return array|bool
	 */
	public function saveSettings($data) {
		$integrationid = $data['integration_package_id'];
		unset($data['integration_package_id']);
		foreach ($data as &$value) {
			if (empty($value)) {
				$value = "null";
			}
		}

		$update = new Update();

		$update->table('integrationrequirements')
			->values($data)
			->where([
				'integration_package_id'	=> '?'
			]);

		return $this->adapter->query($update, [$integrationid]);
	}
} 