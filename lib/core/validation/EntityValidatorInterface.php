<?php
namespace NP\core\validation;

use NP\core\EntityInterface;

interface EntityValidatorInterface {
	
	public function validate(EntityInterface $entity);
}
?>