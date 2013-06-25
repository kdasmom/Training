/**
 * The MessageCenter controller deals with operations in the Administration > Message Center section of the app
 *
 * @author Thomas Messier
 */
Ext.define('NP.controller.MessageCenter', {
	extend: 'NP.lib.core.AbstractController',
	
	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Security',
		'NP.lib.core.Net',
		'NP.lib.core.Util'
	],
	
	// For localization
	saveSuccessText      : 'Your changes were saved.',
	deleteDialogTitleText: 'Delete Message?',
	deleteDialogText     : 'Are you sure you want to delete this message?',
	deleteSuccessText    : 'Message succesfully deleted',
	deleteFailureText    : 'There was an error deleting the message. Please try again.',
	errorDialogTitleText : 'Error',

	init: function() {
		Ext.log('MessageCenter controller initialized');

		var app = this.application;

		// Setup event handlers
		this.control({
			// The main Property Setup panel
			'[xtype="messagecenter.messagegrid"]': {
				itemclick: function(grid, rec) {
					this.application.addHistory('MessageCenter:showMessageForm:' + rec.get('id'));
				}
			},
			// The New Message button
			'[xtype="messagecenter.messagegrid"] [xtype="shared.button.new"]': {
				click: function() {
					this.application.addHistory('MessageCenter:showMessageForm');
				}
			},
			// The Message Type field on the Message Form
			'#messageTypeField': {
				change: this.changeMessageType
			},
			// The Message For field on the Message Form
			'#recipientTypeField': {
				change: this.changeRecipientType
			},
			// The Cancel button on the Message Form
			'[xtype="messagecenter.messageform"] [xtype="shared.button.cancel"]': {
				click: function() {
					this.application.addHistory('MessageCenter:showRegister');
				}
			},
			// The Send button on the Message Form
			'[xtype="messagecenter.messageform"] [xtype="shared.button.save"]': {
				click: this.saveMessageAsDraft
			},
			// The Save As Draft button on the Message Form
			'[xtype="messagecenter.messageform"] [xtype="shared.button.message"]': {
				click: this.sendMessage
			},
			// The Delete button on the Message Form
			'[xtype="messagecenter.messageform"] [xtype="shared.button.delete"]': {
				click: this.deleteMessage
			}
		});
	},
	
	showRegister: function() {
		// Create the view
		var grid = this.setView('NP.view.messageCenter.MessageGrid');
		
		// Load the store
		grid.reloadFirstPage();
	},

	showMessageForm: function(id) {
		var viewCfg = { bind: { models: ['system.UserMessage'] }};
		if (arguments.length) {
			Ext.apply(viewCfg.bind, {
				service    : 'MessageService',
				action     : 'getMessage',
				extraParams: {
					id: id
				},
				extraFields: ['recipientType','users','roles']
			});
		}

		var form = this.setView('NP.view.messageCenter.MessageForm', viewCfg);
		
		if (arguments.length) {
			// This will run once data has been loaded if we're editing an existing message
			form.on('dataloaded', function(boundForm, data) {
				form.down('[xtype="shared.button.delete"]').show();

				// If viewing a message that was already sent, prevent modifications to it
				if (data['status'] == 'sent') {
					// Disable the save button
					form.down('[xtype="shared.button.save"]').disable();
					// Disable all fields
					form.getForm().getFields().each(function(field) {
						field.disable();
					});
				}
			});
		} else {
			form.down('[xtype="shared.button.delete"]').hide();
			// Populate date fields
			var sentAtDate = new Date();
			sentAtDate = Ext.Date.add(Ext.Date.parse(Ext.Date.format(sentAtDate, 'Y-m-d') + ' ' + Ext.Date.format(sentAtDate, 'H') + ':00:00', 'Y-m-d H:i:s'), Ext.Date.HOUR, 1);
			var displayUntilDate = Ext.Date.add(sentAtDate, Ext.Date.DAY, 1);
			form.findField('sentAt').setValue(sentAtDate);
			form.findField('displayUntil').setValue(displayUntilDate);
		}
	},

	changeMessageType: function(group, newVal, oldVal) {
		var displayField = this.getCmp('messagecenter.messageform').findField('displayUntil');
		if (newVal.type == 'email') {
			displayField.allowBlank = true;
			displayField.hide();
		} else {
			displayField.allowBlank = false;
			displayField.show();
		}
	},

	changeRecipientType: function(group, newVal, oldVal) {
		var form = this.getCmp('messagecenter.messageform');
		var roleField = form.findField('roles');
		var userField = form.findField('users');

		Ext.suspendLayouts();

		roleField.hide();
		roleField.allowBlank = true;
		userField.hide();
		userField.allowBlank = true;

		if (newVal.recipientType == 'roles') {
			roleField.allowBlank = false;
			roleField.show();
		} else if (newVal.recipientType == 'users') {
			userField.allowBlank = false;
			userField.show();
		}

		Ext.resumeLayouts(true);
	},

	sendMessage: function() {
		var message = this.getCmp('messagecenter.messageform').getModel('system.UserMessage');
		message.set('status', 'scheduled');

		this.saveMessage();
	},

	saveMessageAsDraft: function() {
		var message = this.getCmp('messagecenter.messageform').getModel('system.UserMessage');
		message.set('status', 'draft');

		this.saveMessage();
	},

	saveMessage: function() {
		var that = this;

		var form = this.getCmp('messagecenter.messageform');

		if (form.isValid()) {
			form.submitWithBindings({
				service: 'MessageService',
				action : 'saveMessage',
				extraFields: { recipientType: 'recipientType', users: 'users', roles: 'roles' },
				extraParams: { userprofile_id: NP.Security.getUser().get('userprofile_id') },
				success: function(result, deferred) {
					NP.Util.showFadingWindow({ html: that.saveSuccessText });
					that.application.addHistory('MessageCenter:showRegister');
				}
			});
		}
	},

	deleteMessage: function() {
		var that = this;

		Ext.MessageBox.confirm(that.deleteDialogTitleText, that.deleteDialogText, function(btn) {
			// If user clicks Yes, proceed with deleting
			if (btn == 'yes') {
				var message = that.getCmp('messagecenter.messageform').getModel('system.UserMessage');

				// Ajax request to delete catalog
				NP.lib.core.Net.remoteCall({
					requests: {
						service: 'MessageService',
						action : 'deleteMessage',
						id     : message.get('id'),
						success: function(success, deferred) {
							if (success) {
								NP.Util.showFadingWindow({ html: that.deleteSuccessText });
								that.application.addHistory('MessageCenter:showRegister');
							} else {
								Ext.MessageBox.alert(that.errorDialogTitleText, that.deleteFailureText);
							}
						}
					}
				});
			}
		});
	}
});