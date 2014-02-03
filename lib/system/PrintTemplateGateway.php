<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 2/3/14
 * Time: 9:15 AM
 */

namespace NP\system;


use NP\core\AbstractGateway;
use NP\core\db\Expression;
use NP\core\db\Select;

class PrintTemplateGateway extends AbstractGateway {

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
} 