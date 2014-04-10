/**
 * My Settings: User Information section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.mySettings.UserInformation', {
    extend: 'NP.lib.ui.BoundForm',
    alias: 'widget.mysettings.userinformation',
    
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
        'NP.lib.ui.VerticalTabPanel',
    	'NP.view.user.UsersFormDetails',
        'NP.view.user.UserContactInfo',
        'NP.view.mySettings.UserPermissions',
    	'NP.view.shared.button.Save'
    ],

    title: 'User Information',

    layout: 'fit',
    autoScroll: true,

    initComponent: function() {
    	var labelWidth = 150,
			codingPropertyLabel = NP.Translator.translate(
				'{properties} for Coding Access Only',
				{ properties: NP.Config.getPropertyLabel(true) }
			);
    	var bar = [
	    	 { xtype: 'shared.button.save' }
	    ];

	    this.tbar = bar;
	    this.bbar = bar;

        // Binding this form to some models
        this.bind = {
            service: 'UserService',
            action : 'get',
            extraParams: {
                userprofile_id: NP.lib.core.Security.getUser().get('userprofile_id')
            },
            extraFields: ['role_id', 'coding_properties'],
            models: [
                'user.Userprofile',
                'user.Userprofilerole',
                'user.Staff',
                'contact.Person',
                'contact.Address',
                'contact.Email',
                {
                    classPath: 'contact.Phone',
                    prefix: 'home_'
                },
                {
                    classPath: 'contact.Phone',
                    prefix: 'work_'
                }
            ],
            evt: 'show'
        };

        this.items = [{
            xtype : 'verticaltabpanel',
            border: false,
            defaults: {
                padding: 8
            },
            items : [
				{ xtype: 'user.usercontactinfo' },
                { xtype: 'user.usersformdetails', isMySettings: true }
            ]
        }];

        if (NP.lib.core.Security.hasPermission(4)) {
			this.items[0].items.push(
				{
					xtype: 'container',
					layout: {
						type: 'vbox',
						align: 'stretch'
					},
					autoScroll: true,
					title: 'User permissions',
					items: [
						{ xtype: 'mysettings.userpermissions', height: 200, fieldLabel: 'Properties' },
						{ xtype: 'mysettings.userpermissions', name: 'coding_properties', fieldLabel: codingPropertyLabel, height: 200 }
					]
				}
			);
//            this.items[0].items.push({ xtype: 'mysettings.userpermissions' });
//            this.items[0].items.push({ xtype: 'mysettings.userpermissions', name: 'coding_properties', id: 'coding_properties', title: codingPropertyLabel });
        }

    	this.callParent(arguments);
    },

    isValid: function() {
        var me          = this,
            isValid     = this.callParent(),
            field       = this.findField('properties'),
            codingField = this.findField('coding_properties');

        
        if (field && field.getValue().length == 0) {
            field.markInvalid('This field is required.');
            isValid = false;
        }

        // Only check this if there are no other errors
        if (isValid) {
            var props       = field.getValue()
                codingProps = codingField.getValue();

            for (var i=0; i<codingProps.length; i++) {
                if (Ext.Array.contains(props, codingProps[i])) {
                    field.markInvalid('A ' + NP.Config.getPropertyLabel() + ' cannot have full access and coding-only access at the same time');
                    isValid = false;
                    break;
                }
            }
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