/**
 * TOP MENU
 */

// Validation messages
Ext.define('Ext.locale.en.data.validations', {
	override: 'Ext.data.validations',

	presenceMessage : 'This field is required',
	lengthMessage   : 'This field is the wrong length',
	formatMessage   : 'This field is the wrong format',
	inclusionMessage: 'This field is not included in the list of valid values',
	exclusionMessage: 'This field is not an valid value',
	emailMessage    : 'This field is not a valid email address',
	passwordMessage : 'Password needs to have at least on letter, one number, one special character, and be 6 characters or more',
	digitsMessage   : 'This field only accepts digits',
	numericMessage  : 'This field must be a number'
});

// Vendor Catalog Menu
Ext.define('NP.locale.en.view.viewport.VCMenu', {
	override: 'NP.view.viewport.menu.VCMenu',

	vcText        : 'Vendor Catalog',
	listingsText  : 'Vendor Catalog Listings',
	openOrdersText: 'Open Orders',
	favoritesText : 'Favorite Items'
});

// PO Menu
Ext.define('NP.locale.en.view.viewport.POMenu', {
	override: 'NP.view.viewport.menu.POMenu',

	poText                      : 'Purchase Orders',
	registerText                : 'PO Register',
	registerOpenText            : 'Open',
	registerTemplateText        : 'Template',
	registerPendingText         : 'Pending',
	registerApprovedText        : 'Approved',
	registerInvoicedText        : 'Invoiced',
	registerRejectedText        : 'Rejected',
	registerCancelledText       : 'Cancelled',
	receiptRegisterText         : 'Receipt Register',
	receiptRegisterOpenText     : 'Open',
	receiptRegisterRejectedText : 'Rejected',
	receiptRegisterPendingText  : 'Pending Approval',
	receiptRegisterPendingstText: 'Pending Post Approval',
	receiptRegisterApprovedText : 'Approved',
	newText                     : 'New PO',
	searchText                  : 'Search POs'
});

// Invoice Menu
Ext.define('NP.locale.en.view.viewport.InvoiceMenu', {
	override: 'NP.view.viewport.menu.InvoiceMenu',

	invoiceText            : 'Invoices',
	registerText           : 'Invoice Register',
	registerOpenText       : 'Open',
	registerOverdueText    : 'Overdue',
	registerTemplateText   : 'Template',
	registerHoldText       : 'On Hold',
	registerPendingText    : 'Pending',
	registerApprovedText   : 'Approved',
	registerSubmittedText  : 'Submitted for Payment',
	registerTransferredText: 'Transferred to GL',
	registerPaidText       : 'Paid',
	registerVoidText       : 'Void',
	registerRejectedText   : 'Rejected',
	newText                : 'New Invoice',
	searchText             : 'Search Invoices'
});

// Vendor Menu
Ext.define('NP.locale.en.view.viewport.VendorMenu', {
	override: 'NP.view.viewport.menu.VendorMenu',

	vendorText      : 'Vendors',
    newText         : 'New Vendor',
    searchText      : 'Search Vendors',
    connectUsersText: 'VendorConnect Users'
});

// Image Menu
Ext.define('NP.locale.en.view.viewport.ImageMenu', {
	override: 'NP.view.viewport.menu.ImageMenu',

	imgText       : 'Image Management',
	indexedText   : 'Images To Be Indexed',
	invoiceText   : 'Invoice Images',
	pOText        : 'Purchase Order Images',
	searchText    : 'Search Images',
	exceptionsText: 'Exceptions'
});

// Budget Menu
Ext.define('NP.locale.en.view.viewport.BudgetMenu', {
	override: 'NP.view.viewport.menu.BudgetMenu',

	budgetText  : 'Budget',
	atGlanceText: 'At-a-Glance',
	searchText  : 'Budget Search'
});

// Report Menu
Ext.define('NP.locale.en.view.viewport.ReportMenu', {
	override: 'NP.view.viewport.menu.ReportMenu',

	requires: ['NP.lib.core.Config'],

	reportText        : 'Reports',
	customText        : 'Custom Reports',
	customOverviewText: 'Overview',
	customSystemText  : 'System Saved Reports',
	customMyText      : 'My Saved Reports',
	pOText            : 'PO Register Reports',
	receiptText       : 'Receipt Reports',
	invoiceText       : 'Invoice Register Reports',
	jobText           : 'Job Costing Reports',
	utilityText       : 'Utility Reports',
	vendorText        : 'Vendor History Reports',
	budgetText        : NP.lib.core.Config.getSetting('pn.budget.BudgetForecastLabel') + 's',
	adminText         : 'Admin Reports'
});

