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
		'noRecordFoundError'            => 'No record found with value of',
		'glAssignmentError'             => 'There was an error saving GL Assignments',
		'userAssignmentError'           => 'There was an error saving user assignments',
		'fiscalCalSaveError'            => 'There was an error saving fiscal calendars',
		'unitSaveError'                 => 'There was an error saving units',
		'unitTypeSaveError'             => 'There was an error saving unit types',
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
		
		// Imports
		'importFieldAccountTypeError'            => 'Error import field Account Type',
		'importFieldCategoryNameError'           => 'Category already exists',
		'importFieldIntegrationPackageNameError' => 'Integration Package was not found',
		'importFieldGLAccountNameError'          => 'GL Account number was not found',
		'importFieldGlAccounTypeError'           => 'Account Type was not found',
		'importFieldDependentIntPkgError'        => 'This field could not be validated because Integration Package is invalid',
		'importFieldGLCategoryError'             => 'Category Name was not found',
		'importFieldRegionError'                 => 'Error import field Region',
		'importFieldStateError'                  => 'State was not found',
		'importFieldZipError'                    => 'Zip code is invalid',
		'importFieldPhoneError'                  =>	'Phone number is invalid',
		'importFieldFaxError'                    =>	'Fax is invalid',
		'importFieldClosingCalendarError'        => 'Error import field Closing Calendar',
		'importFieldPropertyCodeError'           => 'Property code was not found',
		'importFieldPropertyGlExistsError'       => 'Property assignment already exists',
		'importFieldUnitTypeError'               => 'Unit type not found',
		'importFieldUnitExistsError'             => 'Unit already exists',
		'importFieldUnitError'                   => 'Unit not found',
		'importFieldUnitTypeExistsError'         => 'Unit type already exists',
		'importFieldVendorCodeError'             => 'Vendor not found',
		'importFieldVendorGlExistsError'         => 'Vendor GL already exists',
		'importFieldVendorFavoriteExistsError'   => 'Vendor Favorite already exists',
		'importFieldUsernameUniqueError'         => 'Username already exists',
		'importFieldPropertyUserExistsError'     => 'User Property assignment already exists',
		'importFieldSplitExistsError'            => 'Split already exists',
		'importFieldSplitPercentError'           => 'Split percents don\'t add up to 100%',
		'importFieldSplitIntPkgError'            => 'All lines for a split must be for the same integration package',
		'importFieldSplitVendorError'            => 'All lines for a split must be for the same vendor',
		'importFieldLengthError'                 => 'This field has exceeded the maximum character limit of',
		'importFieldOptionError'                 => 'The following value is invalid for this custom field',
		'importGlobalError'                      => 'Invalid record',
		'importRecordSaveError'                  => 'There was an error saving a record for row',
		'uploadFileCSVEmptyError'                => 'The CSV file contains no records',
		'uploadFileCSVFormatError'               => 'The format of the CSV file is incorrect',

		// Utility Setup section
		'utilityExists' => 'This vendor is already setup for utilities. Please update that record instead.'
    );
}

?>
