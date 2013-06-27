<?php

namespace NP\core\notification;

/**
 * Interface for an email message
 *
 * @author Thomas Messier
 *
 * @method array                              getFrom()
 * @method \NP\core\notification\EmailMessage setFrom(mixed $address, string $name)
 * @method \NP\core\notification\EmailMessage addFrom(mixed $address, string $name)
 * @method array                              getTo()
 * @method \NP\core\notification\EmailMessage setTo(mixed $address, string $name)
 * @method \NP\core\notification\EmailMessage addTo(mixed $address, string $name)
 * @method array                              getCc()
 * @method \NP\core\notification\EmailMessage setCc(mixed $address, string $name)
 * @method \NP\core\notification\EmailMessage addCc(mixed $address, string $name)
 * @method array                              getBcc()
 * @method \NP\core\notification\EmailMessage setBcc(mixed $address, string $name)
 * @method \NP\core\notification\EmailMessage addBcc(mixed $address, string $name)
 * @method array                              getReplyTo()
 * @method \NP\core\notification\EmailMessage setReplyTo(mixed $address, string $name)
 * @method \NP\core\notification\EmailMessage addReplyTo(mixed $address, string $name)
 * @method string                             getCharset()
 * @method \NP\core\notification\EmailMessage setCharset(string $val)
 * @method int                                getPriority()
 * @method \NP\core\notification\EmailMessage setPriority(string $val)
 * @method string                             getContentType()
 * @method \NP\core\notification\EmailMessage setContentType(string $val)
 * @method string                             getSubject()
 * @method \NP\core\notification\EmailMessage setSubject(string $val)
 * @method string                             getBody()
 * @method \NP\core\notification\EmailMessage setBody(string $val)
 * @method array                              getTemplatePath()
 * @method array                              getParts()
 * @method array                              getAttachments()
 */
class EmailMessage {
	protected $from, $to, $cc, $bcc, $replyTo, $charset, $priority, $contentType, 
				$subject, $body, $templatePath, $parts = array(), $attachments = array();

	protected $validAddressTypes = array('from','to','cc','bcc','replyTo');
	protected $validSetterFields = array('charset','priority','contentType','subject','body');

	/**
	 * @param string $subject     Subject of the message
	 * @param string $body        Body of the message
	 * @param string $contentType Content type of the message, for example text/plain or text/html
	 * @param string $charset     Character set for the message
	 */
	public function __construct($subject=null, $body=null, $contentType='text/html', $charset=null) {
		$this->setSubject($subject);
		$this->setBody($body);
		$this->setContentType($contentType);
		$this->setCharset($charset);
	}

	/**
	 * Static method that returns an instance of a message. Simply a convenience function for easier chaining
	 *
	 * @param  string $subject     Subject of the message
	 * @param  string $body        Body of the message
	 * @param  string $contentType Content type of the message, for example text/plain or text/html
	 * @param  string $charset     Character set for the message
	 * @return \NP\core\notification\EmailMessage
	 */
	public static function getNew($subject=null, $body=null, $contentType='text/html', $charset=null) {
		return new self($subject, $body, $contentType, $charset);
	}

	/**
	 * Magic function to call getters, setters, and add functions
	 */
	public function __call($name, $arguments) {
		$prefix = substr($name, 0, 3);
		$field = lcfirst(substr($name, 3));

		if ($prefix == 'get') {
			return $this->$field;
		} else if (in_array($prefix, array('set','add')) && in_array($field, $this->validAddressTypes)) {
			$methodName = "{$prefix}Address";
			if (count($arguments) == 2) {
				return $this->$methodName($field, $arguments[0], $arguments[1]);
			} else if (count($arguments) == 1) {
				return $this->$methodName($field, $arguments[0]);
			} else {
				$field = ucfirst($field);
				throw new \NP\core\Exception("The {$prefix}{$field}() method takes either 1 or 2 arguments. " . count($arguments) . " were provided.");
			}
		} else if ($prefix == 'set' && in_array($field, $this->validSetterFields)) {
			if (count($arguments) != 1) {
				$field = ucfirst($field);
				throw new \NP\core\Exception("The {$prefix}{$field}() method takes only 1 argument. " . count($arguments) . " were provided.");
			}
			$this->$field = $arguments[0];
			return $this;
		} else {
			$field = ucfirst($field);
			throw new \NP\core\Exception("Unknown method called. The method {$prefix}{$field}() does not exist.");
		}
	}

