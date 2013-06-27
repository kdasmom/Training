<?php

namespace NP\core\notification;

/**
 * Interface for an emailer
 *
 * @author Thomas Messier
 */
interface EmailerInterface {
	
	public function __construct($host=null, $port=null, $encryptionType=null, $username=null, $password=null);
	public function setHost($host);
	public function setPort($port);
	public function setUsername($username);
	public function setPassword($password);
	public function setEncryptionType($encryptionType);
	public function send(EmailMessage $message);
}

?>