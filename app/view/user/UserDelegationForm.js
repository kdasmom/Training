/**
 * Delegation form
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.UserDelegationForm', {
    extend: 'NP.lib.ui.BoundForm',
    alias : 'widget.user.userdelegationform',
    
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
        'NP.lib.core.Translator',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Save',
		'NP.view.shared.PropertyAssigner'
    ],

    autoScroll : true,
    border     : false,
    bodyPadding: 8,
	layout: {
		type : 'vbox',
		align: 'stretch'
	},

    initComponent: function() {
        var bar = [
            { xtype: 'shared.button.cancel' },
            { xtype: 'shared.button.save' }
        ];
        this.tbar = bar;

        this.defaults = {
            labelWidth: 180
        };

        this.items = [
            {
                xtype     : 'datefield',
                fieldLabel: NP.Translator.translate('Start Date'),
                name      : 'Delegation_StartDate'
            },{
                xtype     : 'datefield',
                fieldLabel: NP.Translator.translate('Stop Date'),
                name      : 'Delegation_StopDate'
            },{
                xtype       : 'combo',
                fieldLabel  : NP.Translator.translate('Delegate to Whom'),
                forceSelection: true,
                queryMode   : 'local',
                width       : 600,
                name        : 'Delegation_To_UserProfile_Id',
                displayField: 'userprofile_username',
                valueField  : 'userprofile_id',
                store       : Ext.create('NP.store.user.Userprofiles', {
                    service    : 'UserService',
                    action     : 'getAllowedDelegationUsers'
                }),
                listConfig: {
                    itemTpl: '{person_lastname}, {person_lastname} ({userprofile_username})'
                }
            },
			{
				xtype			: 'shared.propertyassigner',
				height			: 100,
				fieldLabel		: NP.Translator.translate('{properties} to Delegate', { properties: NP.Config.getPropertyLabel(true) }),
				name			: 'delegation_properties',
				store			: Ext.create('NP.store.property.Properties', {
					service	: 'UserService',
					action	: 'getUserProperties',
                    extraParams: {
                        property_statuses: '1,-1'
                    }
				})
			},
            { xtype: 'hiddenfield', name: 'UserProfile_Id'}
        ];

        this.callParent(arguments);
    },

    isValid: function() {
        var isValid = this.callParent();

        var delegation = this.getModel('user.Delegation');
        var now = new Date();
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var startDate = this.findField('Delegation_StartDate');
        // Only do this validation for a new delegation
        if (delegation.get('Delegation_Id') == null) {
            if (startDate.getValue() < now) {
                startDate.markInvalid('The Start Date must be today or later.');
            }
        }
        var stopDate = this.findField('Delegation_StopDate');
        if (stopDate.getValue() < now) {
            stopDate.markInvalid('The Stop Date must be today or later.');
        }
        if (stopDate.getValue() < startDate.getValue()) {
            stopDate.markInvalid('The Stop Date must be the same or later than the Start Date.');
        }

		var delegations = this.findField('delegation_properties');
		if (delegations.getValue().length == 0) {
			delegations.markInvalid('Select at least one property.');
		}

        // Check for errors
        var errors = this.findInvalid();

        // If there are errors, make sure the first field is visible
        if (errors.getCount()) {
            isValid = false;
            errors.getAt(0).ensureVisible();
        }

        return isValid;
    }

});