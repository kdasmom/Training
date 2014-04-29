/**
 * View that displays form for choosing which invoice report to run
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.report.AbstractReportForm', {
	extend: 'Ext.form.Panel',

	border     : false,
	bodyPadding: 8,
	
	initComponent: function() {
		var me = this;

		if (!me.title) {
			throw 'You must define a title for the report form';
		}

		me.callParent();

		// Checks if there's a report type field and if so adds a listener to it
		var report_type = Ext.ComponentQuery.query('#report_type');
		if (report_type !== null && report_type.length > 0) {
			report_type[0].on('select', me.selectReport);
		}

		// By defaults, runs select report to initialize the report selected by default
		me.on('afterrender', function() {
			me.selectReport();
		});
	},

	// This can be overriden if needed
	getGenerateReportButton: function() {
		return this.down('[xtype="shared.button.report"]');
	},

	// This can be overriden if needed
	getReportType: function() {
		var report_type = Ext.ComponentQuery.query('#report_type');
		if (report_type.length) {
			return Ext.ComponentQuery.query('#report_type')[0].getValue();
		}

		return null;
	},
	
	// This can be overriden if needed
	getReportFormat: function() {
		return Ext.ComponentQuery.query('#report_format')[0].getValue().format;
	},

	// This can be overriden if needed
	getReport: function() {
		return Ext.create('NP.view.report.' + this.getReportType());
	},

	// This can be overriden if needed
	selectReport: function() {
        if (this.getReport) {
            this.getReport().setupForm();
        }
	}
});