// Admin Menu
Ext.define('NP.locale.en.view.viewport.AdminMenu', {
	override: 'NP.view.viewport.menu.AdminMenu',

	requires: ['NP.lib.core.Config'],

	adminText          : 'Administration',
	mySettingsText     : 'My Settings',
	userText           : 'User Manager',
	messageText        : 'Message Center',
	integrationText    : 'Integration',
	propertyText       : NP.lib.core.Config.getSetting('PN.main.PropertyLabel', 'Property') + ' Setup',
	systemText         : 'System Setup',
	gLText             : 'GL Account Setup',
	catalogText        : 'Catalog Maintenance',
	importText         : 'Import/Export Utility',
	importOverviewText : 'Overview',
	importGLText       : 'GL',
	importPropertyText : NP.lib.core.Config.getSetting('PN.main.PropertyLabel', 'Property'),
	importVendorText   : 'Vendor',
	importInvoiceText  : 'Invoice',
	importUserText     : 'User',
	importCustomText   : 'Custom Field',
	importSplitsText   : 'Splits',
	approvalBudgetsText: 'Set Approval Budget Overage',
	utilityText        : 'Utility Setup',
	mobileText         : 'Mobile Setup'
});

/**
 * TOP TOOLBAR
 */
Ext.define('NP.locale.en.view.viewport.DelegationPicker', {
	override: 'NP.view.viewport.DelegationPicker',
	
	signedOnText: 'You are signed on as'
});

/**
 * CONTEXT PICKER
 */
Ext.define('NP.locale.en.view.shared.ContextPicker', {
	override: 'NP.view.shared.ContextPicker',
	
	requires: ['NP.lib.core.Config'],

	propertyComboText       : NP.lib.core.Config.getSetting('PN.main.PropertyLabel'),
    regionComboText         : NP.lib.core.Config.getSetting('PN.Main.RegionLabel'),
    currentPropertyRadioText: 'Current ' + NP.lib.core.Config.getSetting('PN.main.PropertyLabel'),
    regionRadioText         : NP.lib.core.Config.getSetting('PN.Main.RegionLabel'),
    allPropertiesRadioText  : 'All ' + NP.lib.core.Config.getSetting('PN.Main.PropertiesLabel')
});

/**
 * ADDRESS BLOCK
 */
Ext.define('NP.locale.en.view.shared.Address', {
	override: 'NP.view.shared.Address',

	streetFieldText: 'Street',
    cityFieldText  : 'City',
    stateFieldText : 'State',
    zipFieldText   : 'Zip'
});

/**
 * BUTTONS
 */
Ext.define('NP.locale.en.view.shared.button.Activate', {
	override: 'NP.view.shared.button.Activate',

	text: 'Activate'
});

Ext.define('NP.locale.en.view.shared.button.Back', {
	override: 'NP.view.shared.button.Back',

	text: 'Back'
});

Ext.define('NP.locale.en.view.shared.button.Camera', {
	override: 'NP.view.shared.button.Camera',

	text: 'Camera'
});

Ext.define('NP.locale.en.view.shared.button.Cancel', {
	override: 'NP.view.shared.button.Cancel',

	text: 'Cancel'
});

Ext.define('NP.locale.en.view.shared.button.Delete', {
	override: 'NP.view.shared.button.Delete',

	text: 'Delete'
});

Ext.define('NP.locale.en.view.shared.button.Edit', {
	override: 'NP.view.shared.button.Edit',

	text: 'Edit'
});

Ext.define('NP.locale.en.view.shared.button.Hourglass', {
	override: 'NP.view.shared.button.Hourglass',

	text: 'Place On Hold'
});

Ext.define('NP.locale.en.view.shared.button.Inactivate', {
	override: 'NP.view.shared.button.Inactivate',

	text: 'Inactivate'
});

Ext.define('NP.locale.en.view.shared.button.New', {
	override: 'NP.view.shared.button.New',

	text: 'New'
});

Ext.define('NP.locale.en.view.shared.button.Save', {
	override: 'NP.view.shared.button.Save',

	text: 'Save'
});

Ext.define('NP.locale.en.view.shared.button.SaveAndAdd', {
	override: 'NP.view.shared.button.SaveAndAdd',

	text: 'Save And Add Another'
});

Ext.define('NP.locale.en.view.shared.button.Upload', {
	override: 'NP.view.shared.button.Upload',

	text: 'Upload'
});

Ext.define('NP.locale.en.view.shared.button.View', {
	override: 'NP.view.shared.button.View',

	text: 'View'
});

/**
 * VIEWPORT
 */

// Home
Ext.define('NP.locale.en.view.viewport.Home', {
	override: 'NP.view.viewport.Home',

	title          : 'Home',
	summaryStatText: 'Summary Statistics'
});

// Summary Stat Names
Ext.define('NP.locale.en.store.system.SummaryStats', {
	override: 'NP.store.system.SummaryStats',

	invoicesToApproveText: 'Invoices to Approve',
	invoicesOnHoldText   : 'Invoices on Hold',
	invoicesCompletedText: 'Completed Invoices to Approve',
	invoicesRejectedText : 'Rejected Invoices',
	invoicesMyText       : 'My Invoices'
});

/**
 * GRID COLUMNS
 */

Ext.define('NP.locale.en.view.shared.gridcol.InvoiceAmount', {
	override: 'NP.view.shared.gridcol.InvoiceAmount',

	text: 'Amount'
});

Ext.define('NP.locale.en.view.shared.gridcol.InvoiceDate', {
	override: 'NP.view.shared.gridcol.InvoiceDate',

	text: 'Date'
});

