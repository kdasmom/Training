/**
 * My Settings: User Information : User Details
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.mySettings.UserDetails', {
    extend: 'Ext.container.Container',
    alias: 'widget.mysettings.userdetails',
    
    requires: [
        'NP.lib.core.Security'
    ],

    title: 'User Details',

    autoScroll: true,

    initComponent: function() {
    	var labelWidth = 150;
    	
        this.items = [{
            xtype: 'displayfield',
            fieldLabel: 'Username',
            labelWidth: labelWidth,
            value: NP.lib.core.Security.getUser().get('userprofile_username')
        }];

        // If user is an admin, he doesn't need to re-enter his current password to change it
    	if (NP.lib.core.Security.getRole().get('is_admin_role') == 1) {
    		this.items.push({
                xtype     : 'displayfield',
                fieldLabel: 'Current Password',
                labelWidth: labelWidth,
                value     : '**********'
    		});
    	} else {
    		this.items.push({
                xtype     : 'textfield',
                fieldLabel: 'Current Password',
                name      : 'userprofile_password_current',
                labelWidth: labelWidth,
                inputType : 'password'
    		});
    	}

    	this.items.push(
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
                    var form = Ext.ComponentQuery.query('[xtype="mysettings.userinformation"]')[0].getForm();
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
    		this.items.push(
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

    	this.callParent(arguments);

    	this.on('afterrender', function(el) {
    		this.queryById('pwdExplanationField').labelCell.setVisibilityMode(Ext.dom.Element.VISIBILITY).setVisible(false);
        }, this);
    }
});