<?php

namespace NP\core\notification;

/**
 * Class for an email message attachment
 *
 * @author Thomas Messier
 */
class EmailAttachment {
	protected $path, $filename, $contentType, $data, $disposition;

	/**
	 * Sets the disposition to 'attachment' and content type to 'application/octet-stream' by default.
	 *
	 * @param string $path Optional path to initialize the object with
	 */
	public function __construct($path=null) {
		$this->setPath($path);
		$this->setDisposition('attachment');
		$this->setContentType('application/octet-stream');
	}

	/**
	 * Static function for getting a new instance. Convenience function for easier chaining
	 *
	 * @param  string $path Optional path to initialize the object with
	 * @return NP\core\notification\EmailAttachment
	 */
	public static function getNew($path=null) {
		return new self($path);
	}

	/**
	 * Sets the file path for the attachment. Note that the path will be ignored if setData() is used.
 	 *
	 * @param  string $path
	 * @return NP\core\notification\EmailAttachment
	 */
	public function setPath($path) {
		if ($this->getData() === null) {
			if ($path !== null && !file_exists($path)) {
				throw new \NP\core\Exception("Invalid attachment file path. File '{$path}' was not found.");
			}
			$this->path = $path;
		}
		return $this;
	}

	/**
	 * Gets the file path for the attachment
 	 *
	 * @return string
	 */
	public function getPath() {
		return $this->path;
	}

	/**
	 * Sets the file name for the attachment (in case you want a different name than the file you are attaching)
 	 *
	 * @param  string $filename
	 * @return NP\core\notification\EmailAttachment
	 */
	public function setFilename($filename) {
		$this->filename = $filename;
		return $this;
	}

	/**
	 * Gets the filename for the attachment
 	 *
	 * @return string
	 */
	public function getFilename() {
		return $this->filename;
	}

	/**
	 * Sets the content type of the attachment
 	 *
	 * @param  string $contentType
	 * @return NP\core\notification\EmailAttachment
	 */
	public function setContentType($contentType) {
		$this->contentType = $contentType;
		return $this;
	}

	/**
	 * Gets the content type for the attachment
 	 *
	 * @return string
	 */
	public function getContentType() {
		return $this->contentType;
	}

	/**
	 * Sets the data for the attachment. If this is set, any path set on the attachment will be removed
 	 *
	 * @param  binary $data
	 * @return NP\core\notification\EmailAttachment
	 */
	public function setData($data) {
		if ($this->getPath() !== null) {
			$this->setPath(null);
		}
		$this->data = $data;
		return $this;
	}

	/**
	 * Gets the data for the attachment
 	 *
	 * @return binary
	 */
	public function getData() {
		return $this->data;
	}

	/**
	 * Sets the disposition for the attachment.
 	 *
	 * @param  string $disposition Valid values are 'attachment' and 'inline'
	 * @return NP\core\notification\EmailAttachment
	 */
	public function setDisposition($disposition) {
		if (!in_array($disposition, array('attachment','inline'))) {
			throw new \NP\core\Exception('Invalid disposition type. Valid disposition values are "attachment" and "inline"');
		}
		$this->disposition = $disposition;
		return $this;
	}

	/**
	 * Gets the content disposition for the attachment
 	 *
	 * @return string
	 */
	public function getDisposition() {
		return $this->disposition;
	}
}

?>