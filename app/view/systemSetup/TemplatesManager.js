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
		console.log('me id: ', me.id);

		me.title = NP.Translator.translate(this.title);

		me.tbar = [
			{
				xtype: 'shared.button.cancel'
			},
			{
				xtype: 'shared.button.save',
				handler: function() {
					me.fireEvent('savetemplate');
				}
			},
			{
				xtype: 'shared.button.save',
				text: NP.Translator.translate('Save & Activate'),
				handler: function() {
					me.down('[name="isActive"]').setValue(1);
					me.fireEvent('savetemplate');
				}
			},
			{
				xtype: 'shared.button.save',
				text: NP.Translator.translate('Save & Deactivate'),
				handler: function() {
					me.down('[name="isActive"]').setValue(0);
					me.fireEvent('savetemplate');
				}
			},
			{
				xtype: 'shared.button.delete',
				handler: function() {
					me.fireEvent('deletetemplate', me.id);
				},
				hidden: parseInt(me.id) > 0 ? false : true
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