/**
 * Created by Andrey Baranov
 * date: 2/3/14 2:43 PM
 */

Ext.define('NP.view.systemSetup.PrintTemplateTab', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.systemsetup.printtemplatetab',

	requires: [
		'NP.lib.core.Translator',
		'NP.view.shared.button.Cancel',
		'NP.view.shared.button.Save',
		'NP.view.systemSetup.TemplateObjectsPicker',
		'NP.view.systemSetup.TemplateBodyCanvas'
	],


	layout: {
		type: 'vbox',
		align: 'stretch'
	},

//	layout: 'fit',

	defaults: {
		labelWidth: '80%'
	},
	autoScroll: true,

	padding: '0 10',
	border: false,

	initComponent: function() {
		var me  = this;

		me.title = NP.Translator.translate(this.title);

		me.tbar = [
			{
				xtype: 'shared.button.cancel'
			},
			{
				xtype: 'shared.button.save'
			},
			{
				xtype: 'shared.button.save',
				text: NP.Translator.translate('Save & Activate')
			},
			{
				xtype: 'shared.button.save',
				text: NP.Translator.translate('Save & Deactivate')
			}
		];

		me.items = [
			{
				xtype: 'form',
				flex: 0.2,
				title: NP.Translator.translate('TEMPLATE DETAILS'),
				items: [
					{
						xtype: 'textfield',
						name: 'print_template_name',
						fieldLabel: NP.Translator.translate('Template Name'),
						padding: '5'
					},
					{
						xtype: 'textfield',
						name: 'print_template_label',
						fieldLabel: NP.Translator.translate('Template Label'),
						padding: '5'
					}
				]
			},
			{
				xtype: 'panel',
				title: NP.Translator.translate('TEMPLATE LAYOUT'),
				flex: 0.6,
				layout: 'hbox',
				items: [
					{
						xtype: 'systemsetup.templateobjectspicker',
						flex: 0.2
					},
					{
						xtype: 'systemsetup.templatebodycanvas',
						flex: 0.8
					}
				],
				autoScroll: true
			},
			{
				xtype: 'panel',
				title: NP.Translator.translate('TEMPLATE PROPERTIES'),
				flex: 0.2
			}
		];

		me.callParent(arguments);
	}
});