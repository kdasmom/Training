<?php
namespace NP\gl\validation;

/**
 * A class to validate glaccount entities
 *
 * This class validates an NP\import\GLAccount entity. See NP\core\validation\GLAccountValidator.
 * 
 * @author Zubik Aliaksandr
 */
class GLAccountValidator extends \NP\core\validation\EntityValidator {
	
	/**
	 * Validates an glaccount data set
	 *
	 * @param  NP\import\GLAccount $entity The entity to validate
	 * @return array                      An object containing the result of the validation
	 */
	public function validate(\NP\core\AbstractEntity $entity) {
		if (!$entity instanceOf \NP\gl\GLAccountEntity) {
			throw new \NP\core\Exception("This class can only validate entities of type \\NP\\gl\\GLAccountEntity");
		}

		return parent::validate($entity);
	}
}
?>