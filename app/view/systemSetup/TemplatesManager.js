/**
 * Created by Andrey Baranov
 * date: 2/3/14 2:39 PM
 */

Ext.define('NP.view.systemSetup.TemplatesManager', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.systemsetup.templatesmanager',

	requires: [
		'NP.lib.core.Translator',
		'NP.view.systemSetup.PrintTemplateTab',
		'NP.view.systemSetup.PrintHeaderTab',
		'NP.view.systemSetup.PrintFooterTab',
		'NP.view.systemSetup.PrintAdditionalTextTab',
		'NP.lib.ui.VerticalTabPanel'
	],

	layout: 'fit',

	defaults: {
		labelWidth: '80%'
	},

	padding: '10',
	border: false,
	autoScroll: true,

	initComponent: function() {
		var me  = this;

		me.title = NP.Translator.translate(this.title);

		me.items = [
			{
				xtype: 'verticaltabpanel',
				items: [
					{
						xtype: 'systemsetup.printtemplatetab',
						title: 'Template',
						flex: 1
					},
					{
						xtype: 'systemsetup.printheadertab',
						title: 'Header',
						flex: 1
					},
					{
						xtype: 'systemsetup.printfootertab',
						title: 'Footer',
						flex: 1
					},
					{
						xtype: 'systemsetup.printadditionaltexttab',
						title: 'Additional Text',
						flex: 1
					}
				]
			}
		];

		this.callParent(arguments);
	}
});