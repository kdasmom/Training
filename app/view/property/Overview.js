/**
 * Property Setup > Overview section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.Overview', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.property.overview',
    
    requires: ['NP.lib.core.Config'],

    title: 'Overview',

    margin: 8,

	introText         : 'The ' + NP.Config.getPropertyLabel() + ' Setup section lists all ' + NP.Config.getPropertyLabel(true).toLowerCase() +', broken into three tabs: Current, On Hold, and Inactive.  Current ' + NP.Config.getPropertyLabel(true).toLowerCase() + ' includes the full list of ' + NP.Config.getPropertyLabel(true).toLowerCase() + ' that are available for use in the system.  On Hold ' + NP.Config.getPropertyLabel(true).toLowerCase() + ' includes the full list of ' + NP.Config.getPropertyLabel(true).toLowerCase() + ' that are in the process of being set up in the system or are in the process of being made inactive.  On Hold ' + NP.Config.getPropertyLabel(true).toLowerCase() + ' can not be assigned to a PO or Invoice but their historical information can still be included on reports.  Inactive ' + NP.Config.getPropertyLabel(true).toLowerCase() + ' include the full list of ' + NP.Config.getPropertyLabel(true).toLowerCase() + ' that are no longer in use on the system.  Inactive ' + NP.Config.getPropertyLabel(true).toLowerCase() +  ' are not available to be included on any reports.',
	reminderText      : '<b><i>Reminder</i></b>, the following fields are required to be completed before a new ' + NP.Config.getPropertyLabel().toLowerCase() + ' can be added to the system.',
	propertyStatusText: '<b>' + NP.Config.getPropertyLabel() + ' Status: </b>defaults to &quot;On Hold&quot; once the ' + NP.Config.getPropertyLabel().toLowerCase() + ' has been saved',
	propertyCodeText  : '<b>' + NP.Config.getPropertyLabel() + ' Code:</b> a unique code identifier for this ' + NP.Config.getPropertyLabel().toLowerCase() + ' found in your GL Package',
	propertyApCodeText: '<b>' + NP.Config.getPropertyLabel() + ' AP Code:</b> use this to further identify the ' + NP.Config.getPropertyLabel().toLowerCase() + ' (this is not required)',
	departmentCodeText: '<b>Department Code:</b> use this in conjunction with the AP Code to even further identify the ' + NP.Config.getPropertyLabel().toLowerCase() + ' (this is not required)',
	propertyNameText  : '<b>' + NP.Config.getPropertyLabel() + ' Name:</b> enter the name that should be used to refer to the ' + NP.Config.getPropertyLabel().toLowerCase() + '',
	totalUnitsText    : '<b>Total # of ' + NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit') + 's/Square Feet:</b> enter the number of ' + NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'unit').toLowerCase() + 's or square feet in the building',
	attentionText     : '<b>Attention: </b>enter the name of the contact person for the ' + NP.Config.getPropertyLabel().toLowerCase() + '',
	addressText       : '<b>Address, City, State, Zip: </b>enter the address of the ' + NP.Config.getPropertyLabel().toLowerCase() + '',
	phoneNumberText   : '<b>Phone number: </b>enter the phone number of the ' + NP.Config.getPropertyLabel().toLowerCase() + '',
	regionText        : '<b>' + NP.Config.getSetting('PN.main.RegionLabel', 'Region') + ': </b>use the drop down list to select the ' + NP.Config.getSetting('PN.main.RegionLabel', 'Region') + ' where the ' + NP.Config.getPropertyLabel().toLowerCase() + ' is located.  ',
	syncText          : '<b>Sync ' + NP.Config.getPropertyLabel() + ':</b> Yes/No - indicate whether the ' + NP.Config.getPropertyLabel().toLowerCase() + ' should sync actuals, invoices, and budgets with the backend accounting package',
	accrualCashText   : '<b>Accrual or Cash:</b> indicate whether the ' + NP.Config.getPropertyLabel().toLowerCase() + ' uses cash or accrual based accounting methods',
	calendarText      : '<b>Closing Calendar:</b> indicates which closing calendar (which day of the month the fiscal period rolls) will be used by the ' + NP.Config.getPropertyLabel().toLowerCase() + ' ',
	salesTaxText      : '<b>' + NP.Config.getPropertyLabel() + ' ' + NP.Config.getSetting('PN.General.salesTaxTerm', 'Sales Tax') + ':</b>  enter the default ' + NP.Config.getSetting('PN.General.salesTaxTerm', 'Sales Tax').toLowerCase() + ' for the ' + NP.Config.getPropertyLabel().toLowerCase() + ' that will be used to assist with the entry of ' + NP.Config.getSetting('PN.General.salesTaxTerm', 'Sales Tax').toLowerCase() + ' on new purchase orders and invoices; enter the ' + NP.Config.getSetting('PN.General.salesTaxTerm', 'Sales Tax').toLowerCase() + ' percentage as a decimal point (e.g., enter a 7% tax as .07)',
	thresholdText     : '<b>Acceptable PO Matching Threshold:</b>  enter the percentage an Invoice amount can exceed its Purchase Order amount before the invoice is routed for approval; enter the percentage as a whole number (e.g., enter 5% as 5) ',
	startMonthText    : '<b>Fiscal Calendar Start Month:</b>  indicates which month of the year the fiscal calendar begins',

    initComponent: function() {
    	var that = this;

    	this.html = 
    		this.introText +
	    	'<br /><br />' +
	    	this.reminderText +
	    	'<br /><br />' +
			'<ul>';

			Ext.Array.each(['propertyStatus','propertyCode','propertyApCode','departmentCode',
							'propertyName','totalUnits','attention','address','phoneNumber',
							'region','sync','accrualCash','calendar','salesTax','threshold',
							'startMonth'], function(val) {
				that.html += '<li>' + that[val + 'Text'] + '</li>';
			});

			this.html += '</ul>';

	    this.callParent(arguments);
    }
});