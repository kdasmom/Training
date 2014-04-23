/**
 * Created by Andrey Baranov on 10.04.2014.
 */
Ext.define('NP.store.report.UserReports', {
    extend: 'NP.lib.data.Store',
    alias : 'store.report.userreports',

    requires: ['NP.lib.core.Translator'],

    fields: [
        { name: 'report_name' },
        { name: 'report_display_name' }
    ],

    data: [
        { report_name: 'user.Summary', report_display_name: 'User Summary Report' },
        { report_name: 'user.GroupRights', report_display_name: 'User Group Rights Report' },
        { report_name: 'user.GroupRightsComparison', report_display_name: 'User Group Rights Comparison Report' }
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