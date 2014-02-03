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

	public function getAll($page = 1, $limit = 25, $sort = 'Print_Template_Name') {
		return $this->printTemplateGateway->getTemplates($page, $limit, $sort);
	}
} 