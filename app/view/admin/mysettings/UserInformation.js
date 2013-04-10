/**
 * My Settings: User Information section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.admin.mysettings.UserInformation', {
    extend: 'NP.lib.ui.BoundForm',
    alias: 'widget.admin.mysettings.userinformation',
    
    requires: [
        'NP.lib.core.Config',
    	'NP.lib.core.Security',
    	'NP.lib.ui.ComboBox',
        'Ext.ux.form.ItemSelector',
    	'NP.view.shared.Person',
    	'NP.view.shared.Address',
    	'NP.view.shared.Phone',
    	'NP.view.shared.button.Save',
    	'NP.view.shared.button.Cancel'
    ],

    title: 'User Information',

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
        ]
    },

    initComponent: function() {
    	var labelWidth = 150;
    	var bar = [
	    	 { xtype: 'shared.button.save' }
	    ];

	    this.tbar = bar;
	    this.bbar = bar;

    	this.items = [
    		{
    			xtype: 'fieldset',
    			margin: 8,
    			title: 'User Details',
    			items: [
    				{
    					xtype: 'displayfield',
    					fieldLabel: 'Username',
    					labelWidth: labelWidth,
    					value: NP.lib.core.Security.getUser().get('userprofile_username')
    				}
    			]
    		}
    	];

    	// If user is an admin, he doesn't need to re-enter his current password to change it
    	if (NP.lib.core.Security.getRole().get('is_admin_role') == 1) {
    		this.items[0].items.push({
                xtype     : 'displayfield',
                fieldLabel: 'Current Password',
                labelWidth: labelWidth,
                value     : '**********'
    		});
    	} else {
    		this.items[0].items.push({
                xtype     : 'textfield',
                fieldLabel: 'Current Password',
                name      : 'userprofile_password_current',
                labelWidth: labelWidth,
                inputType : 'password'
    		});
    	}

    	this.items[0].items.push(
    		{
                xtype     : 'textfield',
                fieldLabel: 'New Password',
                name      : 'userprofile_password',
                labelWidth: labelWidth,
                inputType : 'password'
    		},{
                xtype     : 'displayfield',
                itemId    : 'pwdExplanationField',
                labelWidth: labelWidth,
                value     : 'The minimum password length required is 6 characters. Password security requires that a minimum of one letter, number and special character be used when setting up user passwords in the system. Special characters include !, @, #, $, %, &, *, and ?.'
    		},{
                xtype     : 'textfield',
                fieldLabel: 'Confirm New Password',
                name      : 'userprofile_password_confirm',
                labelWidth: labelWidth,
                inputType : 'password',
                validator: function(val) {
                    var form = Ext.ComponentQuery.query('[xtype="admin.mysettings.userinformation"]')[0].getForm();
                    var password_new = form.findField('userprofile_password').getValue();
                    if (password_new == val) {
                        return true;
                    } else {
                        return 'The password fields need to match';
                    }
                }
    		}
    	);

    	// Add the 6 security question/answer fields
    	for (var i=1; i<=6; i++) {
    		this.items[0].items.push(
	    		{
	    			xtype: 'combobox',
	    			queryMode: 'local',
	    			fieldLabel: 'Security Question ' + i,
	    			name: 'security_question' + i,
	    			labelWidth: labelWidth,
	    			store: 'system.SecurityQuestions',
	    			displayField: 'lookupcode_description',
	    			valueField: 'lookupcode_id',
	    			width: 600
	    		},{
	    			xtype: 'textfield',
	    			fieldLabel: 'Answer ' + i,
	    			name: 'security_answer' + i,
	    			labelWidth: labelWidth,
	    			width: 600
	    		}
    		);
    	}

    	this.items.push(
    		{
    			xtype: 'fieldset',
    			margin: 8,
    			title: 'User Information',
    			items: [
    				{
    					xtype: 'fieldcontainer',
    					fieldLabel: "User's Name",
    					items: { xtype: 'shared.person', required: true }
    				},{
    					xtype: 'fieldcontainer',
    					fieldLabel: 'Current Address',
    					defaults: {
					        labelAlign: 'top'
					    },
    					items: [
    						{ xtype: 'shared.address' },
    						{
								xtype     : 'textfield',
								fieldLabel: 'Email Address',
								name      : 'email_address',
								width     : 250
    						},{
    							xtype: 'shared.phone',
    							label: 'Home Phone',
    							prefix: 'home_'
    						},{
    							xtype: 'shared.phone',
    							label: 'Business Phone',
    							prefix: 'work_'
    						}
    					]
    				}
    			]
    		}
    	);

        if (NP.lib.core.Security.hasPermission(4)) {
            this.items.push({
                xtype : 'fieldset',
                margin: 8,
                title : 'User Permissions',
                items : [
                    {
                        xtype       : 'itemselector',
                        name        : 'user_properties',
                        anchor      : '100%',
                        fieldLabel  : NP.lib.core.Config.getSetting('PN.Main.PropertiesLabel'),
                        store       : 'property.AllProperties',
                        displayField: 'property_name',
                        valueField  : 'property_id',
                        allowBlank  : false,
                        fromTitle   : 'Unassigned',
                        toTitle     : 'Assigned',
                        buttons     : ['add','remove'],
                        height      : 160
                    }
                ]
            });
        }

    	this.callParent(arguments);

    	this.on('afterrender', function(el) {
    		this.queryById('pwdExplanationField').labelCell.setVisibilityMode(Ext.dom.Element.VISIBILITY).setVisible(false);
        }, this);
    }
});