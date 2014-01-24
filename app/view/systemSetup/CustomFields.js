/**
 * System Setup: Custom Fields section
 *
 * @author Witold Frackiewicz - Testerix
 */
Ext.define('NP.view.systemSetup.CustomFields', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.systemsetup.customfields',

    requires: [
		'NP.lib.core.Translator',
		'NP.view.systemSetup.CustomFieldsHeader',
		'NP.view.systemSetup.CustomFieldsLineItem',
		'NP.view.systemSetup.CustomFieldsServiceFields',
		'NP.view.systemSetup.CustomFieldsPropertyFields'
	],
    
    title: 'Custom Fields',

	layout: 'fit',

    initComponent: function() {
		var me = this;

    	this.title = NP.Translator.translate(this.title);

		this.tbar = [
			{
				xtype: 'shared.button.cancel',
				name: 'backToOverview'
			}
		];

		this.items = [
			{
				xtype : 'verticaltabpanel',
				border: false,
				items: [
					{
						xtype: 'systemsetup.customfieldsheader',
						title: 'Header',
						listeners: {
							beforehide: function(tab, eOpts) {
								me.fireEvent('beforehidetab', tab);
							}
						}
					},
					{
						xtype: 'systemsetup.customfieldslineitem',
						title: 'Line Item',
						listeners: {
							beforehide: function(tab, eOpts) {
								me.fireEvent('beforehidetab', tab);
							}
						}
					},
					{
						xtype: 'systemsetup.customfieldsservicefields',
						title: 'Service Fields',
						listeners: {
							beforehide: function(tab, eOpts) {
								me.fireEvent('beforehidetab', tab);
							}
						}
					},
					{
						xtype: 'systemsetup.customfieldspropertyfields',
						title: 'Property Fields',
						listeners: {
							beforehide: function(tab, eOpts) {
								me.fireEvent('beforehidetab', tab);
							}
						}
					}
				]
			}
		];

    	this.callParent(arguments);
    }
});