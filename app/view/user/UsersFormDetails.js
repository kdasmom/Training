/**
 * User Manager > Users tab > Form > Details
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.UsersFormDetails', {
    extend: 'Ext.container.Container',
    alias: 'widget.user.usersformdetails',

    requires: [
    	'NP.lib.core.Security',
        'NP.lib.core.Translator',
    	'NP.lib.ui.ComboBox'
    ],
    
    padding   : 8,
    autoScroll: true,

    // Custom options
    isMySettings    : false,
    passwordRequired: false,

    initComponent: function() {
    	var that = this;

        that.title = NP.Translator.translate('Password Management');

    	this.defaults = { labelWidth: 150 };

    	this.items = [
    		{
				xtype     : 'textfield',
				name      : 'userprofile_username',
				fieldLabel: NP.Translator.translate('Username'),
				allowBlank: false,
				disabled  : this.isMySettings,
                maxLengthText: 50
    		}
    	];

    	// If user is an admin, he doesn't need to re-enter his current password to change it
    	if (NP.Security.getRole().get('is_admin_role') == 1 || !this.isMySettings) {
    		this.items.push({
                xtype     : 'displayfield',
                name      : 'userprofile_password_current',
                fieldLabel: NP.Translator.translate('Current Password'),
                value     : '**********',
                hidden    : !this.isMySettings
    		});
    	} else {
    		this.items.push({
                xtype     : 'textfield',
                fieldLabel: NP.Translator.translate('Current Password'),
                name      : 'userprofile_password_current',
                inputType : 'password'
    		});
    	}

    	this.items.push(
    		{
				xtype     : 'textfield',
				name      : 'userprofile_password',
				inputType : 'password',
				fieldLabel: NP.Translator.translate('New Password'),
                allowBlank: !this.passwordRequired,
                maxLengthText: 256
    		},{
                xtype     : 'displayfield',
                itemId    : 'pwdExplanationField',
                value     : NP.Translator.translate('The minimum password length required is 6 characters. Password security requires that a minimum of one letter, number and special character be used when setting up user passwords in the system. Special characters include !, @, #, $, %, &, *, and ?.')
    		},{
				xtype     : 'textfield',
				name      : 'userprofile_password_confirm',
				inputType : 'password',
				fieldLabel: NP.Translator.translate('Confirm Password'),
                allowBlank: !this.passwordRequired,
                validator: function(val) {
                    var form = that.up('boundform');
                    var password_new = form.findField('userprofile_password').getValue();
                    if (password_new == val) {
                        return true;
                    } else {
                        return NP.Translator.translate('The password fields need to match');
                    }
                }
    		},{
				xtype     : 'customcombo',
				name      : 'role_id',
				fieldLabel: NP.Translator.translate('Position'),
				allowBlank: false,
				store		: Ext.create('NP.store.user.RoleTree', {
					service: 'UserService',
					action: 'getRoleTree',
					extraParams: {
//						excludeAdmin: true
						excludeAdmin: !this.isNewUser ? 0 : 1
					},
					autoLoad: true
				}),
				width     : 500,
				valueField: 'role_id',
				displayField: 'role_name',
				tpl         : 
                    '<tpl for=".">' +
                        '<li class="x-boundlist-item">' +
                        	'{indent_text}{role_name}' +
                        '</li>' +
                    '</tpl>',
                hidden: this.isMySettings
    		},{
				xtype     : 'datefield',
				name      : 'userprofile_startdate',
				fieldLabel: NP.Translator.translate('Start Date'),
				hidden    : this.isMySettings
    		},{
				xtype     : 'datefield',
				name      : 'userprofile_enddate',
				fieldLabel: NP.Translator.translate('End Date'),
				hidden    : this.isMySettings
    		}
    	);

    	// For My Settigns > User Information, add security questions
    	if (this.isMySettings) {
            this.questionStore = Ext.create('NP.store.system.SecurityQuestions');

    		// Add the 6 security question/answer fields
	    	for (var i=1; i<=6; i++) {
	    		this.items.push(
		    		{
		    			xtype: 'customcombo',
		    			fieldLabel: NP.Translator.translate('Security Question') + ' ' + i,
		    			name: 'security_question' + i,
		    			store: this.questionStore,
		    			displayField: 'lookupcode_description',
		    			valueField: 'lookupcode_id',
		    			width: 600,
                        allowBlank: false
		    		},{
		    			xtype: 'textfield',
		    			fieldLabel: NP.Translator.translate('Answer') + ' ' + i,
		    			name: 'security_answer' + i,
		    			width: 600,
                        allowBlank: false,
                        maxLengthText: 100
		    		}
	    		);
	    	}
    	}

    	this.callParent(arguments);

    	this.on('afterrender', function(el) {
    		this.queryById('pwdExplanationField').labelCell.setVisibilityMode(Ext.dom.Element.VISIBILITY).setVisible(false);
        }, this);
    }
});