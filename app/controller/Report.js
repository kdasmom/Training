/**
 * The Report controller deals with operations in the Reports section of the app
 *
 * @author Thomas Messier
 */
Ext.define('NP.controller.Report', {
	extend: 'NP.lib.core.AbstractController',
	
	models: [],

	stores: [],

	views: ['report.InvoiceForm'],

	requires: [
		'NP.view.report.invoice.InvoiceSummary'
	],

	refs: [
		{ ref: 'reportType', selector: '#report_type' },
		{ ref: 'reportFormat', selector: '#report_format' },
		{ ref: 'propertyPicker', selector: '#property_picker' }
	],

	init: function() {
		var me = this;

		// Setup event handlers
		me.control({
			'[xtype="report.invoiceform"] [xtype="shared.button.report"]': {
				click: me.generateReport
			},
			'#report_type': {
				select: function(combo, selRecs) {
					me.selectReport(selRecs[0].get('report_name'));
				}
			}
		});
	},

	invoice: function() {
		var me = this;

		me.setView('NP.view.report.InvoiceForm');

		me.selectReport('invoice.InvoiceSummary');
	},

	selectReport: function(report_name) {
		this.getReport(report_name).initForm();
	},

	getReport: function(report_name) {
		return Ext.create('NP.view.report.' + report_name);
	},

	getFormat: function() {
		return this.getReportFormat().getFormat();
	},

	generateReport: function() {
		var me         = this,
			reportType = me.getReportType().getValue(),
			format     = me.getFormat(),
			report     = me.getReport(reportType);

		if (report.validateForm()) {
			var reportWinName = 'report_' + reportType,
				body          = Ext.getBody(),
				win           = window.open('about:blank', reportWinName);

			Ext.DomHelper.append(
				body,
				'<form id="__reportForm" action="report.php" target="' + reportWinName + '" method="post">' +
					'<input type="hidden" id="__report" name="report" />' +
					'<input type="hidden" id="__format" name="format" />' +
					'<input type="hidden" id="__options" name="options" />' +
					'<input type="hidden" id="__extraParams" name="extraParams" />' +
				'</form>'
			);

			Ext.get('__report').set({ value: reportType });
			Ext.get('__format').set({ value: format });
			Ext.get('__options').set({ value: Ext.JSON.encode(report.getOptions()) });
			Ext.get('__extraParams').set({ value: Ext.JSON.encode(report.getExtraParams()) });
			
			var form = Ext.get('__reportForm');
			form.dom.submit();
			Ext.destroy(form);
		}
	}
});