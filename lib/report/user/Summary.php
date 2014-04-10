<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 10.04.2014
 * Time: 15:09
 */

namespace NP\report\user;


use NP\core\db\Expression;
use NP\core\db\Select;
use NP\property\sql\PropertyFilterSelect;
use NP\report\AbstractReport;
use NP\report\ReportColumn;
use NP\report\ReportInterface;
use NP\user\sql\UserprofileSelect;

class Summary extends AbstractReport implements ReportInterface {
	public function init() {
		$this->addCols([
			new ReportColumn('Name', 'person_name', 0.2),
			new ReportColumn('Email Address', 'email_address', 0.15, 'string', 'left'),
			new ReportColumn('Group', 'role_name', 0.1, 'string', 'left'),
			new ReportColumn('Status', 'userprofile_status', 0.06, 'date', 'left'),
			new ReportColumn('Last Updated', 'userprofile_updated', 0.06, 'period', 'left')
		]);
	}

	public function getTitle() {
		return 'User Summary Report';
	}

	public function getData() {
		$extraParams = $this->getExtraParams();

		$queryParams = [];

		$propertyFilterSelect = new PropertyFilterSelect($this->getOptions()->propertyContext);

		$select = new UserprofileSelect();

		$select->distinct()
			->columns([
				'person_name'   => new Expression("ISNULL(ps.person_lastname, '')+', '+ISNULL(ps.person_firstname, '')+' '+ISNULL(ps.person_middlename, '')"),
				'userprofilerole_id',
				'userprofileid' => 'userprofile_id',
				'userprofile_status'    => new Expression("REPLACE(us.userprofile_status, '##', '####')"),
				'role_name'             => new Expression("REPLACE(r.role_name, '##', '####')"),
				'email_address'         => new Expression("REPLACE(e.email_address, '##', '####')"),
				'userprofile_updated_by'    => new Expression("'(' + u2.userprofile_username + ')'")
			])
			->joinRole(['role_id'], 'r', 'u', Select::JOIN_INNER, true)
			->joinStaff([], 's', 'u')
			->joinEmail([], 'e', 's', Select::JOIN_INNER, false)
			->whereNotEquals('r.role_name', '?');

		print $select->toString();

		$queryParams[] = 'Client Manager';
		return [];
	}
} 