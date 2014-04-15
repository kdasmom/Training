<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 14.04.2014
 * Time: 8:53
 */

namespace NP\report\user;


use NP\core\db\Where;
use NP\report\AbstractReport;
use NP\report\ReportColumn;
use NP\report\ReportInterface;

class GroupRightsComparison extends AbstractReport implements ReportInterface {
	public function init() {
		$this->addCols([
			new ReportColumn('Responsibilities', 'person_name', 0.15)
		]);

		$extraParams = $this->getExtraParams();

		if (isset($extraParams['compared_groups']) && count($extraParams['compared_groups']) > 0) {
			$roles = $this->gatewayManager->get('RoleGateway')->find(
				Where::get()->in('role_id', implode(',', $extraParams['compared_groups']))
							->equals('asp_client_id', '?'),
				[$this->configService->getClientId()], ['role_name'], ['role_name', 'role_id']);
			foreach ($roles as $role) {
				$this->addCols([
					new ReportColumn($role['role_name'], 'role_' . $role['role_id'] , 0.08)
				]);
			}
		}
	}

	public function getTitle() {
		return 'User Group Rights Comparison Report<br/>Report Date: ' . date('m/d/Y', strtotime('now'));
	}

	public function getData() {
		$extraParams = $this->getExtraParams();

		$queryParams = [];



		return [];
	}
} 