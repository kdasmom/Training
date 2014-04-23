<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 14.04.2014
 * Time: 8:53
 */

namespace NP\report\user;


use NP\core\db\Select;
use NP\core\db\Where;
use NP\report\AbstractReport;
use NP\report\ReportColumn;
use NP\report\ReportInterface;

class GroupRightsComparison extends AbstractReport implements ReportInterface {
	public function init() {
		$this->addCols([
			new ReportColumn('Responsibilities', 'module_name', 0.15, 'string', 'left', [$this, 'renderModule'])
		]);

		$extraParams = $this->getExtraParams();

		if (isset($extraParams['compared_groups']) && count($extraParams['compared_groups']) > 0) {
			$roles = $this->gatewayManager->get('RoleGateway')->find(
				Where::get()->in('role_id', implode(',', $extraParams['compared_groups']))
							->equals('asp_client_id', '?'),
				[$this->configService->getClientId()], ['role_name'], ['role_name', 'role_id']);
			foreach ($roles as $role) {
				$this->addCols([
					new ReportColumn($role['role_name'], 'col_' . $role['role_id'] , 0.08, 'string', 'center', [$this, 'renderRole'])
				]);
			}
		}
	}

	public function renderModule($val, $row, $report) {
		return $row['indent_text'] . $val;
	}

	public function renderRole($val, $row, $report) {
		if ($val) {
			return 'X';
		}

		return '&nbsp;';
	}

	public function getTitle() {
		return 'User Group Rights Comparison Report<br/>Report Date: ' . date('m/d/Y', strtotime('now'));
	}

	public function getData() {
		$extraParams = $this->getExtraParams();

		$queryParams = [];

		$tree = $this->securityService->getModuleTree(null);

		$select = new Select();

		$select->columns(['module_id','module_name'])
			->from(['m'=>'module'])
			->join(['t'=>'tree'], "t.tablekey_id = m.module_id AND t.table_name = 'module'", ['tree_id','tree_parent'])
			->order('t.tree_parent, m.module_id, m.module_name');
		foreach ($extraParams['compared_groups'] as $roleid) {
			$selectRole = new Select();
			$selectRole->from(['mp' => 'modulepriv'])
				->columns(['module_id'])
				->join(['r' => 'role'], 'mp.tablekey_id = r.role_id', ['role_name'])
				->join(['m1' => 'module'], 'm1.module_id = mp.module_id', ['module_name'])
				->whereEquals('mp.table_name', '?')
				->whereEquals('mp.tablekey_id', '?');

			$queryParams = array_merge($queryParams, ['role', $roleid]);
			$select->join(['rolesm_' . $roleid => $selectRole], "m.module_id = rolesm_{$roleid}.module_id", ["col_{$roleid}" => 'module_id'], Select::JOIN_LEFT);
		}


		$adapter = $this->gatewayManager->get('UserprofileGateway')->getAdapter();

		$result = $adapter->query($select, $queryParams);

		$result = $this->tree($result);

		return $result;
	}

	public function tree($array) {
		$tree = [];
		foreach ($array as $item) {
			if (!array_key_exists($item['tree_parent'], $tree)) {
				$tree[$item['tree_parent']] = array();
			}
			$tree[$item['tree_parent']][] = $item;
		}

		$tree = $this->buildTree($tree, 0, 0);

		return $tree;
	}

	private function buildTree($tree, $parent, $level=0) {
		$modules = array();
		if (array_key_exists($parent, $tree)) {
			foreach($tree[$parent] as &$treeItem) {
				$treeItem['level'] = $level;
				$treeItem['indent_text'] = str_repeat('&nbsp;', $level*5);
				$modules[] = $treeItem;
				$newlevel = $level + 1;
				$modules = array_merge($modules, $this->buildTree($tree, $treeItem['tree_id'], $newlevel));
			}
		}
		return $modules;
	}
} 