Ext.define('NP.locale.en.view.shared.gridcol.InvoiceDaysOnHold', {
	override: 'NP.view.shared.gridcol.InvoiceDaysOnHold',

	text: 'Number of Days On Hold'
});

Ext.define('NP.locale.en.view.shared.gridcol.InvoiceDueDate', {
	override: 'NP.view.shared.gridcol.InvoiceDueDate',

	text: 'Due Date'
});

Ext.define('NP.locale.en.view.shared.gridcol.InvoiceHoldDate', {
	override: 'NP.view.shared.gridcol.InvoiceHoldDate',

	text: 'On Hold Date'
});

Ext.define('NP.locale.en.view.shared.gridcol.InvoiceNeededByDate', {
	override: 'NP.view.shared.gridcol.InvoiceNeededByDate',

	text: 'Needed By'
});

Ext.define('NP.locale.en.view.shared.gridcol.InvoiceNumber', {
	override: 'NP.view.shared.gridcol.InvoiceNumber',

	text: 'Invoice Number'
});

Ext.define('NP.locale.en.view.shared.gridcol.InvoiceOnHoldBy', {
	override: 'NP.view.shared.gridcol.InvoiceOnHoldBy',

	text: 'On Hold By'
});

Ext.define('NP.locale.en.view.shared.gridcol.InvoicePendingDays', {
	override: 'NP.view.shared.gridcol.InvoicePendingDays',

	text: 'Days Pending'
});

Ext.define('NP.locale.en.view.shared.gridcol.InvoicePeriod', {
	override: 'NP.view.shared.gridcol.InvoicePeriod',

	text: 'Post Date'
});

Ext.define('NP.locale.en.view.shared.gridcol.PriorityFlag', {
	override: 'NP.view.shared.gridcol.PriorityFlag',

	text: 'Priority'
});

Ext.define('NP.locale.en.view.shared.gridcol.VendorName', {
	override: 'NP.view.shared.gridcol.VendorName',

	text: 'Vendor'
});


/**
 * INVOICE SECTION
 */

// Invoice Register
Ext.define('NP.locale.en.view.invoice.Register', {
	override: 'NP.view.invoice.Register',

	titleText             : 'Invoice Register',
	getPOBtnText          : 'Get PO',
	newInvoiceBtnText     : 'New Invoice',
	reportsBtnText        : 'Invoice Reports',
	searchBtnText         : 'Search',
	receiptRegisterBtnText: 'Receipt Register',
	openTabText           : 'Open',
	rejectedTabText       : 'Rejected',
	overdueTabText        : 'Overdue',
	templateTabText       : 'Template',
	holdTabText           : 'On Hold',
	templateTabText       : 'Template',
	pendingTabText        : 'Pending',
	approvedTabText       : 'Approved',
	submittedTabText      : 'Submitted for Payment',
	transferredTabText    : 'Transferred to GL',
	paidTabText           : 'Paid',
	voidTabText           : 'Void'
});

Ext.define('NP.locale.en.view.invoice.Register', {
	override: 'NP.view.invoice.Register',

	titleText             : 'Invoice Register',
	getPOBtnText          : 'Get PO',
	newInvoiceBtnText     : 'New Invoice',
	reportsBtnText        : 'Invoice Reports',
	searchBtnText         : 'Search',
	receiptRegisterBtnText: 'Receipt Register'
});

// Abstract register grid
Ext.define('NP.locale.en.view.invoice.AbstractRegisterGrid', {
	override: 'NP.view.invoice.AbstractRegisterGrid',

	vendorColumnText  : 'Vendor',
	amountColumnText  : 'Amount',
	propertyColumnText: NP.lib.core.Config.getSetting('PN.main.PropertyLabel'),
	numberColumnText  : 'Invoice Number',
	dateColumnText    : 'Invoice Date'
});

// Open register grid
Ext.define('NP.locale.en.view.invoice.grid.RegisterOpen', {
	override: 'NP.view.invoice.grid.RegisterOpen',

	title: 'Open'
});

// Rejected register grid
Ext.define('NP.locale.en.view.invoice.grid.RegisterRejected', {
	override: 'NP.view.invoice.grid.RegisterRejected',

	title: 'Rejected'
});

// Rejected register grid
Ext.define('NP.locale.en.view.invoice.grid.RegisterApproved', {
	override: 'NP.view.invoice.grid.RegisterApproved',

	title: 'Approved'
});

// Rejected register grid
Ext.define('NP.locale.en.view.invoice.grid.RegisterOnHold', {
	override: 'NP.view.invoice.grid.RegisterOnHold',

	title: 'On Hold'
});

// Rejected register grid
Ext.define('NP.locale.en.view.invoice.grid.RegisterOverdue', {
	override: 'NP.view.invoice.grid.RegisterOverdue',

	title: 'Overdue'
});

// Rejected register grid
Ext.define('NP.locale.en.view.invoice.grid.RegisterPaid', {
	override: 'NP.view.invoice.grid.RegisterPaid',

	title: 'Paid'
});

