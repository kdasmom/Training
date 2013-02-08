<?php
namespace NP\invoice;

use NP\core\EntityInterface;
use NP\core\validation\EntityValidator;

class InvoiceValidator extends EntityValidator {
	
	public function validate(EntityInterface $entity) {
		$validEntityType = 'NP\invoice\Invoice';
		if (get_class($entity) != $validEntityType) {
			throw new \NP\core\Exception("This function can only validate an entity of type {$validEntityType}");
		}

		$result = parent::validate($entity);

		$lines = $entity->lines;
		$entityValidator = new EntityValidator();
		foreach ($lines as $line) {
			$lineResult = $entityValidator->validate($line);
			if (!$lineResult->isValid()) {
				$lineErrors = $lineResult->getErrors();
				foreach ($lineErrors as $error) {
					$result->addError($error['field'], $error['msg']);
				}
			}
		}

		return $result;
	}
}
?>