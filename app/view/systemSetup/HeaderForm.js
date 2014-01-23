/**
 * Created by Andrey Baranov
 * date: 1/21/14 3:46 PM
 */

Ext.define('NP.view.systemSetup.HeaderForm', {
	extend: 'Ext.form.Panel',
	alias: 'widget.systemsetup.headerform',

	requires: [
		'NP.lib.core.Translator',
		'NP.view.shared.YesNoField'
	],

	defaults: {
		labelWidth: 200,
		width: 400,
		padding: '5'
	},
	layout: 'column',
	hidden: true,
	padding: '0 5 5 5',

	initComponent: function() {
		var me = this;

		me.tbar = [
			{
				xtype: 'shared.button.cancel',
				handler: function() {
					me.hide();
				}
			},
			{
				xtype: 'shared.button.save'
			}
		];

		this.title = NP.Translator.translate(this.title);
		this.items = [
			{
				xtype: 'fieldcontainer',
				width: 400,
				items: [
					{
						xtype: 'shared.yesnofield',
						name: 'invoice_custom_field_on_off',
						fieldLabel: NP.Translator.translate('Invoice'),
						yesLabel: NP.Translator.translate('On'),
						noLabel: NP.Translator.translate('Off')
					},
					{
						xtype: 'shared.yesnofield',
						name: 'invoice_custom_field_req',
						fieldLabel: NP.Translator.translate('Required?')
					},
					{
						xtype: 'shared.yesnofield',
						name: 'po_custom_field_on_off',
						fieldLabel: NP.Translator.translate('PO'),
						yesLabel: NP.Translator.translate('On'),
						noLabel: NP.Translator.translate('Off')
					},
					{
						xtype: 'shared.yesnofield',
						name: 'po_custom_field_req',
						fieldLabel: NP.Translator.translate('Required?')
					},
					{
						xtype: 'shared.yesnofield',
						name: 'vef_custom_field_on_off',
						fieldLabel: NP.Translator.translate('VEFs'),
						yesLabel: NP.Translator.translate('On'),
						noLabel: NP.Translator.translate('Off'),
						hidden: !NP.Security.hasPermission('2084')
					},
					{
						xtype: 'shared.yesnofield',
						name: 'vef_custom_field_req',
						fieldLabel: NP.Translator.translate('Required?'),
						hidden: !NP.Security.hasPermission('2084')
					},
					{
						xtype: 'shared.yesnofield',
						name: 'invoice_custom_field_imgindex',
						fieldLabel: NP.Translator.translate('*Add to Quick Index')
					},
					{
						xtype: 'textfield',
						name: 'custom_field_maxlength',
						fieldLabel: NP.Translator.translate('Field Length')
					},
					{
						xtype: 'textfield',
						name: 'custom_field_lbl',
						fieldLabel: NP.Translator.translate('Custom Field Label')
					},
					{
						xtype: 'displayfield',
						value: NP.Translator.translate('*Yes must be selected for Add to Quick Index in order for the Custom Field Default Value to take affect')
					}
				]
			},
			{
				xtype: 'fieldcontainer',
				width: 400,
				id: 'dataandselectfield',
				padding: '0 0 15 0',
				border: '0 0 1 0',
				items: [
					{
						xtype: 'shared.yesnofield',
						name: 'customFieldType',
						fieldLabel: '',
						yesLabel: NP.Translator.translate('Date'),
						noLabel: NP.Translator.translate('Drop Down')
					},
					{
						xtype: 'multiselect',
						name: 'customfielddata',
						fieldLabel: NP.Translator.translate(me.title + ' Values'),
						labelAlign: 'top',
						displayField: 'universal_field_data',
						valueField: 'universal_field_id',
						store: Ext.create('NP.lib.data.Store', {
							service    	: 'ConfigService',
							action     	: 'getCustomFieldsData',
							extraParams: {
								fid: null
							},
							fields: ['universal_field_id', 'universal_field_data', 'universal_field_order', 'universal_field_status']
						}),
						ddReorder: true,
						queryMode: 'local',
						height: 100,
						listeners: {
							change: function(multiselect, newValue, oldValue, eOpts ) {
								multiselect.getStore().each(function(record) {
									if (record.get('universal_field_id') == newValue) {
										if (newValue == 0) {
											me.getForm.down('action').setValue('new');
										} else {
											me.getForm.down('action').setValue('edit');
										}
										me.getForm().findField('universal_field_data').setValue(record.get('universal_field_data'));
										me.getForm().findField('universal_field_status').setValue(parseInt(record.get('universal_field_status')));
										return;
									}
								})
							}
						}
					},
					{
						xtype: 'fieldcontainer',
						items: [
							{
								xtype: 'button',
								text: 'Save Order',
								margin: '0 5 0 0'
							},
							{
								xtype: 'button',
								text: 'Delete',
								margin: '0 5 0 0'
							},
							{
								xtype: 'button',
								text: 'Alpha sort',
								margin: '0 5 0 0'
							}
						]
					},
					{
						xtype: 'textfield',
						name: 'universal_field_data',
						fieldLabel: NP.Translator.translate('Custom Field Value'),
						labelWidth: 150
					},
					{
						xtype: 'radiogroup',
						columns: 1,
						items: [
							{
								boxLabel: NP.Translator.translate('Active'), name: 'universal_field_status', inputValue: '1'
							},
							{
								boxLabel: NP.Translator.translate('Inactive'), name: 'universal_field_status', inputValue: '0'
							},
							{
								boxLabel: NP.Translator.translate('Default'), name: 'universal_field_status', inputValue: '2', checked: true
							}
						]
					},
					{
						xtype: 'hiddenfield',
						name: 'action',
						value: ''
					},
					{
						xtype: 'shared.button.save',
						text: 'Add New/Save',
						handler: function(){
							console.log('actionL ');
						}
					}
				]
			}


		];

		this.callParent(arguments);
	}
});