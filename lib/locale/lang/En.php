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
		'emailNotificationFooter'       => '<br /><br />Thank you very much,<br />
NexusPayables Support
<br /><br />
Please do not reply to this message. Please contact your administrator if you have technical questions.',

		// FileUpload errors
		'uploadMaxSizeError'          => 'File exceeds maximum allowed size',
		'uploadIncompleteUploadError' => 'File was not uploaded completely',
		'uploadMissingFileError'      => 'You must select a file to upload',
		'uploadTempFolderError'       => 'Missing a temporary folder',
		'uploadFailedWriteError'      => 'Failed to write file to disk',
		'uploadExtensionError'        => 'File upload was stopped by an extension',
		'uploadFileTypeError'         => 'The file type you tried to upload is not allowed',
		'uploadFileMoveError'         => 'Failed to move the file',

		// Mobile Settings
		'noEmailSetupError'        => 'A user must have an email address setup in order to add a mobile device.',
		'mobileDeviceEmailSubject' => 'Mobile Registration Email Notification',
		'mobileDeviceEmailBody'    => 'Thank you for registering your mobile device, $mobinfo_phone, for approval of items in NexusPayables.<br />
This email serves as confirmation that your device has been successfully registered.<br />
Please remember to revisit your Mobile settings if you should change or lose your device.
<br /><br />
If you have any questions, please do not hesitate to contact us.
<br /><br />
Regards,
<br /><br />
Nexus Systems',

		// Delegation
		'newDelegationEmailSubject' => 'New Delegation',
		'newDelegationEmailBody'    => 'This message is to notify you that a delegation has been setup from  <strong>$person_firstname $person_lastname ($userprofile_username)</strong>.
to <strong>$to_person_firstname $to_person_lastname ($to_userprofile_username)</strong>
The delegation starts on <strong>$delegation_startdate</strong>
and ends on <strong>$delegation_stopdate</strong>.
<br /><br />
The following properties have been delegated: $property_name_list.',
                'importFieldAccountTypeError' => 'Error import field Account Type',
                'importFieldCategoryNameError' => 'Error import field Category Name',
                'importFieldIntegrationPackageNameError' => 'Error import field Integration Package Name',
                'importFieldGLAccountNameError' => 'Error import field GLAccount Name',
                'uploadFileCSVFormatError' => 'File upload was stopped by not correct format upload CSV file for '
            );
}

?>