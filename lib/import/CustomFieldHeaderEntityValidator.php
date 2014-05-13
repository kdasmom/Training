<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 5/12/2014
 * Time: 5:25 PM
 */

namespace NP\import;

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

		// Validate property
		$prop = $this->customFieldGateway->find('property_id_alt = ?', array($entity->property_id_alt));

		// Check if record already exists
		if ($entity->unit_id_alt != '' && !empty($prop)) {
			$rec = $this->unitGateway->find(
				array('u.property_id'=>'?', 'unit_id_alt'=>'?'),
				array($prop[0]['property_id'], $entity->unit_id_alt)
			);

			if (empty($rec)) {
				$this->addError($errors, 'unit_id_alt', 'importFieldUnitError');
			}
		}

		return $errors;
	}
} 