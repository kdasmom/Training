/**
 * Created by Andrey Baranov
 * date: 2/21/14 3:43 PM
 */


Ext.define('NP.view.systemSetup.AssignGlAccountsWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.systemsetup.assignglaccountswindow',

	requires: [
		'NP.lib.core.Config',
		'NP.view.shared.GlAccountAssigner'
	],

	title           : 'Assign GlAccounts',

	width           : '30%',
	height          : '30%',
	autoScroll		: true,
	layout			: 'fit',

	modal           : true,
	draggable       : true,

	initComponent: function() {
		var me = this;

		me.bbar = [
			{
				xtype: 'shared.button.cancel',
				handler: function() {
					me.close();
				}
			},
			{
				xtype: 'shared.button.save',
				handler: function() {
					var values = me.down('form').getValues();
					if (values['assignedglaccounts'].length == 0) {
						Ext.MessageBox.alert(NP.Translator.translate('Error'), NP.Translator.translate('No GlAccounts selected!'));
					} else {
						NP.lib.core.Net.remoteCall({
							requests: {
								service    : 'ConfigService',
								action     : 'assigneGlaccounts',
								field_id: me.customfield_id,
								glaccounts: values['assignedglaccounts'],
								success    : function(result) {
									if (result) {
										Ext.MessageBox.alert(NP.Translator.translate('Success'), NP.Translator.translate('Glaccounts were assigned!'));
									} else {
										Ext.MessageBox.alert(NP.Translator.translate('Error'), result);
									}
									me.close();
								}
							}
						});
					}
				}
			}
		];

		me.title = NP.Translator.translate(me.title);

		me.items = [
			{
				xtype: 'form',
				items: [
					{
						xtype: 'shared.glaccountassigner',
						name: 'assignedglaccounts',
						height: 200,
						padding : '10',
						fieldLabel: '',
						listeners: {
							afterrender: function() {
								NP.lib.core.Net.remoteCall({
									requests: {
										service    : 'ConfigService',
										action     : 'getUniversalFieldsAssignedGlaccount',
										field_id: me.customfield_id,
										success    : function(result) {
											me.down('form').getForm().findField('assignedglaccounts').setValue(result);
										}
									}
								});
							}
						}

					},
					{
						xtype: 'hiddenfield',
						name: 'customfield_id',
						value: me.customfield_id
					}
				]
			}
		];

		me.callParent(arguments);
	}
});