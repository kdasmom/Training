<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 3/5/14
 * Time: 12:54 PM
 */

namespace NP\integration;


use NP\core\AbstractService;

class IntegrationService extends AbstractService {

	/**
	 * Retrieve integration settings
	 *
	 * @param null $integration_package_id
	 * @return bool
	 */
	public function getIntegrationSettings($integration_package_id = null) {
		if (!$integration_package_id) {
			return false;
		}

		return $this->integrationGateway->getSettings($integration_package_id);
	}

	public function saveSettings($settings) {
		if (!$settings['integration_package_id']) {
			return false;
		}

		return $this->integrationGateway->saveSettings($settings);
	}
} 