// Rejected register grid
Ext.define('NP.locale.en.view.invoice.grid.RegisterPending', {
	override: 'NP.view.invoice.grid.RegisterPending',

	title: 'Pending'
});

// Rejected register grid
Ext.define('NP.locale.en.view.invoice.grid.RegisterSubmitted', {
	override: 'NP.view.invoice.grid.RegisterSubmitted',

	title: 'Submitted for Payment'
});

// Rejected register grid
Ext.define('NP.locale.en.view.invoice.grid.RegisterTemplate', {
	override: 'NP.view.invoice.grid.RegisterTemplate',

	title: 'Template'
});

// Rejected register grid
Ext.define('NP.locale.en.view.invoice.grid.RegisterTransferred', {
	override: 'NP.view.invoice.grid.RegisterTransferred',

	title: 'Transferred to GL'
});

// Rejected register grid
Ext.define('NP.locale.en.view.invoice.grid.RegisterVoid', {
	override: 'NP.view.invoice.grid.RegisterVoid',

	title: 'Void'
});

/**
 * MY SETTINGS SECTION
 */
Ext.define('NP.locale.en.controller.MySettings', {
	override: 'NP.controller.MySettings',

	changesSavedText                : 'Changes saved successfully',
	errorDialogTitleText            : 'Error',
	registerNewDeviceDialogTitleText: 'Register New Device?',
	registerNewDeviceDialogText     : 'Registering a new device will disable the active one. Do you still want to proceed anyway?',
	disableMobileDialogTitleText    : 'Disable Mobile Number?',
	disableMobileDialogText         : 'Are you sure you want to disable this mobile number?',
	cancelDelegDialogTitleText      : 'Cancel Delegation?',
	cancelDelegDialogText           : 'Are you sure you want to cancel this delegation?',
	activeDelegErrorTitleText       : 'Active Delegation',
	activeDelegErrorText            : 'You have an active delegation. You cannot delegate to another user until that delegation expires or is cancelled.'
});

Ext.define('NP.locale.en.view.mySettings.Overview', {
	override: 'NP.view.mySettings.Overview',

	introText         : 'My Settings allows users to change their personal user information as well as manage certain system settings. The following tabs contain information to allow the user to manage the following information:',
	userInfoText      : '<b>User Information</b> - allows the user to change their password and update personal information such as their contact information and email address.',
	settingsText      : '<b>Settings</b> - allows the user to configure their dashboard default settings of what property they want to automatically log into as well as what summary statistic they want to auto display.',
	displayText       :  '<b>Display</b> - allows the user to choose which default percentage setting they want to view on split screen views.  Note this is only applicable for users with access to view images in the system.',
	emailNotifText    : '<b>Email Notification</b>- allows the user to manage specific email alert frequencies for Purchase Orders and/or Invoices that require approval and for budget overage notifications.',
	mobileSettingsText: '<b>Mobile Settings</b>- allows users to register their mobile phone to begin using the Mobile Application for PO, Receipt and Invoice approvals. If you do not see this tab display, your role right has not been granted access to this section.',
	userDelegText     : '<b>User Delegation</b> - allows the user to delegate approval authority to another user while they are away.  Please note this will appear only on the Settings tab and for users who have been given rights to this functionality.'
});

Ext.define('NP.locale.en.view.mySettings.Display', {
	override: 'NP.view.mySettings.Display',

	title                      : 'Display',
	viewingSizeLabelText       : 'Split Screen Viewing Size',
	customBoxText              : 'Custom',
	viewingOrientationLabelText: 'Split Screen Viewing Orientation',
	verticalLabelText          : 'Vertical',
	horizontalLabelText        : 'Horizontal',
	imagePositionLabelText     : 'Split Screen Image Position',
	leftPositionText           : 'Left (Bottom for Horizontal View)',
	rightPositionText          : 'Right (Top for Horizontal View)',
	defaultViewLabelText       : 'Default View',
	splitScreenViewText        : 'Split Screen',
	poReceiptInvoiceViewText   : 'PO / Receipt / Invoice'
});

Ext.define('NP.locale.en.view.mySettings.UserDelegation', {
	override: 'NP.view.mySettings.UserDelegation',

	title: 'User Delegation'
});

Ext.define('NP.locale.en.view.mySettings.UserDelegationMain', {
	override: 'NP.view.mySettings.UserDelegationMain',

	addDelegationText : 'Add a Delegation',
	delegationFromText: 'Users you delegated to',
	delegationToText  : 'Users who delegated to you'
});

Ext.define('NP.locale.en.view.mySettings.UserDelegationGrid', {
	override: 'NP.view.mySettings.UserDelegationGrid',

	emptyText: 'No delegations found.'
});

Ext.define('NP.locale.en.view.mySettings.UserDelegationForm', {
	override: 'NP.view.mySettings.UserDelegationForm',

	requires: ['NP.lib.core.Config'],

	startDateLabelText      : 'Start Date',
    stopDateLabelText       : 'Stop Date',
    delegateToLabelText     : 'Delegate to Whom',
    delegPropertiesLabelText: NP.Config.getSetting('PN.Main.PropertiesLabel') + ' to Delegate',
    delegPropertiesEmptyText: 'Select ' + NP.Config.getSetting('PN.Main.PropertiesLabel') + '...'
});


