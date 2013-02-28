<?php
namespace NP\invoice\validation;

/**
 * A class to validate invoice entities
 *
 * This class validates an NP\invoice\Invoice entity. See NP\core\validation\EntityValidator.
 * 
 * @author Thomas Messier
 */
class InvoiceValidator extends \NP\core\validation\EntityValidator {
	
	/**
	 * Validates an invoice data set
	 *
	 * @param  NP\invoice\Invoice $entity The entity to validate
	 * @return array                      An object containing the result of the validation
	 */
	public function validate(\NP\core\AbstractEntity $entity) {
		if (!$entity instanceOf \NP\invoice\InvoiceEntity) {
			throw new \NP\core\Exception("This class can only validate entities of type \\NP\\invoice\\InvoiceEntity");
		}

		return parent::validate($entity);
	}
}
?>