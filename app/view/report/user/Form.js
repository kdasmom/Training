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
        'NP.view.report.ReportFormatField',
        'NP.store.report.UserReports',
        'NP.view.shared.ContextPickerMulti',
        'NP.view.shared.ReportTypeCombo'
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
            {
                xtype: 'shared.button.report',
                text: NP.Translator.translate('Generate Report')
            }
        ];

        me.defaults = { labelWidth: 260 };

        me.items = [
            {
                xtype: 'shared.reporttypecombo',
                store            : { type: 'report.userreports' },
                listeners        : {
                    select: function(combo, recs) {
                        me.selectReport(recs[0].get('report_name'));
                    }
                }
            },
            {
                xtype: 'report.reportformatfield',
                itemId: 'report_format'
            },
            {
                xtype: 'customcombo',
                itemId: 'user_status',
                selectFirstRecord: true,
                name: 'user_status',
                valueField: 'user_status',
                displayField: 'user_status_display',
                fieldLabel: NP.Translator.translate('Status'),
                store: Ext.create('Ext.data.Store', {
                    fields: ['user_status', 'user_status_display'],
                    data: [
                        { user_status: '', user_status_display: NP.Translator.translate('All Users') },
                        { user_status: 'active', user_status_display: NP.Translator.translate('Active Users') },
                        { user_status: 'inactive', user_status_display: NP.Translator.translate('Inactive Users') }
                    ]
                })
            },
            {
                xtype           : 'customcombo',
                name            : 'group_id',
                itemId          : 'group_id',
                fieldLabel      : NP.Translator.translate('Group'),
                store           : 'user.RoleTree',
                width           : 500,
                valueField      : 'role_id',
                displayField    : 'role_name',
                emptyText       : NP.Translator.translate('All'),
                tpl             :
                    '<tpl for=".">' +
                        '<li class="x-boundlist-item">' +
                            '{indent_text}{role_name}' +
                        '</li>' +
                    '</tpl>'
            },
            {
                xtype     : 'fieldcontainer',
                fieldLabel: NP.Config.getPropertyLabel(),
                items     : [{ xtype: 'shared.contextpickermulti', itemId: 'property_picker' }]
            }
        ];
        me.callParent(arguments);
    }
});