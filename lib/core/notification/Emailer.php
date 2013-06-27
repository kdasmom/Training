<?php

namespace NP\core\notification;

/**
 * Emailer class. Currently relies on the SwiftMailer library, this is a wrapper to allow for an easy change
 * in libraries should that prove necessary in the future.
 *
 * @author Thomas Messier
 */
class Emailer implements EmailerInterface {
	protected $host, $port, $encryptionType, $username, $password;
	protected $transport = null;

	public function __construct($host=null, $port=null, $username=null, $password=null, $encryptionType=null) {
		$this->host           = $host;
		$this->port           = $port;
		$this->encryptionType = $encryptionType;
		$this->username       = $username;
		$this->password       = $password;
	}

	protected function getTransport() {
		if ($this->transport === null) {
			$this->transport = \Swift_SmtpTransport::newInstance($this->host, $this->port, $this->encryptionType);
			if ($this->username !== null) {
				$this->transport->setUsername($this->username);
			}
			if ($this->password !== null) {
				$this->transport->setPassword($this->password);
			}
			$this->transport->start();
		}

		return $this->transport;
	}

	public function setHost($host) {
		$this->host = $host;
		return $this;
	}

	public function setPort($port) {
		$this->port = $port;
		return $this;
	}

	public function setUsername($username) {
		$this->username = $username;
		return $this;
	}

	public function setPassword($password) {
		$this->password = $password;
		return $this;
	}

	public function setEncryptionType($encryptionType) {
		$this->encryptionType = $encryptionType;
		return $this;
	}

	public function send(EmailMessage $message) {
		$swiftMsg = \Swift_Message::newInstance();
		
		$swiftMsg->setFrom($message->getFrom());
		$swiftMsg->setTo($message->getTo());
		$swiftMsg->setBody($message->getBody());

		if ($message->getCc() !== null) {
			$swiftMsg->setCc($message->getCc());
		}

		if ($message->getBcc() !== null) {
			$swiftMsg->setBcc($message->getBcc());
		}

		if ($message->getReplyTo() !== null) {
			$swiftMsg->setReplyTo($message->getReplyTo());
		}

		if ($message->getCharset() !== null) {
			$swiftMsg->setCharset($message->getCharset());
		}

		if ($message->getPriority() !== null) {
			$swiftMsg->setPriority($message->getPriority());
		}

		if ($message->getContentType() !== null) {
			$swiftMsg->setContentType($message->getContentType());
		}

		if ($message->getSubject() !== null) {
			$swiftMsg->setSubject($message->getSubject());
		}

		foreach ($message->getParts() as $idx=>$part) {
			$swiftMsg->addPart($part['body'], $part['contentType'], $part['encoding']);
		}

		foreach ($message->getAttachments() as $idx=>$attachment) {
			if ($attachment->getData() !== null) {
				$swiftAttachment = \Swift_Attachment::newInstance();
				$swiftAttachment->setBody($attachment->getData());
			} else {
				$swiftAttachment = \Swift_Attachment::fromPath($attachment->getPath());
			}

			if ($attachment->getFilename() !== null) {
				$swiftAttachment->setFilename($attachment->getFilename());
			}

			if ($attachment->getContentType() !== null) {
				$swiftAttachment->setContentType($attachment->getContentType());
			}

			if ($attachment->getDisposition() !== null) {
				$swiftAttachment->setDisposition($attachment->getDisposition());
			}

			$swiftMsg->attach($swiftAttachment);
		}

		$this->getTransport()->send($swiftMsg);
	}
}

?>