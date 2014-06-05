<?php

namespace NP\notification;

use NP\core\AbstractService;
use NP\core\validation\EntityValidator;
use NP\core\notification\EmailerInterface;
use NP\core\notification\EmailMessage;
use NP\system\ConfigService;

/**
 * Service class for operations related to Notifications, email or otherwise
 *
 * @author Thomas Messier
 */
class NotificationService extends AbstractService {

	protected $config, $emailer, $securityService;

	public function __construct(ConfigService $configService, EmailerInterface $emailer) {
		$this->configService = $configService;
		$this->emailer       = $emailer;
	}

	public function setSecurityService(\NP\security\SecurityService $securityService) {
		$this->securityService = $securityService;
	}
	
	public function sendEmail($message, $from=null, $to=null, $subject=null, $contentType='text/html') {
		if (!$message instanceOf EmailMessage) {
			$message = new EmailMessage($subject, $message, $contentType);
			$message->setTo($to);
			$message->setFrom($from);
		}

		// Only send the email if notifications are enabled
		if ($this->configService->getConfig('notificationsEnabled', true)) {
			$this->emailer->send($message);
		}

		// If mail logging is on, log this message
		if ( in_array('mail', $this->configService->getConfig('enabledNamespaces', array())) ) {
			$from = $message->getFrom();
			if (is_array($from)) {
				$from = implode(';', $from);
			}

			$to = $message->getTo();
			if (is_array($to)) {
				$to = implode(';', $to);
			}

			$this->loggingService->log('mail', "From: {$from}; To: {$to}; Subject: {$message->getSubject()}; Message: {$message->getBody()}");
		}
	}

	public function getAlertTypes() {
		return $this->emailAlertTypeGateway->find(null, array(), 'emailalerttype_name');
	}

	public function getUserNotifications($userprofile_id) {
		return $this->emailAlertGateway->find(
			array('isActive'=>'?', 'userprofile_id'=>'?'),
			array(1, $userprofile_id)
		);
	}

	public function getUserEmailFrequency($userprofile_id) {
		$recs = $this->emailAlertHourGateway->find(
			array('isActive'=>'?', 'userprofile_id'=>'?'),
			array(1, $userprofile_id)
		);
		return \NP\util\Util::valueList($recs, 'runhour');
	}

	public function getRoleNotifications($role_id) {
		return $this->emailAlertGateway->find(
			array('isActive'=>'?', 'role_id'=>'?'),
			array(1, $role_id)
		);
	}

	public function getRoleEmailFrequency($role_id) {
		$recs = $this->emailAlertHourGateway->find(
			array('isActive'=>'?', 'role_id'=>'?'),
			array(1, $role_id)
		);
		return \NP\util\Util::valueList($recs, 'runhour');
	}

	public function saveNotifications($type, $tablekey_id, $emailalerts, $emailalerthours) {
		// Begin a transaction
		$this->emailAlertGateway->beginTransaction();
		$error = '';
		$col = "{$type}_id";

		try {
			// Delete current email alerts set for this user
			$this->emailAlertGateway->delete(array($col=>'?'), array($tablekey_id));

			// Insert the new notifications
			foreach ($emailalerts as $data) {
				$emailalert = new EmailAlertEntity($data);
				$emailalert->$col = $tablekey_id;

				if (!count($this->entityValidator->validate($emailalert))) {
					$this->emailAlertGateway->save($emailalert);
				} else {
					$error = $this->localizationService->getMessage('unexpectedError');
					break;
				}
			}

			// Delete current email alert hours set for this user
			$this->emailAlertHourGateway->delete(array($col=>'?'), array($tablekey_id));

			foreach ($emailalerthours as $data) {
				$emailalerthour = new EmailAlertHourEntity($data);
				$emailalerthour->$col = $tablekey_id;

				if (!count($this->entityValidator->validate($emailalerthour))) {
					$this->emailAlertHourGateway->save($emailalerthour);
				} else {
					$error = $this->localizationService->getMessage('unexpectedError');
					break;
				}
			}
		} catch(\Exception $e) {
			// Capture the error message
			$error = $this->handleUnexpectedError($e);
		}

		// If any error happens, rollback the transaction
		if (strlen($error)) {
			$this->emailAlertGateway->rollback();
		// ...otherwise commit
		} else {
			$this->emailAlertGateway->commit();
		}

		return array(
			'success' => (strlen($error)) ? false : true,
			'error'   => $error,
		);
	}

	/**
	 * Resets email alert settings for all users of a role to the role defaults
	 *
	 * @param  int $role_id
	 */
	public function resetUserEmailAlertSettings($type, $tablekey_id) {
		// Begin a transaction
		$this->emailAlertGateway->beginTransaction();
		$error = '';

		try {
			// Delete current email alerts set for user(s)
			$this->emailAlertGateway->deleteUserRoleAlerts($type, $tablekey_id);
			// Copy email alerts for the role to the user(s)
			$this->emailAlertGateway->copyRoleAlertsToUsers($type, $tablekey_id);
			// Delete current email frequencies set for user(s)
			$this->emailAlertHourGateway->deleteUserRoleEmailFrequency($type, $tablekey_id);
			// Copy email frequencies for the role to the user(s)
			$this->emailAlertHourGateway->copyRoleEmailFrequencyToUsers($type, $tablekey_id);
		} catch(\Exception $e) {
			// Capture the error message
			$error = $this->handleUnexpectedError($e);
		}

		// If any error happens, rollback the transaction
		if (strlen($error)) {
			$this->emailAlertGateway->rollback();
		// ...otherwise commit
		} else {
			$this->emailAlertGateway->commit();
		}

		return array(
			'success' => (strlen($error)) ? false : true,
			'error'   => $error,
		);
	}

