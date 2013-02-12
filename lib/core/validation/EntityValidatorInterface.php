<?php
namespace NP\core\validation;

use NP\core\EntityInterface;

/**
 * @author Thomas Messier
 */
interface EntityValidatorInterface {
	
	/**
	 * Validates an entity object
	 *
	 * @param  NP\core\EntityInterface $entity          The entity to validate
	 * @return NP\core\validation\EntityValidatorResult An object containing the result of the validation
	 */
	public function validate(EntityInterface $entity);
}
?>