/**
 * USER MANAGER SECTION
 */
Ext.define('NP.locale.en.controller.UserManager', {
	override: 'NP.controller.UserManager'
});

Ext.define('NP.locale.en.view.user.UserManager', {
	override: 'NP.view.user.UserManager',

	title: 'User Manager'
});

Ext.define('NP.locale.en.view.user.Overview', {
	override: 'NP.view.user.Overview',

	title           : 'Overview',
	newUserBtnLabel : 'Create a New User',
	newGroupBtnLabel: 'Create a New User Group'
});

Ext.define('NP.locale.en.view.user.Users', {
	override: 'NP.view.user.Users',

	title                : 'Users'
});

Ext.define('NP.locale.en.view.user.UsersGrid', {
	override: 'NP.view.user.UsersGrid',

	createNewUserBtnLabel: 'Create New User',
    nameColText          : 'Name',
    groupColText         : 'Group',
    usernameColText      : 'Username',
    lastUpdatedColText   : 'Last Updated',
    statusColText        : 'Status'
});

Ext.define('NP.locale.en.view.user.UsersForm', {
	override: 'NP.view.user.UsersForm',

	delegationTabText: 'Delegation',
	infoTabText      : 'User Information'
});

Ext.define('NP.locale.en.view.user.UsersFormDetails', {
	override: 'NP.view.user.UsersFormDetails',

	title                     : 'User Details',
	usernameFieldLabel        : 'Username',
	currentPasswordFieldLabel : 'Current Password',
	passwordFieldLabel        : 'New Password',
	passwordDescriptionText   : 'The minimum password length required is 6 characters. Password security requires that a minimum of one letter, number and special character be used when setting up user passwords in the system. Special characters include !, @, #, $, %, &, *, and ?.',
	passwordFieldConfirmLabel : 'Confirm Password',
	passwordMatchErrorText    : 'The password fields need to match',
	positionFieldLabel        : 'Position',
	startDateFieldLabel       : 'Start Date',
	endDateFieldLabel         : 'End Date',
	securityQuestionFieldLabel: 'Security Question',
	securityAnswerFieldLabel  : 'Answer',
});

Ext.define('NP.locale.en.view.user.UsersFormPermissions', {
	override: 'NP.view.user.UsersFormPermissions',

	requires: ['NP.lib.core.Config'],

	title              : 'Permissions',
	codingPropertyLabel: NP.Config.getPropertyLabel(true) + ' for Coding Access Only'
});

Ext.define('NP.locale.en.view.user.Groups', {
	override: 'NP.view.user.Groups',

	title: 'User Groups'
});

Ext.define('NP.locale.en.view.user.GroupsForm', {
	override: 'NP.view.user.GroupsForm',

	createCopyBtnText: 'Create Copy'
});

Ext.define('NP.locale.en.view.user.GroupsFormInfo', {
	override: 'NP.view.user.GroupsFormInfo',

	title              : 'Group Information',
	roleNameFieldLabel : 'Group Name',
	nextLevelFieldLabel: 'Next Level'
});

Ext.define('NP.locale.en.view.user.GroupsFormPermissions', {
	override: 'NP.view.user.GroupsFormPermissions',

	title             : 'Responsibilities',
	expandAllBtnText  : 'Expand All',
	collapseAllBtnText: 'Collapse All'
});

Ext.define('NP.locale.en.view.user.GroupsGrid', {
	override: 'NP.view.user.GroupsGrid',

	createNewGroupBtnLabel: 'Create New Group',
    createCopyBtnLabel    : 'Create Copy',
    nameColText           : 'Name',
    usersColText          : 'Users',
    lastUpdatedColText    : 'Last Updated',
    moduleFilterLabel     : 'Function'
});

/**
 * MESSAGE CENTER SECTION
 */
 Ext.define('NP.locale.en.controller.MessageCenter', {
	override: 'NP.controller.MessageCenter',
	
	saveSuccessText      : 'Your changes were saved.',
	deleteDialogTitleText: 'Delete Message?',
	deleteDialogText     : 'Are you sure you want to delete this message?',
	deleteSuccessText    : 'Message succesfully deleted',
	deleteFailureText    : 'There was an error deleting the message. Please try again.',
	errorDialogTitleText : 'Error'
});

 Ext.define('NP.locale.en.view.messageCenter.MessageForm', {
	override: 'NP.view.messageCenter.MessageForm',
	
	title                 : 'Message',
	typeFieldLabel        : 'Message Type',
	titleFieldLabel       : 'Title of Message',
	messageFieldLabel     : 'Message',
	sentFieldLabel        : 'Sent Date',
	displayUntilFieldLabel: 'Display Until Date',
	messageForFieldLabel  : 'Message For',
	userUnassignedText    : 'Users',
	userAssignedText      : 'Users to Send To',
	groupUnassignedText   : 'Groups',
	groupAssignedText     : 'Groups to Send To',
	pastErrorText         : 'cannot be in the past',
	laterThanErrorText    : 'must be a later date than'
});

