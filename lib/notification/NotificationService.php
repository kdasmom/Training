<?php

namespace NP\notification;

use NP\core\AbstractService;
use NP\core\validation\EntityValidator;
use NP\core\notification\EmailerInterface;
use NP\core\notification\EmailMessage;
use NP\core\Config;

/**
 * Service class for operations related to Notifications, email or otherwise
 *
 * @author Thomas Messier
 */
class NotificationService extends AbstractService {

	protected $config, $emailer;

	public function __construct(Config $config, EmailerInterface $emailer) {
		$this->config                = $config;
		$this->emailer               = $emailer;
	}
	
	public function sendEmail($message, $from=null, $to=null, $subject=null, $contentType='text/html') {
		if (!$message instanceOf EmailMessage) {
			$message = new EmailMessage($subject, $message, $contentType);
			$message->setTo($to);
			$message->setFrom($from);
		}

		// Only send the email if notifications are enabled
		if ($this->config->getConfig('notificationsEnabled', true)) {
			$this->emailer->send($message);
		}

		// If mail logging is on, log this message
		if ( in_array('mail', $this->config->getConfig('enabledNamespaces', array())) ) {
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
}

?>