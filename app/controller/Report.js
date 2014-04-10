/**
 * The Report controller deals with operations in the Reports section of the app
 *
 * @author Thomas Messier
 */
Ext.define('NP.controller.Report', {
	extend: 'NP.lib.core.AbstractController',
	
	models: [],

	stores: [],

	views: ['report.invoice.Form'],

	requires: [
		'NP.view.report.invoice.Summary'
	],

	refs: [
		{ ref: 'reportFormat', selector: '#report_format' },
		{ ref: 'propertyPicker', selector: '#property_picker' }
	],

	init: function() {
		var me = this;

		// Setup event handlers
		me.control({
			
		});
	},

	show: function(section) {
		var me = this;


        me.currentForm = me.setView('NP.view.report.' + section + '.Form');
		me.currentForm.getGenerateReportButton().on('click', me.generateReport.bind(me));
	},

	generateReport: function() {
		var me         = this,
			reportType = me.currentForm.getReportType(),
			format     = me.currentForm.getReportFormat(),
			report     = me.currentForm.getReport();

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