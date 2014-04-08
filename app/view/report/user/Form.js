/**
 * Created by Andrey Baranov on 08.04.2014.
 */

Ext.define('NP.view.report.user.Form', {
    extend: 'NP.view.report.AbstractReportForm',
    alias : 'widget.report.user.form',

    requires: [
        'NP.lib.ui.ComboBox',
        'NP.lib.data.Store',
        'NP.view.shared.button.Report',
        'NP.view.report.ReportFormatField'
    ],

    initComponent: function() {
        var me = this;

        me.title = NP.Translator.translate('User Report Tool');

        me.tbar = [
            {
                xtype: 'shared.button.cancel'
            },
            {
                xtype: 'shared.button.back'
            },
            { xtype: 'shared.button.report', text: NP.Translator.translate('Generate Report') }
        ];

        me.defaults = { labelWidth: 260 };

        me.items = [];
        me.callParent(arguments);
    }
});