/**
 * Localization file for the english language
 *
 * @author Thomas Messier
 */
Ext.define('NP.Locale', {
	singleton: true,

	contructor: function() {
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
	},

	/**
	 * TOP MENU
	 */

	 // Vendor Catalog Menu
	'Vendor Catalog'         : 'Vendor Catalog',
	'Vendor Catalog Listings': 'Vendor Catalog Listings',
	'Open Orders'            : 'Open Orders',
	'Favorite Items'         : 'Favorite Items',

	// PO Menu
	'Purchase Orders'      : 'Purchase Orders',
	'PO Register'          : 'PO Register',
	'Open'                 : 'Open',
	'Template'             : 'Template',
	'Pending'              : 'Pending',
	'Approved'             : 'Approved',
	'Invoiced'             : 'Invoiced',
	'Rejected'             : 'Rejected',
	'Cancelled'            : 'Cancelled',
	'Receipt Register'     : 'Receipt Register',
	'Pending Approval'     : 'Pending Approval',
	'Pending Post Approval': 'Pending Post Approval',
	'New PO'               : 'New PO',
	'Search POs'           : 'Search POs',

	// Invoice Menu
	'Invoices'             : 'Invoices',
	'Invoice Register'     : 'Invoice Register',
	'Overdue'              : 'Overdue',
	'On Hold'              : 'On Hold',
	'Submitted for Payment': 'Submitted for Payment',
	'Transferred to GL'    : 'Transferred to GL',
	'Paid'                 : 'Paid',
	'Void'                 : 'Void',
	'New Invoice'          : 'New Invoice',
	'Search Invoices'      : 'Search Invoices',

	// Vendor Menu
	'Vendors'            : 'Vendors',
	'New Vendor'         : 'New Vendor',
	'Search Vendors'     : 'Search Vendors',
	'VendorConnect Users': 'VendorConnect Users',

	// Image Menu
	'Image Management'     : 'Image Management',
	'Images To Be Indexed' : 'Images To Be Indexed',
	'Invoice Images'       : 'Invoice Images',
	'Purchase Order Images': 'Purchase Order Images',
	'Search Images'        : 'Search Images',
	'Exceptions'           : 'Exceptions',

	// Budget Menu
	'Budget'       : 'Budget',
	'At-a-Glance'  : 'At-a-Glance',
	'Budget Search': 'Budget Search',

	// Report Menu
	'Reports'                 : 'Reports',
	'Custom Reports'          : 'Custom Reports',
	'Overview'                : 'Overview',
	'System Saved Reports'    : 'System Saved Reports',
	'My Saved Reports'        : 'My Saved Reports',
	'PO Register Reports'     : 'PO Register Reports',
	'Receipt Reports'         : 'Receipt Reports',
	'Invoice Register Reports': 'Invoice Register Reports',
	'Job Costing Reports'     : 'Job Costing Reports',
	'Utility Reports'         : 'Utility Reports',
	'Vendor History Reports'  : 'Vendor History Reports',
	'Admin Reports'           : 'Admin Reports',

	// Admin Menu
	'Administration'             : 'Administration',
	'My Settings'                : 'My Settings',
	'User Manager'               : 'User Manager',
	'Message Center'             : 'Message Center',
	'Integration'                : 'Integration',
	'{property} Setup'           : '{property} Setup',
	'System Setup'               : 'System Setup',
	'GL Account Setup'           : 'GL Account Setup',
	'Catalog Maintenance'        : 'Catalog Maintenance',
	'Import/Export Utility'      : 'Import/Export Utility',
	'GL'                         : 'GL',
	'Vendor'                     : 'Vendor',
	'Invoice'                    : 'Invoice',
	'User'                       : 'User',
	'Custom Field'               : 'Custom Field',
	'Splits'                     : 'Splits',
	'Set Approval Budget Overage': 'Set Approval Budget Overage',
	'Utility Setup'              : 'Utility Setup',
	'Mobile Setup'               : 'Mobile Setup',

	/**
	 * DELEGATION PICKER
	 */
	'You are signed on as': 'You are signed on as',

	/**
	 * CONTEXT PICKER
	 */
	'Current': 'Current',
	'All'    : 'All',

	/**
	 * ADDRESS BLOCK
	 */
	'Street': 'Street',
	'City'  : 'City',
	'State' : 'State',
	'Zip'   : 'Zip',

	/**
	 * BUTTONS
	 */
	'Activate'            : 'Activate',
	'Allocate'            : 'Allocate',
	'Back'                : 'Back',
	'Camera'              : 'Camera',
	'Cancel'              : 'Cancel',
	'Delete'              : 'Delete',
	'Edit'                : 'Edit',
	'Place On Hold'       : 'Place On Hold',
	'Inactivate'          : 'Inactivate',
	'New'                 : 'New',
	'Print'               : 'Print',
	'Report'              : 'Report',
	'Reset'               : 'Reset',
	'Save'                : 'Save',
	'Save And Add Another': 'Save And Add Another',
	'Upload'              : 'Upload',
	'View'                : 'View',
	'Next Step'           : 'Next Step',
	'Copy'                : 'Copy',
	'Create Rule'         : 'Create Rule',
	'Save & Activate'     : 'Save & Activate',
	'Close'               : 'Close',
	'Deactivate'          : 'Deactivate',
	'Add Forward'         : 'Add Forward',

	/**
	 * VIEWPORT
	 */

	// Home
	'Home'              : 'Home',
	'Summary Statistics': 'Summary Statistics',

	// Summary Stat Names
	'Purchase Orders To Approve'          : 'Purchase Orders To Approve',
	'Approved Purchase Orders for Review' : 'Approved Purchase Orders for Review',
	'My Purchase Orders'                  : 'My Purchase Orders',
	'Rejected Purchase Orders'            : 'Rejected Purchase Orders',
	'Receipts To Approve'                 : 'Receipts To Approve',
	'Rejected Receipts'                   : 'Rejected Receipts',
	'Receipts Pending Post Approval'      : 'Receipts Pending Post Approval',
	'Invoices to Approve'                 : 'Invoices to Approve',
	'Invoices on Hold'                    : 'Invoices on Hold',
	'Completed Invoices to Approve'       : 'Completed Invoices to Approve',
	'Rejected Invoices'                   : 'Rejected Invoices',
	'My Invoices'                         : 'My Invoices',
	'Images to Convert to Invoice'        : 'Images to Convert to Invoice',
	'Image Invoices to be Processed'      : 'Image Invoices to be Processed',
	'Image Exceptions'                    : 'Image Exceptions',
	'Images to be Indexed'                : 'Images to be Indexed',
	'Vendors to Approve'                  : 'Vendors to Approve',
	'VendorConnect Authorization Request' : 'VendorConnect Authorization Request',
	'Expired Insurance Certificates'      : 'Expired Insurance Certificates',
	'Month-to-Date Over Budget Categories': 'Month-to-Date Over Budget Categories',
	'Year-to-Date Over Budget Categories' : 'Year-to-Date Over Budget Categories',

	/**
	 * GRID COLUMNS
	 */
	'Amount'                : 'Amount',
	'Date'                  : 'Date',
	'Number of Days On Hold': 'Number of Days On Hold',
	'Due Date'              : 'Due Date',
	'On Hold Date'          : 'On Hold Date',
	'Needed By'             : 'Needed By',
	'Invoice Number'        : 'Invoice Number',
	'On Hold By'            : 'On Hold By',
	'Days Pending'          : 'Days Pending',
	'Post Date'             : 'Post Date',
	'Priority'              : 'Priority',
	'Receipt Number'        : 'Receipt Number',
	'PO Number'             : 'PO Number',


	/**
	 * INVOICE SECTION
	 */

	// Invoice Register
	'Invoice Register'     : 'Invoice Register',
	'Get PO'               : 'Get PO',
	'New Invoice'          : 'New Invoice',
	'Invoice Reports'      : 'Invoice Reports',
	'Search'               : 'Search',
	'Receipt Register'     : 'Receipt Register',
	'Overdue'              : 'Overdue',
	'Submitted for Payment': 'Submitted for Payment',
	'Transferred to GL'    : 'Transferred to GL',
	'Paid'                 : 'Paid',
	'Void'                 : 'Void',

	/**
	 * MY SETTINGS SECTION
	 */
	'Changes saved successfully'                                                                                       : 'Changes saved successfully',
	'Error'                                                                                                            : 'Error',
	'Register New Device?'                                                                                             : 'Register New Device?',
	'Registering a new device will disable the active one. Do you still want to proceed anyway?'                       : 'Registering a new device will disable the active one. Do you still want to proceed anyway?',
	'Disable Mobile Number?'                                                                                           : 'Disable Mobile Number?',
	'Are you sure you want to disable this mobile number?'                                                             : 'Are you sure you want to disable this mobile number?',
	'Cancel Delegation?'                                                                                               : 'Cancel Delegation?',
	'Are you sure you want to cancel this delegation?'                                                                 : 'Are you sure you want to cancel this delegation?',
	'Active Delegation'                                                                                                : 'Active Delegation',
	'You have an active delegation. You cannot delegate to another user until that delegation expires or is cancelled.': 'You have an active delegation. You cannot delegate to another user until that delegation expires or is cancelled.',
	'You have left one or more columns empty. Please fill those columns or remove them.'                               : 'You have left one or more columns empty. Please fill those columns or remove them.',

	'My Settings allows users to change their personal user information as well as manage certain system settings. The following tabs contain information to allow the user to manage the following information'                                        : 'My Settings allows users to change their personal user information as well as manage certain system settings. The following tabs contain information to allow the user to manage the following information:',
	'<b>User Information</b> - allows the user to change their password and update personal information such as their contact information and email address.'                                                                                           : '<b>User Information</b> - allows the user to change their password and update personal information such as their contact information and email address.',
	'<b>Settings</b> - allows the user to configure their dashboard default settings of what property they want to automatically log into as well as what summary statistic they want to auto display.'                                                 : '<b>Settings</b> - allows the user to configure their dashboard default settings of what property they want to automatically log into as well as what summary statistic they want to auto display.',
	'<b>Display</b> - allows the user to choose which default percentage setting they want to view on split screen views.  Note this is only applicable for users with access to view images in the system.'                                            : '<b>Display</b> - allows the user to choose which default percentage setting they want to view on split screen views.  Note this is only applicable for users with access to view images in the system.',
	'<b>Email Notification</b> - allows the user to manage specific email alert frequencies for Purchase Orders and/or Invoices that require approval and for budget overage notifications.'                                                            : '<b>Email Notification</b>- allows the user to manage specific email alert frequencies for Purchase Orders and/or Invoices that require approval and for budget overage notifications.',
	'<b>Mobile Settings</b> - allows users to register their mobile phone to begin using the Mobile Application for PO, Receipt and Invoice approvals. If you do not see this tab display, your role right has not been granted access to this section.': '<b>Mobile Settings</b>- allows users to register their mobile phone to begin using the Mobile Application for PO, Receipt and Invoice approvals. If you do not see this tab display, your role right has not been granted access to this section.',
	'<b>User Delegation</b> - allows the user to delegate approval authority to another user while they are away.  Please note this will appear only on the Settings tab and for users who have been given rights to this functionality.'               : '<b>User Delegation</b> - allows the user to delegate approval authority to another user while they are away.  Please note this will appear only on the Settings tab and for users who have been given rights to this functionality.',

	'Display'                          : 'Display',
	'Split Screen Viewing Size'        : 'Split Screen Viewing Size',
	'Custom'                           : 'Custom',
	'Split Screen Viewing Orientation' : 'Split Screen Viewing Orientation',
	'Vertical'                         : 'Vertical',
	'Horizontal'                       : 'Horizontal',
	'Split Screen Image Position'      : 'Split Screen Image Position',
	'Left (Bottom for Horizontal View)': 'Left (Bottom for Horizontal View)',
	'Right (Top for Horizontal View)'  : 'Right (Top for Horizontal View)',
	'Default View'                     : 'Default View',
	'Split Screen'                     : 'Split Screen',
	'PO / Receipt / Invoice'           : 'PO / Receipt / Invoice',

	/**
	 * USER MANAGER SECTION
	 */
	'User Delegation'           : 'User Delegation',
	'Add a Delegation'          : 'Add a Delegation',
	'Users you delegated to'    : 'Users you delegated to',
	'Users who delegated to you': 'Users who delegated to you',
	'No delegations found.'     : 'No delegations found.',
	'Start Date'                : 'Start Date',
	'Stop Date'                 : 'Stop Date',
	'Delegate to Whom'          : 'Delegate to Whom',
	'{properties} to Delegate'  : '{properties} to Delegate',
	'Select {properties}...'    : 'Select {properties}...',

	'Users were activated'                                                                                             : 'Users were activated',
	'There was an error activating users'                                                                              : 'There was an error activating users',
	'Users were inactivated'                                                                                           : 'Users were inactivated',
	'There was an error inactivating users'                                                                            : 'There was an error inactivating users',
	'Active Delegation'                                                                                                : 'Active Delegation',
	'You have an active delegation. You cannot delegate to another user until that delegation expires or is cancelled.': 'You have an active delegation. You cannot delegate to another user until that delegation expires or is cancelled.',
	'Cancel Delegation?'                                                                                               : 'Cancel Delegation?',
	'Are you sure you want to cancel this delegation?'                                                                 : 'Are you sure you want to cancel this delegation?',
	'Add a Delegation'                                                                                                 : 'Add a Delegation',
	'Update Delegation'                                                                                                : 'Update Delegation',
	'New User'                                                                                                         : 'New User',
	'Editing'                                                                                                          : 'Editing',
	'New Group'                                                                                                        : 'New Group',
	'Editing Group'                                                                                                    : 'Editing Group',
	'You have left one or more dashboard columns empty. Please fill those columns or remove them.'                     : 'You have left one or more dashboard columns empty. Please fill those columns or remove them.',

	'User Manager': 'User Manager',

	'Create a New User'      : 'Create a New User',
	'Create a New User Group': 'Create a New User Group',

	'Users': 'Users',

	'Create New User': 'Create New User',
	'Function'       : 'Function',
	'Name'           : 'Name',
	'Group'          : 'Group',
	'Username'       : 'Username',
	'Last Updated'   : 'Last Updated',
	'Status'         : 'Status',

	'Delegation'      : 'Delegation',
	'User Information': 'User Information',

	'User Details'                                                                                                                                                                                                                                            : 'User Details',
	'Username'                                                                                                                                                                                                                                                : 'Username',
	'Current Password'                                                                                                                                                                                                                                        : 'Current Password',
	'New Password'                                                                                                                                                                                                                                            : 'New Password',
	'The minimum password length required is 6 characters. Password security requires that a minimum of one letter, number and special character be used when setting up user passwords in the system. Special characters include !, @, #, $, %, &, *, and ?.': 'The minimum password length required is 6 characters. Password security requires that a minimum of one letter, number and special character be used when setting up user passwords in the system. Special characters include !, @, #, $, %, &, *, and ?.',
	'Confirm Password'                                                                                                                                                                                                                                        : 'Confirm Password',
	'The password fields need to match'                                                                                                                                                                                                                       : 'The password fields need to match',
	'Position'                                                                                                                                                                                                                                                : 'Position',
	'End Date'                                                                                                                                                                                                                                                : 'End Date',
	'Security Question'                                                                                                                                                                                                                                       : 'Security Question',
	'Answer'                                                                                                                                                                                                                                                  : 'Answer',

	'Permissions'                        : 'Permissions',
	'{properties} for Coding Access Only': '{properties} for Coding Access Only',

	'User Groups': 'User Groups',

	'Create Copy': 'Create Copy',

	'Group Information': 'Group Information',
	'Group Name'       : 'Group Name',
	'Next Level'       : 'Next Level',

	'Responsibilities': 'Responsibilities',
	'Expand All'      : 'Expand All',
	'Collapse All'    : 'Collapse All',

	'Create New Group': 'Create New Group',
	'Create Copy'     : 'Create Copy',
	'Users'           : 'Users',
	'Function'        : 'Function',

	/**
	 * MESSAGE CENTER SECTION
	 */
	'Your changes were saved.'                                  : 'Your changes were saved.',
	'Delete Message?'                                           : 'Delete Message?',
	'Are you sure you want to delete this message?'             : 'Are you sure you want to delete this message?',
	'Message succesfully deleted'                               : 'Message succesfully deleted',
	'There was an error deleting the message. Please try again.': 'There was an error deleting the message. Please try again.',

	'Message'                  : 'Message',
	'Message Type'             : 'Message Type',
	'Title of Message'         : 'Title of Message',
	'Message'                  : 'Message',
	'Sent Date'                : 'Sent Date',
	'Display Until Date'       : 'Display Until Date',
	'Message For'              : 'Message For',
	'Users'                    : 'Users',
	'Users to Send To'         : 'Users to Send To',
	'Groups'                   : 'Groups',
	'Groups to Send To'        : 'Groups to Send To',
	'cannot be in the past'    : 'cannot be in the past',
	'must be a later date than': 'must be a later date than',


	/**
	 * PROPERTY SETUP SECTION
	 */

	'Place On Hold?'                                                 : 'Place On Hold?',
	'Are you sure you want to place the selected {property} on hold?': 'Are you sure you want to place the selected {property} on hold?',
	'{properties} were placed on hold'                               : '{properties} were placed on hold',
	'There was an error placing {properties} on hold'                : 'There was an error placing {properties} on hold',
	'Are you sure you want to activate the selected {properties}?'   : 'Are you sure you want to activate the selected {properties}?',
	'{properties} were activated'                                    : '{properties} were activated',
	'There was an error activating {properties}'                     : 'There was an error activating {properties}',
//	'Inactivate'                                                     : 'Inactivate',
	'Are you sure you want to inactivate the selected {properties}?' : 'Are you sure you want to inactivate the selected {properties}?',
	'{properties} were inactivated'                                  : '{properties} were inactivated',
	'There was an error inactivating {properties}'                   : 'There was an error inactivating {properties}',
	'Invalid day'                                                    : 'Invalid day',
	'View {unit} Not Assigned to a {unit} Type'                      : 'View {unit} Not Assigned to a {unit} Type',
	'New {property}'                                                 : 'New {property}',

	'The {property} Setup section lists all {properties}, broken into three tabs: Current, On Hold, and Inactive.  Current {properties} includes the full list of {properties} that are available for use in the system.  On Hold {properties} includes the full list of {properties} that are in the process of being set up in the system or are in the process of being made inactive.  On Hold {properties} can not be assigned to a PO or Invoice but their historical information can still be included on reports.  Inactive {properties} include the full list of {properties} that are no longer in use on the system. Inactive {properties} are not available to be included on any reports.' : 'The {property} Setup section lists all {properties}, broken into three tabs: Current, On Hold, and Inactive.  Current {properties} includes the full list of {properties} that are available for use in the system.  On Hold {properties} includes the full list of {properties} that are in the process of being set up in the system or are in the process of being made inactive.  On Hold {properties} can not be assigned to a PO or Invoice but their historical information can still be included on reports.  Inactive {properties} include the full list of {properties} that are no longer in use on the system. Inactive {properties} are not available to be included on any reports.',
	'<b><i>Reminder</i></b>, the following fields are required to be completed before a new {property} can be added to the system.'                                                                                                                                    : '<b><i>Reminder</i></b>, the following fields are required to be completed before a new {property} can be added to the system.',
	'<b>{property} Status: </b>defaults to &quot;On Hold&quot; once the {property} has been saved'                                                                                                                                                                     : '<b>{property} Status: </b>defaults to &quot;On Hold&quot; once the {property} has been saved',
	'<b>{property} Code:</b> a unique code identifier for this {property} found in your GL Package'                                                                                                                                                                    : '<b>{property} Code:</b> a unique code identifier for this {property} found in your GL Package',
	'<b>{property} AP Code:</b> use this to further identify the {property} (this is not required)'                                                                                                                                                                    : '<b>{property} AP Code:</b> use this to further identify the {property} (this is not required)',
	'<b>Department Code:</b> use this in conjunction with the AP Code to even further identify the {property} (this is not required)'                                                                                                                                  : '<b>Department Code:</b> use this in conjunction with the AP Code to even further identify the {property} (this is not required)',
	'<b>{property} Name:</b> enter the name that should be used to refer to the {property}'                                                                                                                                                                            : '<b>{property} Name:</b> enter the name that should be used to refer to the {property}',
	'<b>Total # of {unit}s/Square Feet:</b> enter the number of {unit}s or square feet in the building'                                                                                                                                                                : '<b>Total # of {unit}s/Square Feet:</b> enter the number of {unit}s or square feet in the building',
	'<b>Attention: </b>enter the name of the contact person for the {property}'                                                                                                                                                                                        : '<b>Attention: </b>enter the name of the contact person for the {property}',
	'<b>Address, City, State, Zip: </b>enter the address of the {property}'                                                                                                                                                                                            : '<b>Address, City, State, Zip: </b>enter the address of the {property}',
	'<b>Phone number: </b>enter the phone number of the {property}'                                                                                                                                                                                                    : '<b>Phone number: </b>enter the phone number of the {property}',
	'<b>{region}: </b>use the drop down list to select the {region} where the {property} is located.'                                                                                                                                                                  : '<b>{region}: </b>use the drop down list to select the {region} where the {property} is located.',
	'<b>Sync {property}:</b> Yes/No - indicate whether the {property} should sync actuals, invoices, and budgets with the backend accounting package'                                                                                                                  : '<b>Sync {property}:</b> Yes/No - indicate whether the {property} should sync actuals, invoices, and budgets with the backend accounting package',
	'<b>Accrual or Cash:</b> indicate whether the {property} uses cash or accrual based accounting methods'                                                                                                                                                            : '<b>Accrual or Cash:</b> indicate whether the {property} uses cash or accrual based accounting methods',
	'<b>Closing Calendar:</b> indicates which closing calendar (which day of the month the fiscal period rolls) will be used by the {property}'                                                                                                                        : '<b>Closing Calendar:</b> indicates which closing calendar (which day of the month the fiscal period rolls) will be used by the {property}',
	'<b>{property} {salesTax}:</b>  enter the default {salesTax} for the {property} that will be used to assist with the entry of {salesTax} on new purchase orders and invoices; enter the {salesTax} percentage as a decimal point (e.g., enter a 7% tax as .07)': '<b>{property} {salesTax}:</b>  enter the default {salesTax} for the {property} that will be used to assist with the entry of {salesTax} on new purchase orders and invoices; enter the {salesTax} percentage as a decimal point (e.g., enter a 7% tax as .07)',
	'<b>Acceptable PO Matching Threshold:</b>  enter the percentage an Invoice amount can exceed its Purchase Order amount before the invoice is routed for approval; enter the percentage as a whole number (e.g., enter 5% as 5)'                                    : '<b>Acceptable PO Matching Threshold:</b>  enter the percentage an Invoice amount can exceed its Purchase Order amount before the invoice is routed for approval; enter the percentage as a whole number (e.g., enter 5% as 5)',
	'<b>Fiscal Calendar Start Month:</b>  indicates which month of the year the fiscal calendar begins'                                                                                                                                                                : '<b>Fiscal Calendar Start Month:</b>  indicates which month of the year the fiscal calendar begins',

	'{property} Info'           : '{property} Info',
	'{property} Code'           : '{property} Code',
	'{property} AP Code'        : '{property} AP Code',
	'Department Code'           : 'Department Code',
	'{property} Name'           : '{property} Name',
	'Total No. of {unit}s'      : 'Total No. of {unit}s',
	'Attention'                 : 'Attention',
	'Address'                   : 'Address',
	'Phone Number'              : 'Phone Number',
	'Fax Number'                : 'Fax Number',
	'Bill To Address Option'    : 'Bill To Address Option',
	'Default Bill To {property}': 'Default Bill To {property}',
	'Ship To Address Option'    : 'Ship To Address Option',
	'Default Ship To {property}': 'Default Ship To {property}',
	'Sync {property}'           : 'Sync {property}',
	'Accrual or Cash'           : 'Accrual or Cash',
	'Nexus Services'            : 'Nexus Services',
	'Vendor Catalog'            : 'Vendor Catalog',
	'Integration Package'       : 'Integration Package',
	'Closing Calendar'          : 'Closing Calendar',
	'Volume Type'               : 'Volume Type',

	'Accounting Info'                     : 'Accounting Info',
	'{property} {salesTax}'               : '{property} {salesTax}',
	'Acceptable PO Matching Threshold (%)': 'Acceptable PO Matching Threshold (%)',
	'Fiscal Calendar Start Month'         : 'Fiscal Calendar Start Month',

	'GL Assignments': 'GL Assignments',
	'Assigned'      : 'Assigned',
	'Unassigned'    : 'Unassigned',
	
	'Fiscal Calendars': 'Fiscal Calendars',

	'Add {unit}'   : 'Add {unit}',
	'Remove {unit}': 'Remove {unit}',
	'Code'         : 'Code',
	'Type'         : 'Type',

	'{unit} Measurements' : '{unit} Measurements',

	/**
	 * USER MANAGER SECTION
	 */

	// Delegation grid columns	
	'Setup By': 'Setup By',

	/**
	 * SYSTEM SETUP SECTION
	 */

	'Delete Split?'                                                                                                                  : 'Delete Split?',
	'Are you sure you want to delete the selected split(s)?'                                                                         : 'Are you sure you want to delete the selected split(s)?',
	'Are you sure you want to delete this split?'                                                                                    : 'Are you sure you want to delete this split?',
	'New Split'                                                                                                                      : 'New Split',
	'Change integration package?'                                                                                                    : 'Change integration package?',
	'Are you sure you want to change integration package? Doing so will clear the entire form, removing all splits you have entered.': 'Are you sure you want to change integration package? Doing so will clear the entire form, removing all splits you have entered.',

	'Much of the information in System Setup is established at the time that the system is first deployed or a new feature is added.  However, the system administrator can access this information, as necessary, for review or update.'                               : 'Much of the information in System Setup is established at the time that the system is first deployed or a new feature is added.  However, the system administrator can access this information, as necessary, for review or update.',
	'<b>Settings</b> - this section should be accessed only by your NexusPayables support staff.'                                                                                                                                                                       : '<b>Settings</b> - this section should be accessed only by your NexusPayables support staff.',
	'<b>Workflow Manager</b> - this tab contains the full list of Workflow rules set up in the system and provides a way for you to add, edit, and delete these rules at any time.  Please refer to the specific overview section within this tab for more information.': '<b>Workflow Manager</b> - this tab contains the full list of Workflow rules set up in the system and provides a way for you to add, edit, and delete these rules at any time.  Please refer to the specific overview section within this tab for more information.',
	'<b>GL Accounts</b> - this tab contains the full list of GL accounts set up in the system and provides a way for you to add, edit, and delete these accounts. Please refer to the specific overview section within this tab for more information.'                  : '<b>GL Accounts</b> - this tab contains the full list of GL accounts set up in the system and provides a way for you to add, edit, and delete these accounts. Please refer to the specific overview section within this tab for more information.',
	'<b>Password Configuration</b> - the Password Configuration options available in this tab are provided as a means to control how users set up and change their passwords.'                                                                                          : '<b>Password Configuration</b> - the Password Configuration options available in this tab are provided as a means to control how users set up and change their passwords.',
	'<b>Custom Fields</b> - this tab provides a way to manage up to three custom fields, to be defined by you, for use on Purchase Orders and Invoices'                                                                                                                 : '<b>Custom Fields</b> - this tab provides a way to manage up to three custom fields, to be defined by you, for use on Purchase Orders and Invoices',
	'<b>Picklists</b> - this tab provides a way to manage the values that should display on Rejection Notes, Vendor Types, and Vendor Document Types.  These values can be updated and added to at any time.'                                                           : '<b>Picklists</b> - this tab provides a way to manage the values that should display on Rejection Notes, Vendor Types, and Vendor Document Types.  These values can be updated and added to at any time.',
	'<b>Default Splits</b> - this tab displays a list of current default splits set up in the system and provides a way to upload new default splits in the system.'                                                                                                    : '<b>Default Splits</b> - this tab displays a list of current default splits set up in the system and provides a way to upload new default splits in the system.',


	'Custom Fields': 'Custom Fields',

	'Default Splits': 'Default Splits',

	'Create New Split': 'Create New Split',
	'Alert'           : 'Alert',
	'Inactive'        : 'Inactive',

	'Copy Split'                                                     : 'Copy Split',
	'Split Name'                                                     : 'Split Name',
	'Allocation Details'                                             : 'Allocation Details',
	'GL Account'                                                     : 'GL Account',
	'Percentage'                                                     : 'Percentage',
	'{property} is inactive'                                         : '{property} is inactive',
	'{property} is on hold'                                          : '{property} is on hold',
	'GL Account is inactive'                                         : 'GL Account is inactive',
	'Add Split'                                                      : 'Add Split',
	'Auto Allocate by {unit}'                                        : 'Auto Allocate by {unit}',
	'Left to allocate'                                               : 'Left to allocate',
	'Allocation must add up to 100%'                                 : 'Allocation must add up to 100%',
	'Please make sure each allocation line has a {property} selected': 'Please make sure each allocation line has a {property} selected',

	'GL Accounts': 'GL Accounts',

	'Password Configuration'                                                                                                                                                                        : 'Password Configuration',
	'Password security requires that a minimum of one letter, number and special character be used when setting up user passwords in the system. Special characters include !, @, $, %, &, *, and ?': 'Password security requires that a minimum of one letter, number and special character be used when setting up user passwords in the system. Special characters include !, @, $, %, &, *, and ?',
	'Please select the minimum password length'                                                                                                                                                     : 'Please select the minimum password length',
	'Expiration Interval (days)'                                                                                                                                                                    : 'Expiration Interval (days)',
	'Days until same password can be reused'                                                                                                                                                        : 'Days until same password can be reused',
	'User must change password on login'                                                                                                                                                            : 'User must change password on login',
	'Yes'                                                                                                                                                                                           : 'Yes',
	'No'                                                                                                                                                                                            : 'No',

	'Picklist'        : 'Picklist',
	'Settings'        : 'Settings',
	'Workflow Manager': 'Workflow Manager',

	/**
	 * IMPORT/EXPORT UTILITY SECTION
	 */

	 '<b>Overview</b><br />The Import/Export tool allows you to easily import and export key information in and from the NexusPayables system. This tool will enable you to easily upload setup information to help you quickly get started in using the system as well as upload additional values to these sections as your setup changes. Please note, edits to these uploaded values must be made in the respective administration management and setup areas.<br /><br /><b>Instructions</b><br />All uploads are made by using a .CSV file. A .CSV is a Comma Separated Value (CSV) file which is easily created by creating an Excel file and saving it as this file type. All versions of Excel allow you to save a workbook as a .CSV file type. The upload will not work with any other file types. <b>Please remember to delete the upload instruction prior to uploading the file.</b><br /><br />All uploads must include the column headings EXACTLY how they are listed in the worksheet and will not work if these do not match.<br /><br />When you upload a file, the system will mark any row with an invalid entry with an X. The review screen of your upload will give you the option to accept the file for import as is or decline it to re-upload. If you choose to Accept the file, any invalid entries will be skipped and WILL NOT be included in the upload.<br /><br />Please note that there is a limit of 1000 rows per file for all imports and exports.<br /><br /><b>Sample Worksheets</b><br />A sample worksheet for every import and export tool is provided below. Each worksheet includes the field definition and parameters. To utilize these worksheets, simply save the file to your computer and delete the definitions.<br /><br />If you are extracting this information from your GL system or another source, please note that the output you have must be reformatted to match the outlined file layout and must be a .CSV file type.' :
    '<b>Overview</b><br />'+
        'The Import/Export tool allows you to easily import and export key information in and from the NexusPayables system. '+
        'This tool will enable you to easily upload setup information to help you quickly get started in using the system as well'+
        'as upload additional values to these sections as your setup changes. Please note, edits to these uploaded values must be made'+
        'in the respective administration management and setup areas.' +
        '<br /><br />' +
        '<b>Instructions</b><br />' +
        'All uploads are made by using a .CSV file. A .CSV is a Comma Separated Value (CSV) file which is ' +
        'easily created by creating an Excel file and saving it as this file type. All versions of Excel ' +
        'allow you to save a workbook as a .CSV file type. The upload will not work with any other file ' +
        'types. <b>Please remember to delete the upload instruction prior to uploading the file.</b>' +
        '<br /><br />' +
        'All uploads must include the column headings EXACTLY how they are listed in the worksheet and ' +
        'will not work if these do not match.' +
        '<br /><br />' +
        'When you upload a file, the system will mark any row with an invalid entry with an X. The review ' +
        'screen of your upload will give you the option to accept the file for import as is or decline it ' +
        'to re-upload. If you choose to Accept the file, any invalid entries will be skipped and WILL NOT ' +
        'be included in the upload.' +
        '<br /><br />' +
        'Please note that there is a limit of 1000 rows per file for all imports and exports.' +
        '<br /><br />' +
        '<b>Sample Worksheets</b><br />' +
        'A sample worksheet for every import and export tool is provided below. Each worksheet ' +
        'includes the field definition and parameters. To utilize these worksheets, simply save ' +
        'the file to your computer and delete the definitions.' +
        '<br /><br />' +
        'If you are extracting this information from your GL system or another source, please ' +
        'note that the output you have must be reformatted to match the outlined file layout ' +
        'and must be a .CSV file type.',

    '<b>GL Worksheets</b><ul><li><a href="resources/import/glcategory_template.csv" target="_blank">GL Category</a></li><li><a href="resources/import/glaccounts_template.csv" target="_blank">GL Account</a></li><li><a href="resources/import/budgets_template.csv" target="_blank">GL Budgets</a></li><li><a href="resources/import/actuals_template.csv" target="_blank">GL Actuals</a></li></ul>' :
    '<b>GL Worksheets</b>' +
        '<ul>' +
            '<li><a href="resources/import/glcategory_template.csv" target="_blank">GL Category</a></li>' +
            '<li><a href="resources/import/glaccounts_template.csv" target="_blank">GL Account</a></li>' +
            '<li><a href="resources/import/budgets_template.csv" target="_blank">GL Budgets</a></li>' +
            '<li><a href="resources/import/actuals_template.csv" target="_blank">GL Actuals</a></li>' +
        '</ul>',

    '<b>Invoice Worksheets</b><ul><li><a href="resources/import/invoice_export_sample.csv" target="_blank">Invoice Export</a></li><li><a href="resources/import/payment_template.csv" target="_blank">Invoice Payments</a></li><li><a href="resources/import/invoice_items_template.csv" target="_blank">Invoice Item Import</a></li></ul>' :
	'<b>Invoice Worksheets</b>' +
	    '<ul>' +
	        '<li><a href="resources/import/invoice_export_sample.csv" target="_blank">Invoice Export</a></li>' +
	        '<li><a href="resources/import/payment_template.csv" target="_blank">Invoice Payments</a></li>' +
	        '<li><a href="resources/import/invoice_items_template.csv" target="_blank">Invoice Item Import</a></li>' +
	    '</ul>',

	'<b>Purchase Order Worksheets</b><ul><li><a href="resources/import/po_items_template.csv" target="_blank">Purchase Order Item Import</a></li></ul>' :
    '<b>Purchase Order Worksheets</b>' +
        '<ul>' +
            '<li><a href="resources/import/po_items_template.csv" target="_blank">Purchase Order Item Import</a></li>' +
        '</ul>',

    '<b>{property} Worksheets</b><ul><li><a href="resources/import/entity_template.csv" target="_blank">{property}</a></li><li><a href="resources/import/entitygl_template.csv" target="_blank">{property} GL Assignment</a></li><li><a href="resources/import/department_template.csv" target="_blank">Dept</a></li><li><a href="resources/import/department_type_template.csv" target="_blank">Dept Type</a></li></ul>' :
    '<b>{property} Worksheets</b>' +
        '<ul>' +
            '<li><a href="resources/import/entity_template.csv" target="_blank">{property}</a></li>' +
            '<li><a href="resources/import/entitygl_template.csv" target="_blank">{property} GL Assignment</a></li>' +
            '<li><a href="resources/import/department_template.csv" target="_blank">Dept</a></li>' +
            '<li><a href="resources/import/department_type_template.csv" target="_blank">Dept Type</a></li>' +
        '</ul>',

    '<b>User Worksheets</b><ul><li><a href="resources/import/user_template.csv" target="_blank">Users</a></li><li><a href="resources/import/userentity_template.csv" target="_blank">User {property} Assignment</a></li></ul>' :
    '<b>User Worksheets</b>' +
        '<ul>' +
            '<li><a href="resources/import/user_template.csv" target="_blank">Users</a></li>' +
            '<li><a href="resources/import/userentity_template.csv" target="_blank">User {property} Assignment</a></li>' +
        '</ul>',

    '<b>Help</b><ul><li><a href="resources/help/upload_help.pdf" target="_blank">Upload</a></li></ul>' :
	'<b>Help</b>' +
	    '<ul>' +
	        '<li><a href="resources/help/upload_help.pdf" target="_blank">Upload</a></li>' +
	    '</ul>',

	'<b>Vendor Worksheets</b><ul><li><a href="resources/import/vendor_template.csv" target="_blank">Vendors</a></li><li><a href="resources/import/vendorgl_template.csv" target="_blank">Vendor GL Assignment</a></li><li><a href="resources/import/vendorfav_template.csv" target="_blank">Vendor Favorites</a></li><li><a href="resources/import/vendorinsurance_template.csv" target="_blank">Vendor Insurance</a></li><li><a href="resources/import/vendorutility_template.csv" target="_blank">Vendor Utility Account</a></li></ul>' :
    '<b>Vendor Worksheets</b>' +
        '<ul>' +
            '<li><a href="resources/import/vendor_template.csv" target="_blank">Vendors</a></li>' +
            '<li><a href="resources/import/vendorgl_template.csv" target="_blank">Vendor GL Assignment</a></li>' +
            '<li><a href="resources/import/vendorfav_template.csv" target="_blank">Vendor Favorites</a></li>' +
            '<li><a href="resources/import/vendorinsurance_template.csv" target="_blank">Vendor Insurance</a></li>' +
            '<li><a href="resources/import/vendorutility_template.csv" target="_blank">Vendor Utility Account</a></li>' +
        '</ul>',

    '<b>Custom Field Worksheets</b><ul><li><a href="resources/import/customfields_template.csv" target="_blank">Custom Field - Header</a></li><li><a href="resources/import/customfields_template.csv" target="_blank">Custom Field - Line Item</a></li></ul>' :
    '<b>Custom Field Worksheets</b>' +
        '<ul>' +
            '<li><a href="resources/import/customfields_template.csv" target="_blank">Custom Field - Header</a></li>' +
            '<li><a href="resources/import/customfields_template.csv" target="_blank">Custom Field - Line Item</a></li>' +
        '</ul>',

    '<b>Splits Worksheets</b><ul><li><a href="resources/import/split_template.csv" target="_blank">Splits</a></li></ul>' :
    '<b>Splits Worksheets</b>' +
        '<ul>' +
            '<li><a href="resources/import/split_template.csv" target="_blank">Splits</a></li>' +
        '</ul>',

    'Contact Name'          : 'Contact Name',
    'Address1'              : 'Address1',
    'Address2'              : 'Address2',
	'PO Matching Threshhold': 'PO Matching Threshhold',
	'Custom Field 1'        : 'Custom Field 1',
	'Custom Field 2'        : 'Custom Field 2',
	'Custom Field 3'        : 'Custom Field 3',
	'Custom Field 4'        : 'Custom Field 4',

	'Bedrooms'  : 'Bedrooms',
	'Bathrooms' : 'Bathrooms',
	'Carpet Yd' : 'Carpet Yd',
	'Vinyl Yd'  : 'Vinyl Yd',
	'Tile Yd'   : 'Tile Yd',
	'Harwood Yd': 'Harwood Yd',
	'Carpet Ft' : 'Carpet Ft',
	'Vinyl Ft'  : 'Vinyl Ft',
	'Tile Ft'   : 'Tile Ft',
	'Harwood Ft': 'Harwood Ft',

	'User {property} Assignment': 'User {property} Assignment',
	'User {property}'           : 'User {property}',
	'Create New {property}'     : 'Create New {property}',

	'Select {regions}...'  : 'Select {regions}...',
	'Multiple {properties}': 'Multiple {properties}',
	'All {properties}'     : 'All {properties}',

	'Utility Account': 'Utility Account',

	'Choose {property} first': 'Choose {property} first',
	'Default GL Account'     : 'Default GL Account',
	'Meter Number'           : 'Meter Number',
	'Default {unit}'         : 'Default {unit}',
	'Account Number'         : 'Account Number',
	'Utility Type'           : 'Utility Type',

	'{unit} Type'                               : '{unit} Type',
	'View {unit}s Not Assigned to a {unit} Type': 'View {unit}s Not Assigned to a {unit} Type',
	'Add {unit} Type'                           : 'Add {unit} Type',

	/**
	 * INVOICE SECTION
	 */

	'Created On'           : 'Created On',
	'Created By'           : 'Created By',
	'Remittance Advice'    : 'Remittance Advice',
	'Pay By'               : 'Pay By',
	'Invoice Total'        : 'Invoice Total',
	'Invoice Date'         : 'Invoice Date',
	'Invoice {postPeriod}': 'Invoice {postPeriod}',
	'Associated POs'       : 'Associated POs',
	'Vendor Code'          : 'Vendor Code',
	'Cycle From'           : 'Cycle From',
	'Cycle To'             : 'Cycle To',

	/**
	 *  WORKFLOW MANAGEMENT
	 */
	'Workflow Definitions' : 'Workflow Definitions',
	'Workflow Rules'       : 'Workflow Rules',
	'Rule Builder'         : 'Rule Builder',
	'Rule Summary'         : 'Rule Summary',
	'Rule Routes'          : 'Rule Routes',

	'Rule Name'              : 'Rule Name',
	'Rule Type'              : 'Rule Type',
	'Originates From'        : 'Originates From',
	'Group/User'             : 'Group/User',
	'Forward To'             : 'Forward To',
	'Property'               : 'Property',
	'Threshold'              : 'Threshold',
	'Unassigned Users'       : 'Unassigned Users',
	'Assigned Users'         : 'Assigned Users',
	'Unassigned User Groups' : 'Unassigned User Groups',
	'Assigned User Groups'   : 'Assigned User Groups',

	'No Rules Applied'                          : 'No Rules Applied',
	'If Amount'                                 : 'If Amount',
	'Applied to Properties'                     : 'Applied to Properties',
	'ALL Properties'                            : 'ALL Properties',
	'SPECIFIC Properties'                       : 'SPECIFIC Properties',
	'Properties'                                : 'Properties',
	'ALL'                                       : 'ALL',
	'SPECIFIC'                                  : 'SPECIFIC',
	'From'                                      : 'From',
	'To'                                        : 'To',
	'If variance is'                            : 'If variance is',
	'If total amount is'                        : 'If total amount is',
	'Last Update Date'                          : 'Last Update Date',
	'Email Suppression'                         : 'Email Suppression',
	'Never Suppress Email'                      : 'Never Suppress Email',
	'Suppress Email for {supression} hours'     : 'Suppress Email for {supression} hours',
	'Suppress Email for the rest of the period' : 'Suppress Email for the rest of the period',

	'LESS THAN' : 'LESS THAN',
	'GREATER THAN' : 'GREATER THAN',
	'GREATER THAN OR EQUAL TO' : 'GREATER THAN OR EQUAL TO',
	'GREATER THAN EQUAL TO OR LESS THAN' : 'GREATER THAN EQUAL TO OR LESS THAN',
	'IN RANGE' : 'IN RANGE',

	'--ALL--'                    : '--ALL--',
	'User Group'                 : 'User Group',
	'Filter by'                  : 'Filter by',
	'Workflow Rule - {rulename}' : 'Workflow Rule - {rulename}',

	'Delete Forward?' : 'Delete Forward?',
	'Are you sure you want to delete this \'Forward\' from this rule?' : 'Are you sure you want to delete this \'Forward\' from this rule?',
	'Warning!' : 'Warning!',
	'Originates From/Forward To information must be complete before the rule can be activated. Continue?' : 'Originates From/Forward To information must be complete before the rule can be activated. Continue?',

	'Conflicts with these rules'                  : 'Conflicts with these rules',
	'Edit this rule > Admin_Invoice > {rulename}' : 'Edit this rule > Admin_Invoice > {rulename}',
	'Delete conflicting rules'                    : 'Delete conflicting rules'
});