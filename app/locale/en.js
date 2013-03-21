/**
 * TOP MENU
 */

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
 * VIEWPORT
 */

// Home
Ext.define('NP.locale.en.view.viewport.Home', {
	override: 'NP.view.viewport.Home',

	title          : 'Home',
	summaryStatText: 'Summary Statistics'
});

// Summary Stat Names
Ext.define('NP.locale.en.lib.core.SummaryStatManager', {
	override: 'NP.lib.core.SummaryStatManager',

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
Ext.define('NP.locale.en.view.invoice.RegisterOpenGrid', {
	override: 'NP.view.invoice.RegisterOpenGrid',

	createdDateColumnText: 'Created Date',
    dueDateColumnText    : 'Due Date',
});

// Rejected register grid
Ext.define('NP.locale.en.view.invoice.RegisterRejectedGrid', {
	override: 'NP.view.invoice.RegisterRejectedGrid',

	createdDateColumnText : 'Created Date',
    dueDateColumnText     : 'Due Date',
    createdByColumnText   : 'Created By',
    rejectedDateColumnText: 'Rejected Date',
    rejectedByColumnText  : 'Rejected By'
});