	/**
	 * Copies email alerts and frequencies from one role to another
	 *
	 * @param  int   $from_role_id
	 * @param  int   $to_role_id
	 * @return array
	 */
	public function copyEmailSettingsToRole($from_role_id, $to_role_id) {
		$error = '';
		$this->emailAlertGateway->beginTransaction();
		try {
			$this->emailAlertGateway->copyToRole($from_role_id, $to_role_id);
			$this->emailAlertHourGateway->copyToRole($from_role_id, $to_role_id);
		} catch(\Exception $e) {
			$error = $this->handleUnexpectedError($e);
		}

		if ($error == '') {
			$this->emailAlertGateway->commit();
		} else {
			$this->emailAlertGateway->rollback();
		}

		return array(
			'success' => ($error == '') ? true : false,
			'error'   => $error
		);
	}

	public function addStatusAlert($entity_id, $emailalerttype_name) {
		$emailalerttype = $this->emailAlertTypeGateway->findSingle(
			'emailalerttype_name = ?',
			[$emailalerttype_name],
			['emailalerttype_id_alt','emailalerttype_category']
		);
		$emailalerttype_id_alt = $emailalerttype['emailalerttype_id_alt'];
		$category              = $emailalerttype['emailalerttype_category'];

		if ($category == 'PO') {
			$table_name = 'purchaseorder';
			$entity      = $this->purchaseOrderGateway->findById($entity_id);
			$statusData  = $this->getPoStatusData($emailalerttype_name);
			$displayName = 'Purchase Order';
		} else {
			$table_name  = strtolower($category);
			$gtw         = "{$table_name}Gateway";
			$entity      = $this->$gtw->findById($entity_id);
			$statusData  = $this->getInvoiceStatusData($emailalerttype_name);
			$displayName = ucfirst($table_name);
		}

		$entity_ref  = $entity["{$table_name}_ref"];
		
		if ($this->emailAlertGateway->hasEmailAlert($entity['userprofile_id'], $emailalerttype_id_alt)) {
			$user = $this->userprofileGateway->findById($entity['userprofile_id']);
			
			if (filter_var($user['email_address'], FILTER_VALIDATE_EMAIL)) {
				$subject = "{$displayName}s have been {$statusData['state']}";

				$person_name = 'NexusPayables User';
				if (!empty($user['person_firstname']) || !empty($user['person_lastname'])) {
					$person_name = "{$user['person_firstname']} {$user['person_lastname']}";
				}

				$html =
					"Dear {$person_name}
					<br /><br />
					{$displayName} {$entity_ref} has been {$statusData['state']}.  Please log in to
					{$this->configService->getLoginUrl()} to view the {$displayName}";

				if ($statusData['tab'] !== null) {
					$html .= "on the {$displayName} Register {$statusData['tab']} tab";
				}

				$html .= '.
					<br /><br />
					Thank you very much,<br />
					NexusPayables Support';

				$this->addEmailMessage($user['email_address'], $subject, $html, $table_name);
			}
		}
	}

	public function getPoStatusData($emailalerttype_name) {
		$tab = null;
		if ($emailalerttype_name == 'Status Alert: PO Modification') {
			$tab = 'Open';
			$state = 'modified';
		} else if ($emailalerttype_name == 'Status Alert: PO Released') {
			$tab = 'Approved';
			$state = 'released';
		} else if ($emailalerttype_name == 'Status Alert: PO Rejection') {
			$tab = 'Rejected';
			$state = 'rejected';
		} else if ($emailalerttype_name == 'Status Alert: PO Approved') {
			$state = 'approved';
		}

		return [
			'state' => $state,
			'tab'   => $tab
		];
	}

	public function getInvoiceStatusData($emailalerttype_name) {
		$tab = null;
		if ($emailalerttype_name == 'Status Alert: Invoice Modification') {
			$tab = 'Open';
			$state = 'modified';
		} else if ($emailalerttype_name == 'Status Alert: Invoice Completed') {
			$state = 'completed';
		} else if ($emailalerttype_name == 'Status Alert: Invoice Rejection') {
			$tab = 'Rejected';
			$state = 'rejected';
		} else if ($emailalerttype_name == 'Invoice Approved') {
			$state = 'approved';
		}

		return [
			'state' => $state,
			'tab'   => $tab
		];
	}

	/**
	 * Adds an email message to be sent by the email scheduled task
	 */
	public function addEmailMessage($toEmail, $subject, $body, $emailmessage_type) {
		$fromEmail = $this->configService->get('PN.Main.FromEmail');

		// Check if an unsent message that's the same as this one already exists
		$emailmessage_id = $this->emailMessageGateway->findValue(
			[
				'EmailMessage_To'      => '?',
				'EmailMessage_From'    => '?',
				'EmailMessage_Subject' => '?',
				'EmailMessage_Status'  => 0
			],
			[$toEmail, $fromEmail, $subject],
			'EmailMessage_id'
		);

		// If message doesn't exist, create it
		if ($emailmessage_id === null) {
			$this->emailMessageGateway->insert([
				'EmailMessage_To'      => $toEmail,
				'EmailMessage_From'    => $fromEmail,
				'EmailMessage_Subject' => $subject,
				'EmailMessage_Body'    => $body,
				'EmailMessage_Status'  => 0,
				'EmailMessage_Type'    => $emailmessage_type,
				'userprofile_id'       => $this->securityService->getUserId()
			]);
		}
	}
}

?>