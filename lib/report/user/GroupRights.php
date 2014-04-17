<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 14.04.2014
 * Time: 8:49
 */

namespace NP\report\user;


use NP\core\db\Expression;
use NP\core\db\Select;
use NP\report\AbstractReport;
use NP\report\ReportColumn;
use NP\report\ReportInterface;

class GroupRights extends AbstractReport implements ReportInterface {
	public function init() {
		$this->addCols([
			new ReportColumn('Group Name', 'child_role', 0.2),
			new ReportColumn('Group Parent', 'parent_role', 0.15, 'string', 'left'),
			new ReportColumn('Number of Users Assigned', 'Users_Count', 0.1, 'string', 'left'),
			new ReportColumn('Last Updated', 'userprofile_updated_by', 0.06, 'string', 'left', [$this, 'updateDatetime'])
		]);
	}

	public function updateDatetime($val, $row, $report) {
		if (!empty($row['role_updated_datetime']) && $row['role_updated_datetime'] !== '') {
			return $row['role_updated_datetime'] . ' ' . $row['userprofile_updated_by'];
		}
		return $row['userprofile_updated_by'];
	}

	public function getTitle() {
		return 'User Group Rights Report<br/>' . date('m/d/Y', strtotime('now'));
	}

	public function getData() {
		$extraParams = $this->getExtraParams();
		$propertyContext = $this->getOptions()->propertyContext;

		$propertyType  = $propertyContext->getType();
		$selection  = $propertyContext->getSelection();
		$propertyStatus = $propertyContext->getPropertyStatus();

		$queryParams = [];

		$selectUsers = new Select();
		$selectRole = new Select();
		$selectCount = new Select();

		$selectCount->from(['u' => 'userprofilerole'])
					->count()
					->whereEquals('role_id', 'r.role_id');

		if ($propertyType !== 'all') {
			$selectCount->join(['pup' => 'propertyuserprofile'], 'pup.userprofile_id=u.userprofile_id', [], Select::JOIN_INNER);
			$selectCount->whereNotIn('u.userprofile_id', Select::get()->from(['up' => 'propertyuserprofile'])
																	->columns(['userprofile_id']));
		}

		if ($propertyType == 'region') {
			$selectCount->join(['p' => 'property'], 'p.property_id=pup.property_id', [], Select::JOIN_INNER);
			$selectCount->whereIn('p.property_id', implode(',', $selection));
		}

		if ($propertyType == 'property' && !is_array($selection)) {
			$selectCount->whereEquals('pup.property_id', "{$selection}");
		}

		if ($propertyType == 'property' && is_array($selection) && count($selection) > 0) {
			$selectCount->whereIn('pup.property_id', implode(',', $selection));
		}



		$selectRole->from(['r' => 'role'])
					->columns(
						[
							'role_id',
							'thiscount'	=> $selectCount,
							'role_updated_by',
							'role_updated_datetm',
							'role_updated_datetime'  =>  new Expression("
								case
									when r.role_updated_datetm is not null
									then concat(replace(convert(nvarchar, r.role_updated_datetm, 3), ' ', '/'), ', ', convert(nvarchar, r.role_updated_datetm, 108))
									else ''
								end")
						]
					)
					->whereEquals('asp_client_id', '?')
					->whereNotEquals('role_name', '?');

		$queryParams = [$this->configService->getClientId(), 'Client Manager'];

		$selectUsers->from(['UsersCount' => $selectRole])
				->columns([
						'role_id',
						'thiscount',
						'role_updated_by',
						'role_updated_datetm',
						'role_updated_datetime'
				])
				->join(['upr' => 'userprofilerole'], 'upr.role_id = UsersCount.role_id', ['userprofile_id'], Select::JOIN_LEFT);

		$selectParentChild = new Select();
		$selectParentChild->from(['r1' => 'role'])
						->columns(['parent_role' => 'role_name'])
						->join(['t1' => 'tree'], "r1.role_id=t1.tablekey_id and t1.table_name='role'", [])
						->join(['t2' => 'tree'], "t1.tree_id = t2.tree_parent and t2.table_name='role'", ['child_id' => 'tablekey_id'])
						->join(['r2' => 'role'], "r2.role_id=t2.tablekey_id", ['child_role' => 'role_name']);

		$select = new Select();
		$select->from(['Users' => $selectUsers])
			->distinct()
			->columns(
				[
					'role_id',
					'Users_Count' => "thiscount",
					'userprofile_updated_by' => new Expression("' (' + u2.userprofile_username + ')'")
				]
			)
			->join(['ParentChildRole' => $selectParentChild], 'Users.role_id = ParentChildRole.child_id', [
				'parent_role',
				'child_role',
				'child_role_id' => 'child_id'
			])
			->join(['u2' => 'userprofile'], 'Users.role_updated_by = u2.userprofile_id', [], Select::JOIN_LEFT)
			->whereEquals('1', '1');

		if ($extraParams['role_id']) {
			$select->whereEquals('ParentChildRole.child_id', '?');

			$queryParams[] = $extraParams['role_id'];
		}

		if ($extraParams['exclude_empty']) {
			$select->whereNotEquals('Users.thiscount', '?');
			$queryParams[] = 0;
		}

		$select->order('ParentChildRole.child_role');

		if ($extraParams['role_id']) {
			$privListSelect = new Select();
			$privListSelect->from(['m' => 'modulepriv'])
				->columns(['module_id'])
				->where(['tablekey_id' => '?', 'table_name' => '?']);
		}


		$adapter = $this->gatewayManager->get('UserprofileGateway')->getAdapter();
		$result = $adapter->query($select, $queryParams);

		$roles = [];

		if (count($result) > 0) {

			foreach ($result as &$role) {
				$roles[] = $role;
				$select = new Select();

				$select->from(['mp' => 'modulepriv'])
					->columns(['module_id'])
					->where([
						'tablekey_id' => '?',
						'table_name' => '?'
					]);

				$rolesPriv = $adapter->query($select, [$role['role_id'], 'role']);
				$roleModules = [];
				foreach ($rolesPriv as $module) {
					$roleModules[] = $module['module_id'];
				}
				$tree = $this->configService->getModulesTree(null, $roleModules);

				if (count($tree) > 0) {
					$roles[] = [
						'child_role' => 'Role rights',
						'parent_role' => '&nbsp;',
						'Users_Count' => '&nbsp;',
						'userprofile_updated_by' => '&nbsp;'
					];
				}

				foreach ($tree as $element) {
					$roles[] = [
						'child_role' => str_repeat('&nbsp;', 5) . $element['indent_text'] . $element['module_name'],
						'parent_role' => '&nbsp;',
						'Users_Count' => '&nbsp;',
						'userprofile_updated_by' => '&nbsp;'
					];
				}
			}
		}

		return $roles;
	}
} 