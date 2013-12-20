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
        'NP.lib.core.Translator',
    	'NP.view.shared.UserAssigner',
    	'NP.view.shared.RoleAssigner',
    	'NP.view.shared.button.Save',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Delete',
        'NP.view.shared.button.Message'
    ],

    bodyPadding: 8,
    autoScroll : true,

    layout: {
        type : 'vbox',
        align: 'stretch'
    },

    initComponent: function() {
        var me = this;

        me.title = NP.Translator.translate('Message');

        // For locatization
        me.typeFieldLabel         = NP.Translator.translate('Message Type');
        me.titleFieldLabel        = NP.Translator.translate('Title of Message');
        me.messageFieldLabel      = NP.Translator.translate('Message');
        me.sentFieldLabel         = NP.Translator.translate('Sent Date');
        me.displayUntilFieldLabel = NP.Translator.translate('Display Until Date');
        me.messageForFieldLabel   = NP.Translator.translate('Message For');
        me.userUnassignedText     = NP.Translator.translate('Users');
        me.userAssignedText       = NP.Translator.translate('Users to Send To');
        me.groupUnassignedText    = NP.Translator.translate('Groups');
        me.groupAssignedText      = NP.Translator.translate('Groups to Send To');
        me.pastErrorText          = NP.Translator.translate('cannot be in the past');
        me.laterThanErrorText     = NP.Translator.translate('must be a later date than');
        
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
				xtype: 'fieldcontainer',
				layout: 'hbox',
				items: [
					{
						xtype     : 'datetimefield',
						name      : 'sentAt',
						fieldLabel: this.sentFieldLabel,
						labelWidth: 125,
						allowBlank: false,
						timeFieldConfig: {
							increment     : 60
						}
					},
					{
						xtype: 'displayfield',
						value: NP.Translator.translate('(Time represents where application is hosted)'),
						padding: '0 0 0 5'
					}
				]
    		},{
				xtype: 'fieldcontainer',
				layout: 'hbox',
				items: [
					{
						xtype     : 'datetimefield',
						name      : 'displayUntil',
						fieldLabel: this.displayUntilFieldLabel,
						labelWidth: 125,
						hidden    : true,
						timeFieldConfig: {
							increment     : 60
						}
					},
					{
						xtype: 'displayfield',
						name: 'time_info',
						value: NP.Translator.translate('(Time represents where application is hosted)'),
						padding: '0 0 0 5',
						hidden    : true
					}
				]
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
    	var me            = this,
    		sentAt        = me.findField('sentAt'),
    		displayUntil  = me.findField('displayUntil'),
    		recipientType = me.findField('recipientType').getGroupValue(),
    		roleField     = me.findField('roles'),
    		userField     = me.findField('users'),
    		now           = new Date(),
    		isValid;

	    roleField.allowBlank = true;
	    userField.allowBlank = true;
	    
	    if (recipientType == 'roles') {
	    	roleField.allowBlank = false;
	    } else if (recipientType == 'users') {
	    	userField.allowBlank = false;
	    }

    	isValid = me.callParent(arguments);

    	if (sentAt.getValue() !== null && sentAt.getValue() < now) {
    		isValid = false;
    		sentAt.markInvalid(me.sentFieldLabel + ' ' + me.pastErrorText);
    	}

    	if (me.findField('type').getGroupValue() == 'system' && displayUntil.getValue() !== null) {
    		if (displayUntil.getValue() < now) {
		    	isValid = false;
		    	displayUntil.markInvalid(me.displayUntilFieldLabel + ' ' + me.pastErrorText);
		    } else if (sentAt.getValue() !== null && displayUntil.getValue() <= sentAt.getValue() ) {
		    	isValid = false;
		    	displayUntil.markInvalid(me.displayUntilFieldLabel + ' ' + me.laterThanErrorText + ' ' + me.sentFieldLabel);
		    }
	    }

    	return isValid;
    }
});