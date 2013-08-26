<?php

namespace NP\locale;

/**
 * Abstract dictionary class; extend this class for each language you want to add to the application
 *
 * @author Thomas Messier
 */
abstract class Dictionary {
	protected $messages;

	public function __construct($messages=null) {
		if ($messages !== null) {
			$this->messages = $messages;
		}
	}

	public function setMessages($messages) {
		$this->messages = $messages;
	}

	public function getMessages() {
		return $this->messages;
	}

	public function getMessage($messageName) {
		return array_keys($this->messages, $messageName)?$this->messages[$messageName]:$messageName;
	}

	public function messageExists($messageName) {
		return array_key_exists($this->messages, $messageName);
	}
}
