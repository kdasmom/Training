<?php

namespace NP\system;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the INTEGRATIONPACKAGE table
 *
 * @author Thomas Messier
 */
class IntegrationPackageGateway extends AbstractGateway {
	protected $pk = 'integration_package_id';

	public function getSelect() {
		return Select::get()->from(['ipk'=>'integrationpackage'])
							->join(new sql\join\IntPkgIntReqJoin());
	}

	/**
	 * Retrieve integration package record by userprofile and aspclient_id
	 *
	 * @param $aspclient_id
	 * @param $userprofile_id
	 * @return mixed
	 */
	public function findByAspClientIdAndUserprofileId($aspclient_id, $userprofile_id) {
		$select = new Select();

		$select->from(['i' => 'integrationpackage'])
					->join(['p' => 'property'], 'i.integration_package_id = p.integration_package_id', [])
					->join(['pu' => 'propertyuserprofile'], 'p.property_id = pu.property_id')
					->where(['i.asp_client_id' =>'?', 'pu.userprofile_id' => '?'])
					->distinct();

		$result = $this->adapter->query($select, [$aspclient_id, $userprofile_id]);

		return $result[0];
	}

	/**
	 * Retrieve integration packages for user by propertyuserprofile
	 *
	 * @param $userprofile_id
	 * @param $asp_client_id
	 * @return array|bool
	 * @throws \NP\core\Exception
	 */
	public function getIntegrationPackagesForTheInvoiceExport($userprofile_id, $asp_client_id) {
		$select = new Select();

		$select->from(['p' => 'property'])
				->columns([])
				->join(['pp' => 'propertyuserprofile'], 'p.property_id = pp.property_id', [], Select::JOIN_INNER)
				->join(['i' => 'integrationpackage'], 'p.integration_package_id = i.integration_package_id', ['integration_package_name', 'integration_package_id'], Select::JOIN_INNER)
				->where([
					'i.asp_client_id'	=> '?',
					'i.Integration_Package_ManualTransfer'	=> '?',
					'pp.userprofile_id'		=> '?'
				]);

		return $this->adapter->query($select, [$asp_client_id, 1, $userprofile_id]);
	}
}
