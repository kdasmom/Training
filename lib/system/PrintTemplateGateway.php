<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 2/3/14
 * Time: 9:15 AM
 */

namespace NP\system;


use NP\core\AbstractGateway;
use NP\core\db\Delete;
use NP\core\db\Expression;
use NP\core\db\Insert;
use NP\core\db\Select;
use NP\util\Util;

class PrintTemplateGateway extends AbstractGateway {

	protected $table = 'print_templates';
	protected $pk    = 'Print_Template_Id';

	public function getTemplates($page, $pageSize, $order) {
		$select = new Select();
		$subSelect = new Select();

		$subSelect->from(['u' => 'userprofile'])
			->columns(['UserProfile_username'])
			->limit(1)
			->whereEquals('UserProfile_Id', 'pt.Print_Template_LastUpdateBy');

		$select->from(['pt' => 'print_templates'])
			->columns([
				'Print_Template_Id',
				'Print_Template_Name',
				'Print_Template_LastUpdateDt',
				'Print_Template_LastUpdateBy',
				'isActive',
				'Print_Template_LastUpdateByUserName'	=> $subSelect,
				'Print_Template_Data'
			])
			->where(['Print_Template_Type' => '?'])
			->limit($pageSize)
			->offset($pageSize * ($page - 1))
			->order($order);

		return $this->adapter->query($select, ['PO']);
	}

	/**
	 * Retrieve template's data
	 *
	 * @param int $id
	 * @return array|bool
	 */
	public function getTemplateData($id) {

		$template = $this->findById($id);

		$select = new Select();

		$select->from(['p' => 'Print_Template_Property'])
			->where([
				'Print_Template_Id'	=> '?'
			]);

		$result = $this->adapter->query($select, [$id]);

		foreach ($result as $property) {
			$template['properties'][] = $property['Property_Id'];
		}

//		print_r($template);

		return $template;
	}

	public function savePrintTemplateProperties($property_id, $template_id, $userprofile_id) {
		$insert = new Insert();

		$insert->into('Print_Template_Property')
			->columns([
				'Print_Template_Id',
				'Property_Id',
				'Print_Templates_Properties_LastUpdateDt',
				'Print_Templates_Properties_LastUpdateBy'
			])
			->values(Select::get()->columns([
				new Expression('?'),
				new Expression('?'),
				new Expression('?'),
				new Expression('?')
			]));

		$this->adapter->query($insert, [$template_id, $property_id, Util::formatDateForDB(), $userprofile_id]);
	}

	public function deletePrintTemplateProperties($template_id) {
		$delete = new Delete();

		$delete->from('Print_Template_Property')
			->where([
				'Print_Template_Id' => '?'
			]);

		return $this->adapter->query($delete, [$template_id]);
	}

	public function getAssignedProperties($id) {

		$select = new Select();

		$select->from(['pt' => 'print_template_property'])
			->join(['p' => 'property'], 'p.property_id = pt.Property_Id', ['property_name'], Select::JOIN_LEFT)
			->where([
				'pt.Print_Template_Id' => '?'
			])
			->order('p.property_name');

		return $this->adapter->query($select, [$id]);
	}

	public function findByFilter($property_id=null, $Print_Template_Type='PO', $isActive=1) {
		$select = Select::get()
						->from(['pt'=>'print_templates'])
						->order('pt.Print_Template_Name');

		$params = [];

		if (!empty($property_id)) {
			$select->whereExists(
				Select::get()
					->from(['ptp'=>'print_template_property'])
					->whereEquals('ptp.print_template_id', 'pt.print_template_id')
					->whereNest('OR')
						->whereEquals('ptp.property_id', '?')
						->whereEquals('ptp.property_id', -1)
					->whereUnnest()
			);
			$params[] = $property_id;
		}

		if (!empty($Print_Template_Type)) {
			$select->whereEquals('pt.Print_Template_Type', '?');
			$params[] = $Print_Template_Type;
		}

		if (!empty($isActive)) {
			$select->whereEquals('pt.isActive', '?');
			$params[] = $isActive;
		}

		return $this->adapter->query($select, $params);
	}
} 