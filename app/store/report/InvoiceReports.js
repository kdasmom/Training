/**
 * Store for invoice reports
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.report.InvoiceReports', {
    extend: 'NP.lib.data.Store',
    alias : 'store.report.invoicereports',
	
	requires: ['NP.lib.core.Translator'],
	
	fields: [
        { name: 'report_name' },
        { name: 'report_display_name' }
    ],

    data: [
    	{ report_name: 'invoice.Summary', report_display_name: 'Summary' }
    ],

    constructor: function() {
    	var me = this;

    	me.callParent(arguments);

		// We need the locale to be loaded before we can run this because we need to localize the text
		NP.Translator.on('localeloaded', function() {
			var recs = me.getRange();
			for (var i=0; i<recs.length; i++) {
				recs[i].set('report_display_name', NP.Translator.translate(recs[i].get('report_display_name')));
			}
		});
    }
});