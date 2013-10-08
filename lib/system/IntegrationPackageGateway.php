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
}

?>