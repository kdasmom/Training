/**
 * System Setup: Picklist section
 *
 * @author Witold Frackiewicz - Testerix
 */
Ext.define('NP.view.systemSetup.Picklists', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.systemsetup.picklists',

    requires: ['NP.lib.core.Translator'],
    
    title: 'Picklist',

	layout: {
		type: 'hbox',
		align: 'stretch'
	},
	padding: '5',
	autoScroll: true,

    initComponent: function() {
		var me = this,
			modes = [
				['Insurance', 'Insurance Management'],
				['Payee', 'Payee Type'],
				['Rejection', 'Rejection Notes'],
				['TaxPayor', 'Tax Payor Type'],
				['On_Hold', 'On Hold Notes'],
				['Vendor_Types', 'Vendor Types'],
				['Vendor_Documents', 'Vendor Document Types'],
				['PayBy', 'Pay By Types'],
				['UtilityType', 'Utility Types']
			];

    	this.title = NP.Translator.translate(this.title);



		this.items = [
			{
				xtype: 'customgrid',
				hideHeaders: true,
				name: 'picklistmodes',
				columns: [
					{
						dataIndex: 'title',
						sortable : false,
						flex: 1
					}
				],
				store: Ext.create('Ext.data.ArrayStore', {
					fields: [
						{ name: 'mode'},
						{ name: 'title' }
					],
					autoLoad : true,
					data: modes
				}),
				border: 1,
				padding: '5',
				flex: 0.2,
				maxWidth: 300
			},
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
					mode	: 'Insurance',
					autoLoad	: true,
					fields: ['column_data', 'column_pk_data', 'column_status']
				}),
				padding: '5',
				flex: 0.2,
				maxWidth: 300
			}
		];

    	this.callParent(arguments);
    }
});