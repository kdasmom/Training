/**
 * My Settings: User Information section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.admin.mysettings.UserInformation', {
    extend: 'Ext.form.Panel',
    alias: 'widget.admin.mysettings.userinformation',
    
    requires: [
    	'NP.lib.core.Security',
    	'NP.lib.ui.ComboBox',
    	'NP.view.shared.Person',
    	'NP.view.shared.Address',
    	'NP.view.shared.Phone',
    	'NP.view.shared.button.Save',
    	'NP.view.shared.button.Cancel'
    ],

    title: 'User Information',

    autoScroll: true,

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
    					value: NP.lib.core.Security.getUser().userprofile_username
    				}
    			]
    		}
    	];

    	// If user is an admin, he doesn't need to re-enter his current password to change it
    	if (NP.lib.core.Security.getRole().get('is_admin_role') == 1) {
    		this.items[0].items.push({
    			xtype: 'displayfield',
				fieldLabel: 'Current Password',
    			labelWidth: labelWidth,
				value: '**********'
    		});
    	} else {
    		this.items[0].items.push({
    			xtype: 'textfield',
				fieldLabel: 'Current Password',
    			labelWidth: labelWidth,
				inputType: 'password'
    		});
    	}

    	this.items[0].items.push(
    		{
    			xtype: 'textfield',
    			fieldLabel: 'New Password',
    			labelWidth: labelWidth,
    			inputType: 'password'
    		},{
    			xtype: 'displayfield',
    			itemId: 'pwdExplanationField',
    			labelWidth: labelWidth,
    			value: 'The minimum password length required is 6 characters. Password security requires that a minimum of one letter, number and special character be used when setting up user passwords in the system. Special characters include !, @, #, $, %, &, *, and ?.'
    		},{
    			xtype: 'textfield',
    			fieldLabel: 'Confirm New Password',
    			labelWidth: labelWidth,
    			inputType: 'password'
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
								width     : 250,
								vtype     : 'email'
    						},{
    							xtype: 'shared.phone',
    							label: 'Home Phone',
    							prefix: 'home'
    						},{
    							xtype: 'shared.phone',
    							label: 'Business Phone',
    							prefix: 'work'
    						}
    					]
    				}
    			]
    		}
    	);

    	this.callParent(arguments);

    	this.on('afterrender', function(el) {
    		this.queryById('pwdExplanationField').labelCell.setVisibilityMode(Ext.dom.Element.VISIBILITY).setVisible(false);
        }, this);
    }
});