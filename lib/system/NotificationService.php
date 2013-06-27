<?php

namespace NP\system;

use NP\core\AbstractService;
use NP\core\notification\EmailerInterface;
use NP\core\notification\EmailMessage;

/**
 * Service class for operations related to messages to be sent by Message Center
 *
 * @author Thomas Messier
 */
class NotificationService extends AbstractService {
	
	protected $emailer;
	
	public function __construct(EmailerInterface $emailer) {
		$this->emailer = $emailer;
	}
	
	public function sendEmail($message, $from=null, $to=null, $subject=null, $contentType='text/html') {
		if (!$message instanceOf EmailMessage) {
			$message = new EmailMessage($subject, $message, $contentType);
			$message->setTo($to);
			$message->setFrom($from);
		}
		$this->emailer->send($message);
	}
}

?>