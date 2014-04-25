/**
 * Created by Andrey Baranov
 * date: 4/4/2014 2:38 PM
 */

Ext.define('NP.view.report.gl.Form', {
	extend: 'NP.view.report.AbstractReportForm',
	alias : 'widget.report.gl.form',

	requires: [
		'NP.lib.ui.ComboBox',
		'NP.lib.data.Store',
		'NP.view.shared.button.Report',
		'NP.view.report.ReportFormatField',
        'NP.store.gl.GlAccountTypes',
        'NP.view.shared.IntegrationPackagesCombo'
	],

	initComponent: function() {
		var me = this;

		me.title = NP.Translator.translate('Gl Account Report Tool');

		me.tbar = [
			{
				xtype: 'shared.button.report',
				text: NP.Translator.translate('Generate Report')
			}
		];

		me.defaults = {
			labelWidth: 150,
			width:		350
		};

		me.items = [
			{
				xtype: 'hiddenfield',
				name: 'report_type',
				itemId: 'report_type',
				value: 'gl.GlAccount'
			},
			{
                xtype: 'report.reportformatfield',
                itemId: 'report_format'
            },
            {
                xtype: 'shared.integrationpackagescombo',
                storeAutoLoad: true,
                editable: false,
                typeAhead: false,
                allowBlank: false,
				selectFirstRecord: true,
                listeners: {
                    change: function(combo, newValue, oldValue, eOpts) {
                        var store = me.getForm().findField('glaccount_category').getStore();
                        Ext.apply(store.getProxy().extraParams, {
                            integration_package_id: newValue
                        });
                        store.reload();
                    }
                }
            },
            {
                xtype       : 'customcombo',
                name        : 'glaccounttype_id',
                queryMode   : 'local',
                fieldLabel  :  NP.Translator.translate('GL Type'),
                store       : {
                    type        : 'gl.glaccounttypes',
                    service     : 'GLService',
                    action      : 'getTypes',
                    autoLoad    : true
                },
                typeAhead   : false,
                multiSelect : true,
                displayField: 'glaccounttype_name',
                valueField  : 'glaccounttype_id',
                emptyText   : NP.Translator.translate('All')
            },
            {
                xtype     : 'customcombo',
                name      : 'glaccount_category',
                fieldLabel: NP.Translator.translate('Gl Category'),
                store     : {
                    type       : 'gl.glaccounts',
                    service    : 'GLService',
                    action     : 'getReportCategories'
                },
                displayField: 'glaccount_name',
                valueField  : 'glaccount_id',
                emptyText   : NP.Translator.translate('All'),
                tpl: new Ext.XTemplate(
                    '<tpl for="." >',
                    '<div class="x-boundlist-item">',
                    '{glaccount_name} ',
                    '<tpl if="glaccount_status == \'inactive\'">',
                    '(Inactive)',
                    '</tpl>',
                    '</div>',
                    '</tpl>'),
                emptyText   : 'All',
                typeAhead   : false,
                multiSelect : true
            },
            {
                xtype     : 'customcombo',
                name      : 'glaccount_order',
                fieldLabel: NP.Translator.translate('Gl Order'),
                store     : Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    data: [
                        {name: 'Gl Name', value: 'glaccount_name'},
                        {name: 'Gl Number', value: 'glaccount_number'}
                    ]
                }),
                displayField: 'name',
                valueField  : 'value',
                selectFirstRecord: true
            },
            {
                xtype     : 'customcombo',
                name      : 'glaccount_status',
                fieldLabel: NP.Translator.translate('Gl Status'),
                store     : Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    data: [
                        {name: 'Active', value: 'active'},
                        {name: 'Inactive', value: 'inactive'}
                    ]
                }),
                displayField: 'name',
                valueField  : 'value',
                emptyText   : NP.Translator.translate('All')
            }
		];

		me.callParent(arguments);
	},

    getReport: function() {
        return Ext.create('NP.view.report.gl.GlReport');
    }
});