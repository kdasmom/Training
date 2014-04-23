<?php

namespace NP\invoice;

/**
 * Abstract class for auditing an entity
 *
 * @author Thomas Messier
 */
class InvoiceReclassAuditor extends AbstractEntityAuditor {
	protected $userprofile_id, $delegation_to_userprofile_id, $notes;

	public function __construct($userprofile_id, $delegation_to_userprofile_id, $notes) {
		$this->userprofile_id               = $userprofile_id;
		$this->delegation_to_userprofile_id = $delegation_to_userprofile_id;
		$this->notes                        = $notes;
	}

	protected function auditField($newVal, $oldVal, $field, $fieldDef) {
		$invoiceitem_id = null;
		if ($this->newEntity->hasField('invoiceitem_id')) {
			$invoiceitem_id = $this->newEntity->invoiceitem_id;
		}

		$reclass = new AuditReclassEntity([
			'userprofile_id'               => $this->userprofile_id,
			'delegation_to_userprofile_id' => $this->delegation_to_userprofile_id,
			'audit_note'                   => $this->notes,
			'invoice_id'                   => $this->newEntity->invoice_id,
			'invoiceitem_id'               => $invoiceitem_id,
			'field'                        => $field,
			'oldVal'                       => $oldVal,
			'newVal'                       => $newVal
		]);
		
		$errors = $this->entityValidator->validate($reclass);
		
		if (!count($errors)) {
			$this->auditReclassGateway->save($reclass);
		} else {
			$this->loggingService->log('global', 'Error creating reclass record', $errors);
			throw new \NP\core\Exception('Error reclassing invoice while creating auditreclass record');
		}
	}
}

?>