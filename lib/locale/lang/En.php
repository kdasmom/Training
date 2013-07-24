<?php

namespace NP\locale\lang;

/**
 * Dictionary for English language
 *
 * @author Thomas Messier
 */
class En extends \NP\locale\Dictionary {
	protected $messages = array(
		'unexpectedError'               => 'Unexpected error. Please contact your system administrator.',
		'requiredFieldError'            => 'This field is required',
		'glAssignmentError'             => 'There was an error saving GL Assignments',
		'userAssignmentError'           => 'There was an error saving user assignments',
		'fiscalCalSaveError'            => 'There was an error saving fiscal calendars',
		'duplicateFiscalCalError'       => 'There is already a Fiscal Calendar with that name and year. Please select a different date and/or year.',
		'propertyAssignmentError'       => 'There was an error saving property assignments',
		'codingPropertyAssignmentError' => 'There was an error saving coding property assignments',
		'duplicateUsernameError'        => 'The username entered is already in use by another user',
		'incorrectPasswordError'        => 'The password entered was incorrect',
		'passwordMatchError'            => 'The password fields need to match',
		'duplicateMobileNumberError'    => 'This mobile number is already in use by another user. Please enter another number.',
		'noDelegationPropertyError'     => 'You must delegate at least one property.',
		'duplicateGroupNameError'       => 'The group name entered is already in use',
		'authenticationFailedError'     => 'Authentication failed',
		'invalidUsernamePasswordError'  => 'Username or password is incorrect. Please try again.',

		// FileUpload errors
		'uploadMaxSizeError'          => 'File exceeds maximum allowed size',
		'uploadIncompleteUploadError' => 'File was not uploaded completely',
		'uploadMissingFileError'      => 'You must select a file to upload',
		'uploadTempFolderError'       => 'Missing a temporary folder',
		'uploadFailedWriteError'      => 'Failed to write file to disk',
		'uploadExtensionError'        => 'File upload was stopped by an extension',
		'uploadFileTypeError'         => 'The file type you tried to upload is not allowed',
		'uploadFileMoveError'         => 'Failed to move the file',
	);
}

?>