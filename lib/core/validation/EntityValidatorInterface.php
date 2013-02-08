<?php
namespace NP\core\validation;

interface EntityValidatorInterface {
	
	public function validate(AbstractEntity $entity);
}
?>