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
    	this.title = NP.Translator.translate(this.title);

		this.tbar = [
			{
				xtype: 'shared.button.cancel'
			}
		];

		this.items = [
			{
				xtype : 'verticaltabpanel',
				border: false,
				items: [
					{
						xtype: 'systemsetup.customfieldsheader',
						title: 'Header'
					},
					{
						xtype: 'systemsetup.customfieldslineitem',
						title: 'Line Item'
					},
					{
						xtype: 'systemsetup.customfieldsservicefields',
						title: 'Service Fields'
					},
					{
						xtype: 'systemsetup.customfieldspropertyfields',
						title: 'Property Fields'
					}
				]
			}
		];

    	this.callParent(arguments);
    }
});