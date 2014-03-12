/**
 * The AbstractInvoiceReport class defines some standard functions only relevant for invoice
 * reports and should be extended by those
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.report.invoice.AbstractInvoiceReport', {
	extend: 'NP.view.report.AbstractReport',

	requires: ['NP.lib.core.Security'],

	getForm: function() {
		return Ext.ComponentQuery.query('[xtype="report.invoiceform"]')[0].getForm();
	},

	getPropertyPicker: function() {
		return Ext.ComponentQuery.query('#property_picker')[0];
	},

	getDateFilter: function() {
		return Ext.ComponentQuery.query('#date_filter')[0];
	},

	getPropertyContext: function() {
		var me              = this,
			propertyContext = me.getPropertyPicker().getState();

		Ext.apply(propertyContext, {
			userprofile_id              : NP.Security.getUser().get('userprofile_id'),
			delegation_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id'),
			selection                   : propertyContext.selected,
			includeCodingOnly           : false
		});

		return propertyContext;
	}
});