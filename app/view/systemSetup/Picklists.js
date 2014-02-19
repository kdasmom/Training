/**
 * System Setup: Picklist section
 *
 * @author Witold Frackiewicz - Testerix
 */
Ext.define('NP.view.systemSetup.Picklists', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.systemsetup.picklists',

    requires: [
		'NP.lib.core.Translator',
		'NP.view.systemSetup.PicklistTab'
	],
    
    title: 'Picklist',
	autoScroll: true,
	layout: {
		type: 'vbox',
		align: 'stretch'
	},

    initComponent: function() {
		var me = this;


		this.tbar = [
			{
				xtype: 'shared.button.cancel',
				name: 'backToOverview'
			}
		];

    	this.title = NP.Translator.translate(this.title);

		this.items = [
			{
				xtype : 'verticaltabpanel',
				border: false,
				flex: 1,
				items: [
					{
						xtype: "systemsetup.picklisttab",
						title: 'Insurance Management',
						mode: 'Insurance',
						name: 'insurance'

					},
					{
						xtype: "systemsetup.picklisttab",
						title: 'Payee Type',
						mode: 'Payee',
						name: 'payee'
					},
					{
						xtype: "systemsetup.picklisttab",
						title: 'Rejection Notes',
						mode: 'Rejection',
						name: 'rejection'
					},
					{
						xtype: "systemsetup.picklisttab",
						title: 'Tax Payor Type',
						mode: 'TaxPayor',
						name: 'taxpayor'
					},
					{
						xtype: "systemsetup.picklisttab",
						title: 'On Hold Notes',
						mode: 'On_Hold',
						name: 'on_hold'
					},
					{
						xtype: "systemsetup.picklisttab",
						title: 'Vendor Types',
						mode: 'Vendor_Types',
						name: 'vendor_types'
					},
					{
						xtype: "systemsetup.picklisttab",
						title: 'Vendor Document Types',
						mode: 'Vendor_Documents',
						name: 'vendor_documents'
					},
					{
						xtype: "systemsetup.picklisttab",
						title: 'Pay By Types',
						mode: 'PayBy',
						name: 'payby'
					},
					{
						xtype: "systemsetup.picklisttab",
						title: 'Utility Types',
						mode: 'UtilityType',
						name: 'utilitytype'
					}
				]
			}
		];

    	this.callParent(arguments);
    }
});