/**
 * PROPERTY SETUP SECTION
 */
Ext.define('NP.locale.en.controller.PropertySetup', {
	override: 'NP.controller.PropertySetup',
	
	requires: ['NP.lib.core.Config'],

	errorDialogTitleText      : 'Error',
	placeOnHoldDialogTitleText: 'Place On Hold?',
	placeOnHoldDialogText     : 'Are you sure you want to place the selected ' + NP.Config.getPropertyLabel(true).toLowerCase() + ' on hold?',
	onHoldSuccessText         : NP.Config.getPropertyLabel(true) + ' were placed on hold',
	onHoldFailureText         : 'There was an error placing ' + NP.Config.getPropertyLabel(true) + ' on hold',
	activateDialogTitleText : 'Activate?',
	activateDialogText      : 'Are you sure you want to activate the selected ' + NP.Config.getPropertyLabel(true).toLowerCase() + '?',
	activateSuccessText     : NP.Config.getPropertyLabel(true) + ' were activated',
	activateFailureText     : 'There was an error activating ' + NP.Config.getPropertyLabel(true),
	inactivateDialogTitleText : 'Inactivate?',
	inactivateDialogText      : 'Are you sure you want to inactivate the selected ' + NP.Config.getPropertyLabel(true).toLowerCase() + '?',
	inactivateSuccessText     : NP.Config.getPropertyLabel(true) + ' were inactivated',
	inactivateFailureText     : 'There was an error inactivating ' + NP.Config.getPropertyLabel(true),
	changesSavedText          : 'Changes saved successfully',
	invalidDayErrorText       : 'Invalid day',
	unassignedUniTypeTitle    : 'View ' + NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit') + 's Not Assigned to a ' + NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit') + ' Type',
	newPropertyTitleText      : 'New Property',
	editPropertyTitleText     : 'Editing'
});

Ext.define('NP.locale.en.view.propertySetup.Overview', {
	override: 'NP.view.property.Overview',
	
	requires: ['NP.lib.core.Config'],

	introText         : 'The ' + NP.Config.getPropertyLabel() + ' Setup section lists all ' + NP.Config.getPropertyLabel(true).toLowerCase() +', broken into three tabs: Current, On Hold, and Inactive.  Current ' + NP.Config.getPropertyLabel(true).toLowerCase() + ' includes the full list of ' + NP.Config.getPropertyLabel(true).toLowerCase() + ' that are available for use in the system.  On Hold ' + NP.Config.getPropertyLabel(true).toLowerCase() + ' includes the full list of ' + NP.Config.getPropertyLabel(true).toLowerCase() + ' that are in the process of being set up in the system or are in the process of being made inactive.  On Hold ' + NP.Config.getPropertyLabel(true).toLowerCase() + ' can not be assigned to a PO or Invoice but their historical information can still be included on reports.  Inactive ' + NP.Config.getPropertyLabel(true).toLowerCase() + ' include the full list of ' + NP.Config.getPropertyLabel(true).toLowerCase() + ' that are no longer in use on the system.  Inactive ' + NP.Config.getPropertyLabel(true).toLowerCase() +  ' are not available to be included on any reports.',
	reminderText      : '<b><i>Reminder</i></b>, the following fields are required to be completed before a new ' + NP.Config.getPropertyLabel().toLowerCase() + ' can be added to the system.',
	propertyStatusText: '<b>' + NP.Config.getPropertyLabel() + ' Status: </b>defaults to &quot;On Hold&quot; once the ' + NP.Config.getPropertyLabel().toLowerCase() + ' has been saved',
	propertyCodeText  : '<b>' + NP.Config.getPropertyLabel() + ' Code:</b> a unique code identifier for this ' + NP.Config.getPropertyLabel().toLowerCase() + ' found in your GL Package',
	propertyApCodeText: '<b>' + NP.Config.getPropertyLabel() + ' AP Code:</b> use this to further identify the ' + NP.Config.getPropertyLabel().toLowerCase() + ' (this is not required)',
	departmentCodeText: '<b>Department Code:</b> use this in conjunction with the AP Code to even further identify the ' + NP.Config.getPropertyLabel().toLowerCase() + ' (this is not required)',
	propertyNameText  : '<b>' + NP.Config.getPropertyLabel() + ' Name:</b> enter the name that should be used to refer to the ' + NP.Config.getPropertyLabel().toLowerCase() + '',
	totalUnitsText    : '<b>Total # of Units/Square Feet:</b> enter the number of units or square feet in the building',
	attentionText     : '<b>Attention: </b>enter the name of the contact person for the ' + NP.Config.getPropertyLabel().toLowerCase() + '',
	addressText       : '<b>Address, City, State, Zip: </b>enter the address of the ' + NP.Config.getPropertyLabel().toLowerCase() + '',
	phoneNumberText   : '<b>Phone number: </b>enter the phone number of the ' + NP.Config.getPropertyLabel().toLowerCase() + '',
	regionText        : '<b>' + NP.Config.getSetting('PN.main.RegionLabel', 'Region') + ': </b>use the drop down list to select the ' + NP.Config.getSetting('PN.main.RegionLabel', 'Region') + ' where the ' + NP.Config.getPropertyLabel().toLowerCase() + ' is located.  ',
	syncText          : '<b>Sync ' + NP.Config.getPropertyLabel() + ':</b> Yes/No - indicate whether the ' + NP.Config.getPropertyLabel().toLowerCase() + ' should sync actuals, invoices, and budgets with the backend accounting package',
	accrualCashText   : '<b>Accrual or Cash:</b> indicate whether the ' + NP.Config.getPropertyLabel().toLowerCase() + ' uses cash or accrual based accounting methods',
	calendarText      : '<b>Closing Calendar:</b> indicates which closing calendar (which day of the month the fiscal period rolls) will be used by the ' + NP.Config.getPropertyLabel().toLowerCase() + ' ',
	salesTaxText      : '<b>' + NP.Config.getPropertyLabel() + ' ' + NP.Config.getSetting('PN.General.salesTaxTerm', 'Sales Tax') + ':</b>  enter the default ' + NP.Config.getSetting('PN.General.salesTaxTerm', 'Sales Tax').toLowerCase() + ' for the ' + NP.Config.getPropertyLabel().toLowerCase() + ' that will be used to assist with the entry of ' + NP.Config.getSetting('PN.General.salesTaxTerm', 'Sales Tax').toLowerCase() + ' on new purchase orders and invoices; enter the ' + NP.Config.getSetting('PN.General.salesTaxTerm', 'Sales Tax').toLowerCase() + ' percentage as a decimal point (e.g., enter a 7% tax as .07)',
	thresholdText     : '<b>Acceptable PO Matching Threshold:</b>  enter the percentage an Invoice amount can exceed its Purchase Order amount before the invoice is routed for approval; enter the percentage as a whole number (e.g., enter 5% as 5) ',
	startMonthText    : '<b>Fiscal Calendar Start Month:</b>  indicates which month of the year the fiscal calendar begins'
});

