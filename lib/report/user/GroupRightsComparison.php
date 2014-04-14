<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 14.04.2014
 * Time: 8:53
 */

namespace NP\report\user;


use NP\report\AbstractReport;
use NP\report\ReportInterface;

class GroupRightsComparison extends AbstractReport implements ReportInterface {
	public function init() {
		$this->addCols([
			new ReportColumn('Name', 'person_name', 0.2),
			new ReportColumn('Email Address', 'email_address', 0.15, 'string', 'left'),
			new ReportColumn('Group', 'role_name', 0.1, 'string', 'left'),
			new ReportColumn('Status', 'userprofile_status', 0.06, 'string', 'left'),
			new ReportColumn('Last Updated', 'userprofile_updated_datetime', 0.06, 'string', 'left')
		]);
	}

	public function getTitle() {
		return 'User Group Rights Comparison Report';
	}

	public function getData() {
		$extraParams = $this->getExtraParams();
		$propertyContext = $this->getOptions()->propertyContext;

		$queryParams = [];

		return [];
	}
} 