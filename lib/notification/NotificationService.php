<?php

namespace NP\invoice;

use NP\core\AbstractService;

/**
 * Service class for operations related to Invoices
 *
 * @author Thomas Messier
 */
class NotificationService extends AbstractService {

	protected $emailAlertTypeGateway;

	public function __construct(EmailAlertTypeGateway $emailAlertTypeGateway) {
		$this->emailAlertTypeGateway = $emailAlertTypeGateway
	}

	public function getAlertTypes() {
		return $this->emailAlertTypeGateway->find(null, array(), 'emailalerttype_name');
	}
}

?>