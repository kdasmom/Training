/**
 * Created by Andrey Baranov
 * date: 1/21/14 3:46 PM
 */

Ext.define('NP.view.systemSetup.CustomFieldForm', {
	extend: 'Ext.form.Panel',
	alias: 'widget.systemsetup.customfieldform',

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
						noLabel: NP.Translator.translate('Drop Down'),
						listeners: {
							change: function(radiogroup, newValue, oldValue, eOpts) {
								if (parseInt(newValue.customFieldType) == 1) {
									me.getForm().findField('customfielddata').hide();
									me.getForm().findField('universal_field_data').hide();
									me.down('[name="universal_field_status_group"]').hide();
									me.down('[name="action_buttons"]').hide();
									me.down('[name="saveValuesBtn"]').hide();
								} else {
									me.getForm().findField('customfielddata').show();
									me.getForm().findField('universal_field_data').show();
									me.down('[name="universal_field_status_group"]').show();
									me.down('[name="action_buttons"]').show();
									me.down('[name="saveValuesBtn"]').show();
								}
							}
						}
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
							sorters: [
								{
									sorterFn: function(o1, o2) {
										if (o1.get('universal_field_id') == 0) {
											return -1;
										}
									}
								},
								{
									property: 'universal_field_order',
									direction: 'asc'
								},
								{
									property: 'universal_field_data',
									direction: 'asc'
								}
							],
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
											me.getForm().findField('action').setValue('new');
										} else {
											me.getForm().findField('action').setValue('edit');
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
						name: 'action_buttons',
						items: [
							{
								xtype: 'button',
								text: 'Save Order',
								margin: '0 5 0 0',
								handler: function() {
									var values = [];
									me.getForm().findField('customfielddata').getStore().each(function(record, index) {
										if (record.get('universal_field_id') !== 0) {
											values.push({
												'universal_field_id'	: record.get('universal_field_id'),
												'universal_field_order'	: index - 1
											})
										}
									});
									NP.lib.core.Net.remoteCall({
										requests: {
											service    : 'ConfigService',
											action     : 'saveOrderForCustomFields',
											data: values,
											success    : function(result) {
												if (result) {
													me.getForm().findField('universal_field_data').setValue('');
													me.getForm().findField('universal_field_status').setValue(1);
													me.getForm().findField('action').setValue('new');
												}
											}
										}
									});
								}
							},
							{
								xtype: 'button',
								text: 'Delete',
								margin: '0 5 0 0',
								handler: function() {
									var customfielddataField = me.getForm().findField('customfielddata'),
									universal_field_id = customfielddataField.getValue()[0];
									if (!universal_field_id) {
										Ext.MessageBox.alert(NP.Translator.translate('Error'), NP.Translator.translate('Cannot delete empty value!'));
									} else {
										NP.lib.core.Net.remoteCall({
											requests: {
												service    : 'ConfigService',
												action     : 'deleteUniversalField',
												universal_field_id: universal_field_id,
												success    : function(result) {
													if (result) {
														customfielddataField.getStore().reload();
														me.getForm().findField('universal_field_data').setValue('');
														me.getForm().findField('universal_field_status').setValue(1);
														me.getForm().findField('action').setValue('new');
														NP.Util.showFadingWindow({ html: 'Item was delete successfully!' });
													}
												}
											}
										});
									}
								}
							},
							{
								xtype: 'button',
								text: 'Alpha sort',
								margin: '0 5 0 0',
								handler: function() {
									me.getForm().findField('customfielddata').getStore().sort();
								}
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
						name: 'universal_field_status_group',
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
						xtype: 'hiddenfield',
						name: 'universal_field_number'
					},
					{
						xtype: 'shared.button.save',
						name: 'saveValuesBtn',
						text: 'Add New/Save',
						handler: function(){
							var data = {
								'universal_field_data': me.getForm().findField('universal_field_data').getValue(),
								'universal_field_status'	: me.getForm().findField('universal_field_status').getValue(),
								'universal_field_number'	: me.getForm().findField('universal_field_number').getValue(),
								'action'					: me.getForm().findField('action').getValue(),
								'universal_field_id'		: me.getForm().findField('customfielddata').getValue()[0]
							};

							NP.lib.core.Net.remoteCall({
								requests: {
									service    : 'ConfigService',
									action     : 'saveUniversalFields',
									data: data,
									success    : function(result) {
										if (result) {
											me.getForm().findField('customfielddata').getStore().reload();
											me.getForm().findField('universal_field_data').setValue('');
											me.getForm().findField('universal_field_status').setValue(1);
											me.getForm().findField('action').setValue('new');
										}
									}
								}
							});
						}
					}
				]
			}


		];

		this.callParent(arguments);
	}
});