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
		'NP.view.systemSetup.SettingsGeneral',
		'NP.view.systemSetup.SettingsRegister',
		'NP.view.systemSetup.SettingsImaging',
		'NP.view.systemSetup.SettingsInvoice',
		'NP.view.systemSetup.SettingsJobCost',
		'NP.view.systemSetup.SettingsPurchaseOrder',
		'NP.view.systemSetup.SettingsVendor',
		'NP.view.systemSetup.SettingsBudget',
		'NP.view.systemSetup.SettingsIntl',
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
						xtype: 'systemsetup.settingsgeneral'
					},
					{
						xtype: 'systemsetup.settingsregister'
					},
					{
						xtype: 'systemsetup.settingsimaging'
					},
					{
						xtype: 'systemsetup.settingsinvoice'
					},
					{
						xtype: 'systemsetup.settingsjobcost'
					},
					{
						xtype: 'systemsetup.settingspurchaseorder'
					},
					{
						xtype: 'systemsetup.settingsvendor'
					},
					{
						xtype: 'systemsetup.settingsbudget'
					},
					{
						xtype: 'systemsetup.settingsintl'
					}
				]
			}
		];

    	this.callParent(arguments);
    }
});