/**
 * Radio group field for report format
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.report.ReportFormatField', {
	extend: 'Ext.form.RadioGroup',
    alias: 'widget.report.reportformatfield',

	requires: ['NP.lib.core.Translator'],

	initComponent: function() {
		var me = this;

		Ext.apply(me, {
			fieldLabel: NP.Translator.translate('Report Format'),
			layout    : 'hbox',
			defaults  : { name: 'format', margin: '0 8 0 0' },
			items     : [
				{ boxLabel: 'HTML', inputValue: 'html', checked: true },
				{ boxLabel: 'PDF', inputValue: 'pdf' },
				{ boxLabel: 'Excel', inputValue: 'excel' }
			]
		});

		this.callParent(arguments);
	},

	getFormat: function() {
		return this.getValue().format;
	}
});