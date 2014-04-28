<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 07.04.2014
 * Time: 11:07
 */

namespace NP\report\gl;


use NP\core\db\Expression;
use NP\core\db\Select;
use NP\core\db\Where;
use NP\report\AbstractReport;
use NP\report\ReportColumn;
use NP\report\ReportInterface;

class GlAccount extends AbstractReport implements ReportInterface {
	public function init() {

		$extraParams = $this->getExtraParams();

		if ($extraParams['glaccount_order'] == 'glcode_name') {
			$this->addCols([
				new ReportColumn('GL Name', 'glcode_name', 0.2, 'string', 'left'),
				new ReportColumn('GL Number', 'glcode_number', 0.15, 'string', 'left', [$this, 'renderName'])
			]);
		}
		if ($extraParams['glaccount_order'] == 'glcode_number') {
			$this->addCols([
				new ReportColumn('GL Number', 'glcode_number', 0.15, 'string', 'left'),
				new ReportColumn('GL Name', 'glcode_name', 0.2, 'string', 'left', [$this, 'renderName'])
			]);
		}

		$this->addCols([
			new ReportColumn('GL Category', 'glcat_name', 0.15, 'string', 'left'),
			new ReportColumn('Status', 'glaccount_status', 0.15, 'string', 'left'),
			new ReportColumn('Type', 'glaccounttype_name', 0.15, 'string', 'left'),
			new ReportColumn('Integration Package', 'integration_package_name', 0.15, 'string', 'left'),
		]);
	}

	public function getTitle() {
		return 'Gl Account Report';
	}

	public function renderName($val, $record, $report) {
		return $val;
	}

	public function getData() {
		$extraParams = $this->getExtraParams();

		$queryParams = [];

		$select = new Select();

		$select->from(['glcats' => 'glaccount'])
				->columns(
					[
						'glcat_id' => 'glaccount_id',
						'glcat_number' => 'glaccount_number',
						'glcat_name'	=> 'glaccount_name',
						'glaccount_usable'	=> new Expression("replace(glcats.glaccount_usable, '##', '####')"),
						'integration_package_name'	=> new Expression("replace(ip.integration_package_name, '##', '####')"),
						'glaccount_status'			=> new Expression("replace(glcode.glaccount_status, '##', '####')"),
						'glcode_number'				=> new Expression("replace(glcode.glaccount_number, '##', '####')"),
						'glcode_name'				=> new Expression("replace(glcode.glaccount_name, '##', '####')"),
						'glaccounttype_name'		=> new Expression("replace(gat.glaccounttype_name, '##', '####')")
					]
				)
				->join(['ip' => 'integrationpackage'], 'glcats.integration_package_id = ip.integration_package_id', [], Select::JOIN_LEFT)
				->join(['treecats' => 'tree'], "glcats.glaccount_id = treecats.tablekey_id and treecats.table_name = 'glaccount'", [], Select::JOIN_INNER)
				->join(['treecodes' => 'tree'], "treecats.tree_id = treecodes.tree_parent and treecodes.table_name = 'glaccount'", [], Select::JOIN_INNER)
				->join(['glcode' => 'glaccount'], "treecodes.tablekey_id = glcode.glaccount_id", ['glcode_id' => 'glaccount_id'], Select::JOIN_INNER)
				->join(['gat' => 'glaccounttype'], "glcode.glaccounttype_id = gat.glaccounttype_id", ['glaccounttype_id'], Select::JOIN_INNER)
				->whereIsNull('glcats.glaccounttype_id')
				->order($extraParams['glaccount_order']);

		if ($extraParams['integration_package_id']) {
			$select->whereEquals('glcode.integration_package_id', '?');
			$queryParams[] = $extraParams['integration_package_id'];
		}

		if ($extraParams['glaccount_status']) {
			$select->whereEquals('glcode.glaccount_status', '?');
			$queryParams[] = $extraParams['glaccount_status'];
		}

		if ($extraParams['glaccounttype_id']) {
			$select->whereIn('gat.glaccounttype_id', implode(',', $extraParams['glaccounttype_id']));
		}

		if ($extraParams['glaccount_category']) {
			$select->whereIn('glcats.glaccount_id', implode(',', $extraParams['glaccount_category']));
		}

		$adapter = $this->gatewayManager->get('GlAccountGateway')->getAdapter();
		return $adapter->getQueryStmt($select, $queryParams);
	}

	public function getExtraHeaderFilters() {
		$extraFilters = $this->getOptions()->extraHeaderFilters;
		$result = [
			'Report Date'   => date('m/d/Y', strtotime('now')),
			'GL Types' => 'All',
			'GL Categories' => 'All'
		];

		if (count($extraFilters['glaccount_category']) > 0) {

			$select = new Select();
			$select->from(['g' => 'glaccount'])
					->columns([])
					->distinct()
					->join(['t1' => 'tree'], "t1.tablekey_id = g.glaccount_id and t1.table_name = 'glaccount'", [], Select::JOIN_INNER)
					->join(['t2' => 'tree'], "t2.tree_id = t1.tree_parent and t1.table_name = 'glaccount'", [], Select::JOIN_INNER)
					->join(['g2' => 'glaccount'], 'g2.glaccount_id = t2.tablekey_id', ['glaccount_name'], Select::JOIN_INNER)
					->join(['gt' => 'glaccounttype'], 'g.glaccounttype_id = gt.glaccounttype_id', [], Select::JOIN_INNER)
					->whereIn('g2.glaccount_id', implode(',', $extraFilters['glaccount_category']));

			$adapter = $this->gatewayManager->get('GlAccountGateway')->getAdapter();
			$glcategory = $adapter->query($select);

			if (count($glcategory) > 0) {
				$result['GL Categories'] = $glcategory[0]['glaccount_name'];
			}
			if (count($glcategory) > 1) {
				for ($index = 1; $index < count($glcategory); $index++) {
					$result['GL Categories'] .= ', ' . $glcategory[$index]['glaccount_name'];
				}
			}
		}
		if (count($extraFilters['glaccount_type']) > 0) {
			$select = new Select();
			$select->from(['gt' => 'glaccounttype'])
					->whereIn('glaccounttype_id', implode(',', $extraFilters['glaccount_type']))
					->columns(['glaccounttype_name']);
			$adapter = $this->gatewayManager->get('GlAccountGateway')->getAdapter();
			$gltypes = $adapter->query($select);

			if (count($gltypes) > 0) {
				$result['GL Types'] = $gltypes[0]['glaccounttype_name'];
				if (count($gltypes) > 1) {
					for ($index = 1; $index < count($gltypes); $index++) {
						$result['GL Types'] .= ', ' . $gltypes[$index]['glaccounttype_name'];
					}
				}
			}
		}

		return $result;
	}
} 