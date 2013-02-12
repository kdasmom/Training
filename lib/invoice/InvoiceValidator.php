<?php
namespace NP\invoice;

use NP\core\EntityInterface;
use NP\core\validation\EntityValidator;

/**
 * A class to validate invoice entities
 *
 * This class validates an NP\invoice\Invoice entity. See NP\core\validation\EntityValidator.
 * 
 * @author Thomas Messier
 */
class InvoiceValidator extends EntityValidator {
	
	/**
	 * Validates an invoice entity object
	 *
	 * @param  NP\invoice\Invoice $entity               The entity to validate
	 * @return NP\core\validation\EntityValidatorResult An object containing the result of the validation
	 */
	public function validate(EntityInterface $entity) {
		// Check if the entity passed in is an invoice
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