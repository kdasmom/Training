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
				height: 100,
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
				minHeight: 600
			},
			{
				xtype: 'form',
				title: NP.Translator.translate('TEMPLATE PROPERTIES'),
				height: 300,
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				items: [
					{
						xtype: 'shared.yesnofield',
						yesLabel: 'All Properties',
						noLabel: 'Selected Properties',
						name: 'property_type',
						columns: 1
					},
					{
						xtype: 'shared.propertyassigner',
						name: 'property_id',
						store: Ext.create('NP.store.property.Properties', {
							service: 'PropertyService',
							action: 'getAllByAdmin',
							isAdminRole: NP.Security.getRole().get('is_admin_role'),
							hasPermission: NP.Security.hasPermission(2010),
							autoLoad: true
						}),
						height: 200
					}
				],
				padding: '0 0 20 0'
			}
		];

		me.callParent(arguments);
	}
});