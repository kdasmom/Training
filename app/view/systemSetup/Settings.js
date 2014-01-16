/**
 * System Setup: Settings section
 *
 * @author Witold Frackiewicz - Testerix
 */
Ext.define('NP.view.systemSetup.Settings', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.systemsetup.settings',

    requires: [
		'NP.lib.core.Translator',
		'NP.view.systemSetup.SettingsTab',
		'NP.view.shared.button.Cancel',
		'NP.view.shared.button.Save',
		'NP.view.shared.button.Print'
	],
    
    title: 'Settings',
	layout: 'fit',

    initComponent: function() {
    	this.title = NP.Translator.translate(this.title);

		this.tbar = [
			{
				xtype: 'shared.button.cancel'
			},
			{
				xtype: 'shared.button.save',
				text: NP.Translator.translate('Save settings')
			},
			{
				xtype: 'shared.button.print'
			}
		];

		this.items = [
			{
				xtype : 'verticaltabpanel',
				border: false,
				items: [
					{
						xtype: 'systemsetup.settingstab',
						itemId: 'general',
						title: 'General'
					},
					{
						xtype: 'systemsetup.settingstab',
						itemId: 'register',
						title: 'Register'
					},
					{
						xtype: 'systemsetup.settingstab',
						itemId: 'imaging',
						title: 'Imaging'
					},
					{
						xtype: 'systemsetup.settingstab',
						itemId: 'invoice',
						title: 'Invoice'
					},
					{
						xtype: 'systemsetup.settingstab',
						itemId: 'jobcost',
						title: 'Job Cost'
					},
					{
						xtype: 'systemsetup.settingstab',
						itemId: 'purchaseorder',
						title: 'Purchase Order'
					},
					{
						xtype: 'systemsetup.settingstab',
						itemId: 'vendor',
						title: 'Vendor'
					},
					{
						xtype: 'systemsetup.settingstab',
						itemId: 'budget',
						title: 'Budget and GL'
					},
					{
						xtype: 'systemsetup.settingstab',
						itemId: 'intl',
						title: 'Intl'
					}
				]
			}
		];

    	this.callParent(arguments);
    }
});