/**
 * Message Center > Message Add/Edit Form
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.messageCenter.MessageForm', {
    extend: 'NP.lib.ui.BoundForm',
    alias : 'widget.messagecenter.messageform',
    
    requires: [
    	'NP.lib.ui.DateTimeField',
    	'NP.view.shared.UserAssigner',
    	'NP.view.shared.RoleAssigner',
    	'NP.view.shared.button.Save',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Delete',
        'NP.view.shared.button.Message'
    ],

    bodyPadding: 8,
    autoScroll : true,

    // For locatization
    title                 : 'Message',
	typeFieldLabel        : 'Message Type',
	titleFieldLabel       : 'Title of Message',
	messageFieldLabel     : 'Message',
	sentFieldLabel        : 'Sent Date',
	displayUntilFieldLabel: 'Display Until Date',
	messageForFieldLabel  : 'Message For',
	userUnassignedText    : 'Users',
	userAssignedText      : 'Users to Send To',
	groupUnassignedText   : 'Groups',
	groupAssignedText     : 'Groups to Send To',
	pastErrorText         : 'cannot be in the past',
	laterThanErrorText    : 'must be a later date than',

    initComponent: function() {
    	var bar = [
    		{ xtype: 'shared.button.cancel' },
    		{ xtype: 'shared.button.message' },
    		{ xtype: 'shared.button.save', text: 'Save As Draft' },
    		{ xtype: 'shared.button.delete', hidden: true }
    	];
    	this.tbar = bar;
    	this.bbar = bar;

    	this.defaults = {
    		labelWidth: 125
    	};

    	this.items = [
    		{
				xtype     : 'radiogroup',
				itemId    : 'messageTypeField',
				fieldLabel: this.typeFieldLabel,
				layout    : 'hbox',
				defaults  : { name: 'type' },
				items     : [
    				{ boxLabel: 'Email', inputValue: 'email', margin: '0 8 0 0' },
    				{ boxLabel: 'System', inputValue: 'system' }
    			]
    		},{
				xtype     : 'textfield',
				fieldLabel: this.titleFieldLabel,
				name      : 'subject',
				anchor    : '100%',
				allowBlank: false
    		},{
				xtype     : 'textarea',
				fieldLabel: this.messageFieldLabel,
				name      : 'body',
				anchor    : '100%',
				height    : 125,
				allowBlank: false
    		},{
    			xtype     : 'datetimefield',
    			fieldLabel: this.sentFieldLabel,
    			name      : 'sentAt',
    			allowBlank: false,
    			timeFieldConfig: {
    				increment     : 60
    			}
    		},{
    			xtype     : 'datetimefield',
    			fieldLabel: this.displayUntilFieldLabel,
    			name      : 'displayUntil',
    			hidden    : true,
    			timeFieldConfig: {
    				increment     : 60
    			}
    		},{
				xtype     : 'radiogroup',
				itemId    : 'recipientTypeField',
				fieldLabel: this.messageForFieldLabel,
				layout    : 'hbox',
				defaults  : {
					name: 'recipientType',
					margin: '0 8 0 0'
				},
				items     : [
    				{ boxLabel: 'ALL', inputValue: 'all', checked: true },
    				{ boxLabel: 'User Groups', inputValue: 'roles' },
    				{ boxLabel: 'Users', inputValue: 'users' }
    			]
    		},{
				xtype    : 'shared.userassigner',
				maxHeight: 150,
				hidden   : true
    		},{
				xtype    : 'shared.roleassigner',
				maxHeight: 150,
				hidden   : true
    		}
    	];

    	this.callParent(arguments);
    },

    isValid: function() {
    	var isValid = this.callParent(arguments);

    	var sentAt = this.findField('sentAt');
    	var displayUntil = this.findField('displayUntil');
    	var now = new Date();

    	if (sentAt.getValue() !== null && sentAt.getValue() < now) {
    		isValid = false;
    		sentAt.markInvalid(this.sentFieldLabel + ' ' + this.pastErrorText);
    	}

    	if (this.findField('type').getGroupValue() == 'system' && displayUntil.getValue() !== null) {
    		if (displayUntil.getValue() < now) {
		    	isValid = false;
		    	displayUntil.markInvalid(this.displayUntilFieldLabel + ' ' + this.pastErrorText);
		    } else if (sentAt.getValue() !== null && displayUntil.getValue() <= sentAt.getValue() ) {
		    	isValid = false;
		    	displayUntil.markInvalid(this.displayUntilFieldLabel + ' ' + this.laterThanErrorText + ' ' + this.sentFieldLabel);
		    }
	    }

    	return isValid;
    }
});