Ext.define('NP.locale.en.view.property.PropertiesFormInfo', {
	override: 'NP.view.property.PropertiesFormInfo',
	
	requires: ['NP.lib.core.Config'],

	title                  : NP.Config.getPropertyLabel() + ' Info',
	codeFieldText          : NP.Config.getPropertyLabel() + ' Code',
	apCodeFieldText        : NP.Config.getPropertyLabel() + ' AP Code',
	deptCodeFieldText      : 'Department Code',
	propertyNameFieldText  : NP.Config.getPropertyLabel() + ' Name',
	totalUnitsFieldText    : 'Total No. of ' + NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit') + 's',
	attnFieldText          : 'Attention',
	addressFieldText       : 'Address',
	phoneFieldText         : 'Phone Number',
	faxFieldText           : 'Fax Number',
	billToFieldText        : 'Bill To Address Option',
	billToPropertyFieldText: 'Default Bill To Property',
	shipToFieldText        : 'Ship To Address Option',
	shipToPropertyFieldText: 'Default Ship To Property',
	syncFieldText          : 'Sync ' + NP.Config.getPropertyLabel(),
	accrualCashFieldText   : 'Accrual or Cash',
	nexusServicesFieldText : 'Nexus Services',
	vendorCatalogFieldText : 'Vendor Catalog',
	intPackageFieldText    : 'Integration Package',
	calendarFieldText      : 'Closing Calendar',
	volumeTypeFieldText    : 'Volume Type'
});

Ext.define('NP.locale.en.view.property.PropertiesFormAccounting', {
	override: 'NP.view.property.PropertiesFormAccounting',
	
	title: 'Accounting Info',
    thresholdFieldText: 'Acceptable PO Matching Threshold (%)',
    fiscalCalStartFieldText: 'Fiscal Calendar Start Month'
});

Ext.define('NP.locale.en.view.property.PropertiesFormGl', {
	override: 'NP.view.property.PropertiesFormGl',
	
	requires: ['NP.lib.core.Config'],
	
	title        : 'GL Assignments',
	fromTitleText: 'Assigned',
	toTitleText  : 'Unassigned'
});

Ext.define('NP.locale.en.view.property.PropertiesFormCal', {
	override: 'NP.view.property.PropertiesFormCal',
	
	title: 'Fiscal Calendars'
});

Ext.define('NP.locale.en.view.property.UnitGrid', {
	override: 'NP.view.property.UnitGrid',
	
	addButtonText   : 'Add',
    removeButtonText: 'Remove',
    gridCodeColText : 'Code',
    gridNameColText : 'Name'
});

Ext.define('NP.locale.en.view.property.UnitForm', {
	override: 'NP.view.property.UnitForm',
	
	codeLabelText: 'Code',
	nameLabelText: 'Name',
	typeLabelText: 'Type'
});

Ext.define('NP.locale.en.view.property.PropertiesFormUnitMeasurements', {
	override: 'NP.view.property.PropertiesFormUnitMeasurements',
	
	measurementTitleText: 'Measurements'
});

/**
 * USER MANAGER SECTION
 */

