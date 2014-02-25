/**
 * Created by Andrey Baranov
 * date: 1/20/14 2:32 PM
 */

Ext.define('NP.view.systemSetup.CustomFieldsServiceFields', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.systemsetup.customfieldsservicefields',

	requires: ['NP.lib.core.Translator'],

	padding: '5',
	border: false,
	layout: {
		type: 'hbox',
		align: 'stretch'
	},

	initComponent: function() {
		var me  = this;

		this.title = NP.Translator.translate(this.title);

		this.items = [
			{
				xtype: 'customgrid',
				name: 'headerfields',
				border: false,
				flex: 1,
				columns: [
					{
						xtype: 'systemsetup.gridcol.fieldnumber',
						flex: 0.5,
						renderer: function(val, meta, rec) {
							return val[val.length - 1];
						}
					},
					{
						xtype: 'systemsetup.gridcol.label',
						flex: 1
					},
					{
						xtype: 'systemsetup.gridcol.po',
						flex: 0.2,
						align: 'center'
					}

				],
				store: Ext.create('NP.lib.data.Store', {
					service    	: 'ConfigService',
					action     	: 'getCustomFields',
					extraParams	:{
						fieldname: 'serviceField'
					},
					autoLoad	: false,
					fields: ['customfield_id', 'controlpanelitem_name', 'controlpanelitem_value', 'controlpanelitem_required', 'po_on_off', 'po_req']
				})
			}
		];

		this.callParent(arguments);
	}
});