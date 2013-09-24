<?php
namespace NP\core\validation;

/**
 * @author Thomas Messier
 */
interface ValidatorInterface {
	
	/**
	 * Validates a data set
	 *
	 * @param  NP\core\AbstractEntity $entity The entity to validate
	 * @return boolean                        Whether validation successed or not
	 */
	public function validate(\NP\core\AbstractEntity $entity);
}
?>