// Delegation grid columns
Ext.define('NP.locale.en.view.user.gridcol.DelegationCreatedBy', {
	override: 'NP.view.user.gridcol.DelegationCreatedBy',

	text: 'Setup By'
});

Ext.define('NP.locale.en.view.user.gridcol.DelegationEndDate', {
	override: 'NP.view.user.gridcol.DelegationEndDate',

	text: 'End Date'
});

Ext.define('NP.locale.en.view.user.gridcol.DelegationFromName', {
	override: 'NP.view.user.gridcol.DelegationFromName',

	text: 'Name'
});

Ext.define('NP.locale.en.view.user.gridcol.DelegationStartDate', {
	override: 'NP.view.user.gridcol.DelegationStartDate',

	text: 'Start Date'
});

Ext.define('NP.locale.en.view.user.gridcol.DelegationStatus', {
	override: 'NP.view.user.gridcol.DelegationStatus',

	text: 'Status'
});

Ext.define('NP.locale.en.view.user.gridcol.DelegationToName', {
	override: 'NP.view.user.gridcol.DelegationToName',

	text: 'Name'
});

Ext.define('NP.locale.en.view.user.gridcol.DelegationCancel', {
	override: 'NP.view.user.gridcol.DelegationToName',

	text: 'Cancel'
});

Ext.define('NP.locale.en.view.user.gridcol.DelegationView', {
	override: 'NP.view.user.gridcol.DelegationToName',

	text: 'Name'
});

/**
 * SYSTEM SETUP SECTION
 */

Ext.define('NP.locale.en.controller.SystemSetup', {
	override: 'NP.controller.SystemSetup',

	changesSavedText		: 'Changes saved successfully',
	errorDialogTitleText	: 'Error'
});

Ext.define('NP.locale.en.controller.systemSetup.Main', {
	override: 'NP.view.systemSetup.Main',

	title: 'System Setup'
});

Ext.define('NP.locale.en.view.systemSetup.Overview', {
	override: 'NP.view.systemSetup.Overview',

	title						: 'Overview',
	introText					: 'Much of the information in System Setup is established at the time that the system is first deployed or a new feature is added.  However, the system administrator can access this information, as necessary, for review or update.',
	settingsText				: '<b>Settings</b> - this section should be accessed only by your NexusPayables support staff.',
	workflowManagerText			: '<b>Workflow Manager</b> - this tab contains the full list of Workflow rules set up in the system and provides a way for you to add, edit, and delete these rules at any time.  Please refer to the specific overview section within this tab for more information.',
	glAccountsText				: '<b>GL Accounts</b> - this tab contains the full list of GL accounts set up in the system and provides a way for you to add, edit, and delete these accounts. Please refer to the specific overview section within this tab for more information.',
	passwordConfigurationText	: '<b>Password Configuration</b> - the Password Configuration options available in this tab are provided as a means to control how users set up and change their passwords.',
	customFieldsText			: '<b>Custom Fields</b> - this tab provides a way to manage up to three custom fields, to be defined by you, for use on Purchase Orders and Invoices',
	picklistsText				: '<b>Picklists</b> - this tab provides a way to manage the values that should display on Rejection Notes, Vendor Types, and Vendor Document Types.  These values can be updated and added to at any time.',
	defaultSplitsText			: '<b>Default Splits</b> - this tab displays a list of current default splits set up in the system and provides a way to upload new default splits in the system.'
});


Ext.define('NP.locale.en.controller.systemSetup.CustomFields', {
	override: 'NP.view.systemSetup.CustomFields',

	title: 'Custom Fields',
});

Ext.define('NP.locale.en.controller.systemSetup.DefaultSplits', {
	override: 'NP.view.systemSetup.DefaultSplits',

	title: 'Default Splits',
});

Ext.define('NP.locale.en.controller.systemSetup.GLAccounts', {
	override: 'NP.view.systemSetup.GLAccounts',

	title: 'GL Accounts',
});

Ext.define('NP.locale.en.controller.systemSetup.PasswordConfiguration', {
	override: 'NP.view.systemSetup.PasswordConfiguration',

	title: 'Password Configuration',
	pwdCfgExplanationText			: 'Password security requires that a minimum of one letter, number and special character be used when setting up user passwords in the system. Special characters include !, @, $, %, &, *, and ?',
    passwordMinLengthText			: 'Please select the minimum password length',
    passwordExpireIntervalText		: 'Expiration Interval (days)',
    passwordHistoryIntervalText		: 'Days until same password can be reused',
    passwordChangeOnLoginText		: 'User must change password on login',
    passwordChangeOnLoginYesText	: 'Yes',
    passwordChangeOnLoginNoText		: 'No'
});

Ext.define('NP.locale.en.controller.systemSetup.Picklist', {
	override: 'NP.view.systemSetup.Picklist',

	title: 'Picklist'
});

Ext.define('NP.locale.en.controller.systemSetup.Settings', {
	override: 'NP.view.systemSetup.Settings',

	title: 'Settings'
});

Ext.define('NP.locale.en.controller.systemSetup.WorkflowManager', {
	override: 'NP.view.systemSetup.WorkflowManager',

	title: 'Workflow Manager'
});
