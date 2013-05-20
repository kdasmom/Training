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
 * ADMIN SECTION
 */

// My Settings
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
	poReceiptInvoiceViewText   : 'PO / Receipt / Invoice',
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

	text: 'View'
});