/**
 * My Settings: User Information section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.mySettings.UserInformation', {
    extend: 'NP.lib.ui.BoundForm',
    alias: 'widget.mysettings.userinformation',
    
    requires: [
        'NP.lib.core.Security',
        'NP.lib.ui.VerticalTabPanel',
    	'NP.view.mySettings.UserDetails',
        'NP.view.mySettings.UserContactInfo',
        'NP.view.mySettings.UserPermissions',
    	'NP.view.shared.button.Save'
    ],

    title: 'User Information',

    layout: 'fit',
    autoScroll: true,

    // Bindind this form to some models
    bind: {
        service: 'UserService',
        action : 'get',
        extraParams: {
            userprofile_id: NP.lib.core.Security.getUser().get('userprofile_id')
        },
        models: [
            'user.Userprofile',
            'contact.Person',
            'contact.Address',
            'contact.Email',
            {
                class: 'contact.Phone',
                prefix: 'home_'
            },
            {
                class: 'contact.Phone',
                prefix: 'work_'
            }
        ],
        evt: 'show'
    },

    initComponent: function() {
    	var labelWidth = 150;
    	var bar = [
	    	 { xtype: 'shared.button.save' }
	    ];

	    this.tbar = bar;
	    this.bbar = bar;

        this.items = [{
            xtype : 'verticaltabpanel',
            border: false,
            defaults: {
                padding: 8
            },
            items : [
                { xtype: 'mysettings.userdetails' },
                { xtype: 'mysettings.usercontactinfo' }
            ]
        }];

        if (NP.lib.core.Security.hasPermission(4)) {
            this.items[0].items.push({ xtype: 'mysettings.userpermissions' });
        }

    	this.callParent(arguments);
    },

    isValid: function() {
        var me = this;

        // Call the standard validation function
        var isValid = this.callParent();

        var field = this.findField('user_properties');
        if (field.getValue().length == 0) {
            field.markInvalid('This field is required.');
            isValid = false;
        }

        // Check for errors
        var errors = this.findInvalid();

        // If there are errors, make sure the first field is visible
        if (errors.getCount()) {
            errors.getAt(0).ensureVisible();
        }

        return isValid;
    }
});