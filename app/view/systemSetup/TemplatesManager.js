/**
 * Created by Andrey Baranov
 * date: 2/3/14 2:39 PM
 */

Ext.define('NP.view.systemSetup.TemplatesManager', {
//	extend: 'Ext.panel.Panel',
	extend: 'NP.lib.ui.BoundForm',
	alias: 'widget.systemsetup.templatesmanager',

	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Translator',
		'NP.view.systemSetup.PrintTemplateTab',
		'NP.view.systemSetup.PrintHeaderTab',
		'NP.view.systemSetup.PrintFooterTab',
		'NP.view.systemSetup.PrintAdditionalTextTab',
		'NP.view.systemSetup.PrintSettingsTab',
		'NP.lib.ui.VerticalTabPanel'
	],

	layout: 'fit',

	defaults: {
		labelWidth: '80%'
	},
	border: false,
	autoScroll: true,


	initComponent: function() {
		var me  = this;

		me.title = NP.Translator.translate(this.title);

		me.tbar = [
			{
				xtype: 'shared.button.cancel'
			},
			{
				xtype: 'shared.button.save',
				handler: function() {
					me.fireEvent('savetemplate', 'save');
				}
			},
			{
				xtype: 'shared.button.save',
				text: NP.Translator.translate('Save & Activate'),
				handler: function() {
					me.fireEvent('savetemplate', 'activate');
				}
			},
			{
				xtype: 'shared.button.save',
				text: NP.Translator.translate('Save & Deactivate'),
				handler: function() {
					me.fireEvent('saveanddeactivatetemplate', 'deactivate');
				}
			}
		];

		me.items = [
			{
				xtype: 'verticaltabpanel',
				name: 'templatestab',
				items: [
					{
						xtype: 'systemsetup.printtemplatetab',
						title: 'Template',
						name: 'templatetab',
						flex: 1,
						data: me.data ? me.data : null
					},
					{
						xtype: 'systemsetup.printheadertab',
						title: 'Header',
						name: 'headertab',
						flex: 1
					},
					{
						xtype: 'systemsetup.printfootertab',
						title: 'Footer',
						name: 'footertab',
						flex: 1
					},
					{
						xtype: 'systemsetup.printadditionaltexttab',
						title: 'Additional Text',
						name: 'additionaltexttab',
						flex: 1
					},
					{
						xtype: 'systemsetup.printsettingstab',
						title: 'Settings',
						name: 'settings',
						flex: 1
					}
				]
			}
		];

		this.callParent(arguments);
	}
});