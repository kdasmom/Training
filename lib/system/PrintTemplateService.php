<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 2/3/14
 * Time: 9:13 AM
 */

namespace NP\system;


use NP\core\AbstractService;
use NP\core\Exception;

class PrintTemplateService extends AbstractService {

	/**
	 * Retrieve all print templates
	 *
	 * @param int $page
	 * @param int $limit
	 * @param string $sort
	 * @return mixed
	 */
	public function getAll($page = 1, $limit = 25, $sort = 'Print_Template_Name') {
		return $this->printTemplateGateway->getTemplates($page, $limit, $sort);
	}

	/**
	 * Retrieve print template data
	 *
	 * @param null $id
	 * @return array
	 */
	public function get($id = null) {
		if (!$id) {
			return [];
		}

		return $this->printTemplateGateway->findById($id);
	}

	public function saveTemplates($data = []) {
		$printTemplate = new PrintTemplateEntity($data['printtemplate']);
		$errors = [];

		if ($data['templateobj']) {
			$printTemplate->Print_Template_Data = $data['templateobj'];
		}
		$printTemplate->Print_Template_Type = 'PO';
		$printTemplate->Print_Template_LastUpdateBy = $data['userprofile_id'];
		$printTemplate->Print_Template_LastUpdateDt = \NP\util\Util::formatDateForDB();
		$printTemplate->isActive = !$printTemplate->isActive ? 0 : 1;

		$this->printTemplateGateway->beginTransaction();
		try {
			$template_id = $this->printTemplateGateway->save($printTemplate);
			$this->printTemplateGateway->commit();

			$template_id = !$printTemplate->Print_Template_Id ? $template_id : $printTemplate->PrintTemplateId;

			if (!$this->printTempalteGateway->deletePrintTemplateProperties($template_id)) {
				throw new \NP\core\Exception('Cannot delete template properties.');
			}
			if ($data['property_type'] == 1) {
				$this->printTemplateGateway->savePrintTemplateProperties(-1, $template_id, $data['userprofile_id']);
			} else {
				foreach ($data['properties'] as $property_id) {
					$this->printTemplateGateway->savePrintTemplateProperties($property_id, $template_id, $data['userprofile_id']);
				}
			}
		} catch(\Exception $e) {
			$this->printTemplateGateway->rollback();
			$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
		}

		return [
			'success'			=> (count($errors)) ? false : true,
			'errors'			=> $errors
		];
	}
} 