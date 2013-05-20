/**
 * Delegation form
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.mySettings.UserDelegationForm', {
    extend: 'NP.lib.ui.BoundForm',
    alias : 'widget.mysettings.userdelegationform',
    
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Save',
        'Ext.ux.form.field.BoxSelect'
    ],

    autoScroll : true,
    border     : false,
    bodyPadding: 8,

    startDateLabelText      : 'Start Date',
    stopDateLabelText       : 'Stop Date',
    delegateToLabelText     : 'Delegate to Whom',
    delegPropertiesLabelText: NP.Config.getSetting('PN.Main.PropertiesLabel') + ' to Delegate',
    delegPropertiesEmptyText: 'Select ' + NP.Config.getSetting('PN.Main.PropertiesLabel') + '...',

    initComponent: function() {
        var bar = [
            { xtype: 'shared.button.cancel' },
            { xtype: 'shared.button.save' }
        ];
        this.tbar = bar;
        this.bbar = bar;

        this.defaults = {
            labelWidth: 180
        };

        this.items = [
            {
                xtype     : 'datefield',
                fieldLabel: this.startDateLabelText,
                name      : 'delegation_startdate'
            },{
                xtype     : 'datefield',
                fieldLabel: this.stopDateLabelText,
                name      : 'delegation_stopdate'
            },{
                xtype       : 'combo',
                fieldLabel  : this.delegateToLabelText,
                forceSelection: true,
                queryMode   : 'local',
                width       : 600,
                name        : 'delegation_to_userprofile_id',
                displayField: 'userprofile_username',
                valueField  : 'userprofile_id',
                store       : Ext.create('NP.store.user.Userprofiles', {
                    service    : 'UserService',
                    action     : 'getAllowedDelegationUsers',
                    extraParams: {
                        userprofile_id: NP.Security.getUser().get('userprofile_id')
                    }
                }),
                listConfig: {
                    itemTpl: '{person_lastname}, {person_lastname} ({userprofile_username})'
                }
            },{
                xtype       : 'boxselect',
                fieldLabel  : this.delegPropertiesLabelText,
                name        : 'delegation_properties',
                emptyText   : this.delegPropertiesEmptyText,
                queryMode   : 'local',
                selectOnTab : false,
                displayField: 'property_name',
                valueField  : 'property_id',
                store       : 'user.Properties',
                width       : 600,
                growMin     : 200,
                growMax     : 400,
                allowBlank  : false,
                validateOnBlur: false,
                validateOnChange: false
            }
        ];

        this.callParent(arguments);
    },

    isValid: function() {
        var isValid = this.callParent();

        var delegation = this.getModel('user.Delegation');
        var now = new Date();
        var startDate = this.findField('delegation_startdate');
        // Only do this validation for a new delegation
        if (delegation.get('delegation_id') == null) {
            if (startDate.getValue() < now) {
                startDate.markInvalid('The Start Date must be today or later.');
            }
        }
        var stopDate = this.findField('delegation_stopdate');
        if (stopDate.getValue() < now) {
            stopDate.markInvalid('The Stop Date must be today or later.');
        }
        if (stopDate.getValue() < startDate.getValue()) {
            stopDate.markInvalid('The Stop Date must be the same or later than the Start Date.');
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