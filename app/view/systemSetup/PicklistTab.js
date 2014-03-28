/**
 * Created by Andrey Baranov
 * date: 2/17/14 10:31 AM
 */


Ext.define('NP.view.systemSetup.PicklistTab', {
	extend: 'Ext.container.Container',
	alias: 'widget.systemsetup.picklisttab',

	requires: [
		'NP.lib.core.Translator'
	],

	layout: {
		type: 'hbox',
		align: 'stretch'
	},
	autoScroll: true,

	padding: '10',

	initComponent: function() {
		var me  = this;

		me.title = NP.Translator.translate(me.title);

		this.items = [
			{
				xtype: 'customgrid',
				hideHeaders: true,
				name: 'picklistcolumns',
				columns: [
					{
						dataIndex: 'column_data',
						sortable: false,
						flex: 1
					}
				],
				store: Ext.create('NP.lib.data.Store', {
					service    	: 'PicklistService',
					action     	: 'getPicklistValuesList',
					extraFields:{
						mode: me.mode
					},
					autoLoad	: false,
					fields: ['column_data', 'column_pk_data', 'column_status']
				}),
				padding: '5',
				flex: 0.2,
				maxWidth: 300,
				height: 300
			},
			{
				xtype: 'form',
				name: 'picklistfields',
				autoScroll: true,
				defaults: {
					labelWidth: 200,
					padding: '5'
				},
				tbar : [
					{
						xtype: 'shared.button.cancel',
						text: 'Reset'
					},
					{
						xtype: 'shared.button.save'
					}
				],
				padding: '5',
				border: 1,
				flex: 1,
				height: 400
			}
		];

		me.listeners = {
			afterrender: function() {
				me.down('customgrid').getStore().reload();
			}
		};

		me.callParent(arguments);
	}
});