<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 2/3/14
 * Time: 9:13 AM
 */

namespace NP\system;


use NP\core\AbstractService;

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
	public function getById($id = null) {
		if (!$id) {
			return [];
		}

		return $this->printTemplateGateway->getTemplateData($id);
	}

	public function saveTemplates($data = []) {
		print_r($data);
	}
} 