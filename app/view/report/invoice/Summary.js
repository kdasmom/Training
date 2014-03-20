/**
 * Definition for Invoice Summary report
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.report.invoice.Summary', {
	extend: 'NP.view.report.invoice.AbstractInvoiceReport',
	
	setupForm: function() {
		var me = this;

		me.getDateFilter().setFilterTypeVisibility({
			periodRange: 'show',
			period     : 'hide',
			cycleFrom  : 'hide',
			cycleTo    : 'hide',
			approval   : 'show',
			hold       : 'hide',
			created    : 'show',
			received   : 'hide',
			invoice    : 'show',
			po         : 'hide',
			due        : 'hide',
			submitted  : 'show',
			paid       : 'show',
			quarter    : 'show',
			neededBy   : 'hide',
			voided     : 'hide',
			sentToGl   : 'hide'
		});
	},

	validateForm: function() {
		return this.getDateFilter().isValid();
	},

	getOptions: function() {
		var me         = this,
			dateFilter = me.getDateFilter().getState();

		return {
			propertyContext  : me.getPropertyContext(),
			dateFilterName   : dateFilter.filterName,
			dateType         : dateFilter.dateType,
			dateFrom         : Ext.Date.format(dateFilter.dateFrom, 'Y-m-d'),
			dateTo           : Ext.Date.format(dateFilter.dateTo, 'Y-m-d')
		}
	},

	getExtraParams: function() {
		var me         = this,
			dateFilter = me.getDateFilter().getState(),
			form       = me.getForm(),
			vendor_id  = form.findField('vendor_id').getValue();

		return {
			date_filter     : dateFilter.filterType,
			only_without_pos: form.findField('only_without_pos').getValue(),
			only_cap_ex     : form.findField('only_cap_ex').getValue(),
			vendor_id       : (vendor_id) ? vendor_id : null,
			invoice_status  : form.findField('invoice_status').getValue(),
			created_by      : form.findField('created_by').getValue(),
			approved_by     : form.findField('approved_by').getValue()
		};
	}
});