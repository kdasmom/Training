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
	positions: {
		'template_logo_left'	: [],
		'template_logo_center'	: [],
		'template_logo_right'	: [],
		'template_header_left'	: [],
		'template_header_right'	: [],
		'template_header'		: [],
		'template_body'			: [],
		'template_footer_left'	: [],
		'template_footer_right'	: [],
		'template_footer'		: []
	},

	initComponent: function() {
		var me  = this;

		me.title = NP.Translator.translate(this.title);

		me.items = [
			{
				xtype: 'panel',
				height: 200,
				name: 'templatedetails',
				title: NP.Translator.translate('TEMPLATE DETAILS'),
				items: [
					{
						xtype: 'textfield',
						name: 'Print_Template_Name',
						fieldLabel: NP.Translator.translate('Template Name'),
						padding: '5',
						allowBlank: false
					},
					{
						xtype: 'textfield',
						name: 'Print_template_label',
						fieldLabel: NP.Translator.translate('Template Label'),
						padding: '5',
						allowBlank: false
					},
					{
						xtype: 'hiddenfield',
						name: 'Print_Template_Id'
					},
					{
						xtype: 'hiddenfield',
						name: 'isActive'
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
						name: 'templatespicker',
						flex: 0.2,
						data: me.data ? me.data : null
					},
					{
						xtype: 'systemsetup.templatebodycanvas',
						flex: 0.8
					}
				],
				minHeight: 600
			},
			{
				xtype: 'panel',
				title: NP.Translator.translate('TEMPLATE PROPERTIES'),
				height: 300,
				name: 'properties',
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
						columns: 1,
						listeners: {
							change: function(radiogroup, newValue, oldValue, eOpts) {
								if (newValue.property_type == 0) {
									me.down('[name="property_id"]').show();
								} else {
									me.down('[name="property_id"]').hide();
								}
							}
						}
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
	},

	/**
	 * add template
	 *
	 * @param region
	 * @param template_name
	 * @returns {*}
	 */
	addTemplate: function(region, template_name) {
		var me = this,
			inarray = false;

		Ext.each(me.positions[region], function(template) {
			if (template == template_name) {
				inarray = true;
				return false;
			}
		});

		if (!inarray) {
			me.positions[region].push(template_name);
		}

		return me.positions;
	},

	/**
	 * remove template
	 *
	 * @param region
	 * @param name
	 */
	removeTemplate: function(region, name) {
		var me = this,
			deleteIndex = 0;

		Ext.each(me.positions[region], function(template, index) {
			if (template == name) {
				deleteIndex = index;
				return false;
			}
		});

		me.positions[region].splice(deleteIndex, 1);

		return me.positions;
	}
});