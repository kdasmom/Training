/**
 * Property Setup > Overview section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.Overview', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.property.overview',
    
    requires: [
    	'NP.lib.core.Config',
    	'NP.lib.core.Translator'
    ],

    title: 'Overview',

    margin: 8,

	initComponent: function() {
    	var that = this;

    	that.translateText();

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
    },

    translateText: function() {
    	var me = this,
			propertyText   = NP.Config.getPropertyLabel(),
			propertiesText = NP.Config.getPropertyLabel(true),
			regionText     = NP.Config.getSetting('PN.Main.RegionLabel', 'Region'),
			unitText       = NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit'),
			taxText        = NP.Config.getSetting('PN.General.salesTaxTerm', 'Sales Tax');

    	me.introText          = NP.Translator.translate('The {property} Setup section lists all {properties}, broken into three tabs: Current, On Hold, and Inactive.  Current {properties} includes the full list of {properties} that are available for use in the system.  On Hold {properties} includes the full list of {properties} that are in the process of being set up in the system or are in the process of being made inactive.  On Hold {properties} can not be assigned to a PO or Invoice but their historical information can still be included on reports.  Inactive {properties} include the full list of {properties} that are no longer in use on the system. Inactive {properties} are not available to be included on any reports.', { property: propertyText, properties: propertiesText });
		me.reminderText       = NP.Translator.translate('<b><i>Reminder</i></b>, the following fields are required to be completed before a new {property} can be added to the system.', { property: propertyText });
		me.propertyStatusText = NP.Translator.translate('<b>{property} Status: </b>defaults to &quot;On Hold&quot; once the {property} has been saved', { property: propertyText });
		me.propertyCodeText   = NP.Translator.translate('<b>{property} Code:</b> a unique code identifier for this {property} found in your GL Package', { property: propertyText });
		me.propertyApCodeText = NP.Translator.translate('<b>{property} AP Code:</b> use this to further identify the {property} (this is not required)', { property: propertyText });
		me.departmentCodeText = NP.Translator.translate('<b>Department Code:</b> use this in conjunction with the AP Code to even further identify the {property} (this is not required)', { property: propertyText });
		me.propertyNameText   = NP.Translator.translate('<b>{property} Name:</b> enter the name that should be used to refer to the {property}', { property: propertyText });
		me.totalUnitsText     = NP.Translator.translate('<b>Total # of {unit}s/Square Feet:</b> enter the number of {unit}s or square feet in the building', {unit: unitText});
		me.attentionText      = NP.Translator.translate('<b>Attention: </b>enter the name of the contact person for the {property}', { property: propertyText });
		me.addressText        = NP.Translator.translate('<b>Address, City, State, Zip: </b>enter the address of the {property}', { property: propertyText });
		me.phoneNumberText    = NP.Translator.translate('<b>Phone number: </b>enter the phone number of the {property}', { property: propertyText });
		me.regionText         = NP.Translator.translate('<b>{region}: </b>use the drop down list to select the {region} where the {property} is located.', { region: regionText, property: propertyText });
		me.syncText           = NP.Translator.translate('<b>Sync {property}:</b> Yes/No - indicate whether the {property} should sync actuals, invoices, and budgets with the backend accounting package', { property: propertyText });
		me.accrualCashText    = NP.Translator.translate('<b>Accrual or Cash:</b> indicate whether the {property} uses cash or accrual based accounting methods', { property: propertyText });
		me.calendarText       = NP.Translator.translate('<b>Closing Calendar:</b> indicates which closing calendar (which day of the month the fiscal period rolls) will be used by the {property}', { property: propertyText });
		me.salesTaxText       = NP.Translator.translate('<b>{property} {salesTax}:</b>  enter the default {salesTax} for the {property} that will be used to assist with the entry of {salesTax} on new purchase orders and invoices; enter the {salesTax} percentage as a decimal point (e.g., enter a 7% tax as .07)', { property: propertyText, salesTax: taxText });
		me.thresholdText      = NP.Translator.translate('<b>Acceptable PO Matching Threshold:</b>  enter the percentage an Invoice amount can exceed its Purchase Order amount before the invoice is routed for approval; enter the percentage as a whole number (e.g., enter 5% as 5)');
		me.startMonthText     = NP.Translator.translate('<b>Fiscal Calendar Start Month:</b>  indicates which month of the year the fiscal calendar begins');
    }
});