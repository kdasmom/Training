<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 5/12/2014
 * Time: 5:25 PM
 */

namespace NP\import;

use NP\core\db\Adapter;
use NP\locale\LocalizationService;
use NP\system\PnCustomFieldsGateway;

class CustomFieldHeaderEntityValidator extends AbstractImportEntityValidator {
	protected $customFieldGateway, $unitGateway;

	public function __construct(LocalizationService $localizationService, Adapter $adapter,
								PnCustomFieldsGateway $customFieldGateway) {
		parent::__construct($localizationService, $adapter);

		$this->customFieldGateway = $customFieldGateway;
	}

	public function validate(\NP\core\AbstractEntity $entity) {
		$errors = parent::validate($entity);



		return $errors;
	}
} 