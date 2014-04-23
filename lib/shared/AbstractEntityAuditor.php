<?php

namespace NP\shared;

/**
 * Abstract class for auditing an entity
 *
 * @author Thomas Messier
 */
abstract class AbstractEntityAuditor {
	protected $newEntity, $oldEntity;

	public function audit(\NP\core\AbstractEntity $newEntity, \NP\core\AbstractEntity $oldEntity) {
		$this->newEntity = $newEntity;
		$this->oldEntity = $oldEntity;

		$entityClass = get_class($newEntity);

		$fields = $entityClass::getAuditableFields();

		$fieldsChanged = [];
		foreach ($fields as $field=>$fieldDef) {
			$newVal = trim($newEntity->$field);
			$oldVal = trim($oldEntity->$field);
			
			if ($oldVal === '') {
				$oldVal = null;
			}

			if ($newVal === '') {
				$newVal = null;
			}

			if ($newVal !== $oldVal) {
				$this->auditField($newVal, $oldVal, $field, $fieldDef);
				$fieldsChanged[] = $field;
			}
		}

		return $fieldsChanged;
	}
	
	abstract protected function auditField($newVal, $oldVal, $field, $fieldDef);
}

?>