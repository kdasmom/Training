<?php

namespace NP\notification;

use NP\core\AbstractService;
use NP\core\validation\EntityValidator;
use NP\user\UserprofileGateway;
use NP\core\notification\EmailerInterface;
use NP\core\notification\EmailMessage;

/**
 * Service class for operations related to Notifications, email or otherwise
 *
 * @author Thomas Messier
 */
class NotificationService extends AbstractService {

	protected $emailAlertTypeGateway, $emailAlertHourGateway, $emailAlertGateway, $userprofileGateway, $emailer;

	public function __construct(EmailAlertTypeGateway $emailAlertTypeGateway, EmailAlertGateway $emailAlertGateway,
								EmailAlertHourGateway $emailAlertHourGateway, UserprofileGateway $userprofileGateway,
								EmailerInterface $emailer) {
		$this->emailAlertTypeGateway = $emailAlertTypeGateway;
		$this->emailAlertGateway     = $emailAlertGateway;
		$this->emailAlertHourGateway = $emailAlertHourGateway;
		$this->userprofileGateway    = $userprofileGateway;
		$this->emailer               = $emailer;
	}
	
	public function sendEmail($message, $from=null, $to=null, $subject=null, $contentType='text/html') {
		if (!$message instanceOf EmailMessage) {
			$message = new EmailMessage($subject, $message, $contentType);
			$message->setTo($to);
			$message->setFrom($from);
		}
		$this->emailer->send($message);
	}

	public function getAlertTypes() {
		return $this->emailAlertTypeGateway->find(null, array(), 'emailalerttype_name');
	}

	public function getUserNotifications($userprofile_id) {
		return $this->emailAlertGateway->getUserNotifications($userprofile_id);
	}

	public function getUserEmailFrequency($userprofile_id) {
		$recs = $this->emailAlertHourGateway->getUserEmailFrequency($userprofile_id);
		return \NP\util\Util::valueList($recs, 'runhour');
	}

	public function saveNotifications($userprofile_id, $emailalerts, $emailalerthours) {
		// Begin a transaction
		$this->emailAlertGateway->beginTransaction();
		$error = '';

		try {
			// Check if an email address is setup
			$user = $this->userprofileGateway->findProfileById($userprofile_id);
			if ($user['email_address'] === null || $user['email_address'] === '') {
				throw new \NP\core\Exception('Email alerts required a valid email address. Please set your email address under under the User Information section.');
			}

			// Delete current email alerts set for this user
			$this->emailAlertGateway->delete(array('userprofile_id'=>'?'), array($userprofile_id));

			// Insert the new notifications
			$validator = new EntityValidator();
			foreach ($emailalerts as $data) {
				$emailalert = new EmailAlertEntity($data);
				
				$isValid = $validator->validate($emailalert);
				if ($isValid) {
					$this->emailAlertGateway->save($emailalert);
				} else {
					throw new \NP\core\Exception('Failed to save email notifications.');
				}
			}
			// Insert records for the missing notifications
			$this->emailAlertGateway->insertUserMissingAlerts($userprofile_id);


			// Delete current email alert hours set for this user
			$this->emailAlertHourGateway->delete(array('userprofile_id'=>'?'), array($userprofile_id));

			foreach ($emailalerthours as $data) {
				$emailalerthour = new EmailAlertHourEntity($data);
				
				$isValid = $validator->validate($emailalerthour);
				if ($isValid) {
					$this->emailAlertHourGateway->save($emailalerthour);
				} else {
					throw new \NP\core\Exception('Failed to save email frequency.');
				}
			}
			// Insert records for the missing hours
			$this->emailAlertHourGateway->insertUserMissingHours($userprofile_id);

			// If we made it this far we can commit
			$this->emailAlertGateway->commit();
		} catch(\Exception $e) {
			// If any error happens, rollback the transaction
			$this->emailAlertGateway->rollback();
			// Capture the error message
			$error = (get_class($e) == 'Exception') ? 'Unexpected error' : $e->getMessage();
		}

		return array(
			'success' => (strlen($error)) ? false : true,
			'error'   => $error,
		);
	}
}

?>