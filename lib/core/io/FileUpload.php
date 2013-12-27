<?php

namespace NP\core\io;

/**
 * This class can be used to manage file uploads
 * 
 * @author Thomas Messier
 */
class FileUpload {
	
	/**
	 * @var array Attributes of the uploaded file
	 */
	protected $file = array();
	/**
	 * @var array Optional options
	 */
	protected $options;
	/**
	 * @var array Lost of errors that occurred when trying to upload the file
	 */
	protected $errors = array();
	/**
	 * @var boolean Whether or not the file had to be renamed when uploaded
	 */
	protected $isRenamed = false;

	/**
	 * @param string $fieldName   The name of the file field in the HTML form
	 * @param string $destination The destination directory for the file; must be a directory, cannot be a directory with file name
	 * @param array  $options     Associative array with additional options; valid keys are "allowedTypes" (valid mime types), "maxSize" (maximum file size allowed), "fileName" (name of the file if you want it changed form the original), and "overwrite" (if you want to overwrite existing file or not)
	 */
	public function __construct($fieldName, $destination, $options=array()) {
		if (!is_dir($destination)) {
			throw new \NP\core\Exception('Invalid upload directory.');
		}

		if (!array_key_exists($fieldName, $_FILES)) {
			throw new \NP\core\Exception('No upload file for the field name provided.');
		}

		$this->destination = $destination;

		if (!array_key_exists('required', $options)) {
			$options['required'] = true;
		}
		$this->options = $options;

		// Store uploaded file parameters
		foreach($_FILES[$fieldName] as $key=>$value) {
			$this->file[$key] = $value;
		}
	}

	/**
	 * Returns the file object for this file upload
	 * @return array
	 */
	public function getFile() {
		return $this->file;
	}

	/**
	 * Checks if the file upload is valid or not
	 *
	 * @return boolean
	 */
	protected function isValid() {
		switch($this->file['error']) {
			case UPLOAD_ERR_INI_SIZE:
				$this->errors[] = 'uploadMaxSizeError';
				break;
			case UPLOAD_ERR_FORM_SIZE:
				$this->errors[] = 'uploadMaxSizeError';
				break;
			case UPLOAD_ERR_PARTIAL:
				$this->errors[] = 'uploadIncompleteUploadError';
				break;
			case UPLOAD_ERR_NO_FILE:
				if ($this->options['required']) {
					$this->errors[] = 'uploadMissingFileError';
				}
				break;
			case UPLOAD_ERR_NO_TMP_DIR:
				$this->errors[] = 'uploadTempFolderError';
				break;
			case UPLOAD_ERR_CANT_WRITE:
				$this->errors[] = 'uploadFailedWriteError';
				break;
			case UPLOAD_ERR_EXTENSION:
				$this->errors[] = 'uploadExtensionError';
				break;
		}

		if (!count($this->errors)) {
			if ($this->file['name'] != '') {
				if ( array_key_exists('allowedTypes', $this->options) && !in_array($this->file['type'], $this->options['allowedTypes']) ) {
					$this->errors[] = 'uploadFileTypeError';
				}

				if ( array_key_exists('maxSize', $this->options) && $this->size > $this->options['maxSize'] ) {
					$this->errors[] = 'uploadMaxSizeError';
				}
			}
		}

		return (count($this->errors) == 0) ? true : false;
	}

	/**
	 * Uploads the file to the specified location
	 *
	 * @return boolean Returns true if file upload was successful
	 */
	public function upload() {
		$success = $this->isValid();
		if ($success && $this->file['name'] != '') {
			// If the fileName option is specified, use it
			$filePath = (array_key_exists('fileName', $this->options)) ? $this->options['fileName'] : $this->file['name'];
			$this->file['uploaded_name'] = $filePath;
			$filePath = $this->destination . '/' . $filePath;

			// If overwrite option is set to false, we need to make the file name unique
			if (file_exists($filePath) && array_key_exists('overwrite', $this->options) && !$this->options['overwrite']) {
				// We'll append _$i at the end of the file name until we get a unique name
				$i = 1;
				while(file_exists($filePath)){
					$fileName = explode('.', $this->file['name']);
					$fileExt = $fileName[1];
					$fileName = "{$fileName[0]}_{$i}";
				    $filePath = "{$this->destination}/{$fileName}.{$fileExt}";
				    $i++;
				}
				$this->file['uploaded_name'] = "{$fileName}.{$fileExt}";
				$this->isRenamed = true;
			}
			
			// Move the uploaded file to the desired location
			$success = move_uploaded_file($this->file["tmp_name"], $filePath);
			if (!$success) {
				$this->errors[] = 'uploadFileMoveError';
			}
		}

		return $success;
	}

	/**
	 * Returns errors that occurred when trying to upload the file, if any
	 *
	 * @return array
	 */
	public function getErrors() {
		return $this->errors;
	}

	/**
	 * Indicates whether or not the file had to be renamed when uploaded because an existing file was found
	 * (only applies if overwrite option is set to false)
	 *
	 * @return boolean
	 */
	public function isUploadRenamed() {
		return $this->isRenamed;
	}

}

?>