	/**
	 * Generic function for setting addresses (for, from, to, cc, bcc, and replyTo)
	 *
	 * @param  string  $type    The type of address to save. Valid values are 'for', 'from', 'to', 'cc', 'bcc', and 'replyTo'
	 * @param  mixed   $address The email address to set. For multiple addresses, use an array (can be associative using name=>address pairs, value array with address, or mixed array)
     * @param  string  $name    If $address is a string, then this can be used as the name to associate to the email address (optional)
     * @return \NP\core\notification\EmailMessage
	 */
	protected function setAddress($type, $address, $name=null) {
		$this->validateAddressType($type);

		if (!is_array($address)) {
    		if (isset($name)) {
            	$address = array($address => $name);
            } else {
            	$address = array($address);
            }
        }
        $this->$type = $address;

        return $this;
	}

	/**
	 * Generic function for setting addresses (for from, to, cc, bcc, and replyTo)
	 *
	 * @param  string  $type    The type of address to save. Valid values are 'for', 'from', 'to', 'cc', 'bcc', and 'replyTo'
	 * @param  string  $address The email address to set.
     * @param  string  $name    Name to associate to the email address (optional)
     * @return \NP\core\notification\EmailMessage
	 */
	protected function addAddress($type, $address, $name=null) {
		$this->validateAddressType($type);

		if ($this->$type === null) {
			$this->$type = array();
		}
		$this->$type[$address] = $name;

		return $this;
	}
	
	/**
	 * Validates a type of address
	 *
	 * @param string $type The type of address to be validated
	 */
	protected function validateAddressType($type) {
		if (!in_array($type, $this->validAddressTypes)) {
			throw new \NP\core\Exception('Invalid address type. Valid types are ' . implode(',', $this->validAddressTypes));
		}
	}

	/**
	 * Adds a part to the message. For example, you can use this function to add a text/plain part to a message
	 * that has a content type of text/html.
	 *
	 * @param  string $body
	 * @param  string $contentType
	 * @param  string $charset
	 * @return \NP\core\notification\EmailMessage
	 */
	public function addPart($body, $contentType=null, $charset=null) {
		$this->parts[] = array('body'=>$body, 'contentType'=>$contentType, 'charset'=>$charset);
		return $this;
	}

	/**
	 * Adds an attachment to the message
	 *
	 * @param  \NP\core\notification\EmailAttachment $attachment
	 * @return \NP\core\notification\EmailMessage
	 */
	public function attach(EmailAttachment $attachment) {
		$this->attachments[] = $attachment;
		return $this;
	}

	/**
	 * Allows for adding a template to be used to compile a message based on certain data
	 *
	 * @param  string $path Full path for the template
	 * @return \NP\core\notification\EmailMessage
	 */
	public function setTemplatePath($path) {
		if (!file_exists($path)) {
			throw new \NP\core\Exception("Invalid template file path. File '{$path}' was not found.");
		}
		$this->templatePath = $path;

		return $this;
	}

	/**
	 * Uses the template set to compile the body of the message based on the data passed
	 *
	 * @param  array $data Data to be used by the template
	 * @return \NP\core\notification\EmailMessage
	 */
	public function compile($data) {
		ob_start();

        extract($data);
        include $this->templatePath;

        $content = ob_get_contents();
        ob_end_clean();

        $this->setBody($content);

        return $this;
	}

}

?>