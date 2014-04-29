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
use NP\user\sql\UserprofileroleSelect;
use NP\util\Util;

class Summary extends AbstractReport implements ReportInterface {
	public function init() {
		$this->addCols([
			new ReportColumn('Name', 'person_name', 0.2),
			new ReportColumn('Email Address', 'email_address', 0.15, 'string', 'left'),
			new ReportColumn('Group', 'role_name', 0.1, 'string', 'left'),
			new ReportColumn('Status', 'userprofile_status', 0.06, 'string', 'left'),
			new ReportColumn('Last Updated', 'userprofile_updated_datetime', 0.06, 'string', 'left', [$this, 'renderDatetime'])
		]);
	}

	public function renderDatetime($val, $row, $report) {
		if (!empty($row['userprofile_updated_datetime']) && $row['userprofile_updated_datetime'] !== '') {
			return $row['userprofile_updated_datetime'] . ' ' . $row['userprofile_updated_by'];
		}
		return $row['userprofile_updated_by'];
	}

	public function getTitle() {
		return 'User Summary Report';
	}

	public function getData() {
		$extraParams = $this->getExtraParams();
		$propertyContext = $this->getOptions()->propertyContext;

		$queryParams = [];

		$select = new UserprofileroleSelect();

		$select->distinct()
			->columns([
				'person_name'   => new Expression("ISNULL(ps.person_lastname, '')+', '+ISNULL(ps.person_firstname, '')+' '+ISNULL(ps.person_middlename, '')"),
				'userprofilerole_id',
				'userprofileid' => 'userprofile_id',
				'userprofile_status'    => new Expression("REPLACE(us.userprofile_status, '##', '####')"),
				'role_name'             => new Expression("REPLACE(r.role_name, '##', '####')"),
				'email_address'         => new Expression("REPLACE(e.email_address, '##', '####')"),
				'userprofile_updated_by'    => new Expression("'(' + u2.userprofile_username + ')'"),
				'userprofile_updated_datetime'  =>  new Expression("
					case
						when us.userprofile_updated_datetm is not null
						then concat(replace(convert(nvarchar, us.userprofile_updated_datetm, 3), ' ', '/'), ', ', convert(nvarchar, us.userprofile_updated_datetm, 108))
						else ''
					end")
			])
			->joinRole(['role_id'])
			->joinStaff()
			->joinEmail()
			->join(['ps' => 'person'], 's.person_id = ps.person_id', ['person_firstname', 'person_middlename', 'person_lastname'])
			->join(['us' => 'userprofile'], 'up.userprofile_id = us.userprofile_id', ['userprofile_startdate', 'userprofile_enddate', 'userprofile_username'])
			->join(['u2' => 'userprofile'], 'us.userprofile_updated_by = u2.userprofile_id', [], Select::JOIN_LEFT)
			->whereEquals('us.asp_client_id', '?')
			->whereNotEquals('r.role_name', '?')
			->order('person_name');

		$queryParams = [$this->configService->getClientId(), 'Client Manager'];

		if (!empty($extraParams['module_id'])) {
			$select->join(['modpriv' => 'modulepriv'], 'up.tablekey_id = modpriv.tablekey_id', [], Select::JOIN_INNER);
			$select->whereEquals('modpriv.module_id', '?');

			$queryParams[] = $extraParams['module_id'];
		}

		if (!empty($extraParams['status'])) {
			$select->whereEquals('us.userprofile_status', '?');
			$queryParams[] = $extraParams['status'];
		}

		if (!empty($extraParams['role_id'])) {
			$select->whereEquals('up.role_id', '?');
			$queryParams[] = $extraParams['role_id'];
		}

		$propertyType  = $propertyContext->getType();
		$selection  = $propertyContext->getSelection();
		$propertyStatus = $propertyContext->getPropertyStatus();

		if ($propertyType !== 'all') {
			$select->join(['pup' => 'propertyuserprofile'], 'pup.userprofile_id=us.userprofile_id', [], Select::JOIN_INNER);
		}
		if ($propertyType == 'region') {
			$select->join(['p' => 'property'], 'p.property_id=pup.property_id', [], Select::JOIN_INNER);
		}
		if ($propertyType == 'property' && !is_array($selection)) {
			$select->whereEquals('pup.property_id', '?');
			$queryParams[] = $selection;
 		}
		if ($propertyType == 'property' && is_array($selection) && count($selection) > 0) {
			$select->whereIn('pup.property_id', implode(',', $selection));
		}
		if ($propertyType == 'region' && is_array($selection) && count($selection) > 0) {
			$select->whereIn('p.property_id', implode(',', $selection));
		}

		$adapter = $this->gatewayManager->get('UserprofileGateway')->getAdapter();
		return $adapter->getQueryStmt($select, $queryParams);
	}
} 