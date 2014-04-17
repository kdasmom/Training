/**
 * User Manager > Users tab > Form
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.UsersForm', {
    extend: 'NP.lib.ui.BoundForm',
    alias: 'widget.user.usersform',

    requires: [
    	'NP.lib.ui.VerticalTabPanel',
    	'NP.view.shared.button.Save',
    	'NP.view.shared.button.Cancel',
    	'NP.view.user.UsersFormDetails',
    	'NP.view.user.UserContactInfo',
    	'NP.view.user.UsersFormPermissions',
    	'NP.view.user.UserDelegation',
        'NP.view.user.UserDelegationMain',
    	'NP.view.user.UsersFormEmail',
    	'NP.view.user.UsersFrequentlyBasedEmailAlertsForm'
    ],

    layout: 'fit',
    border: false,

    passwordRequired : false,
    
    initComponent: function() {
    	var that = this;

    	var bar = [
			{ xtype: 'shared.button.cancel' },
    		{ xtype: 'shared.button.save' }
	    ];
	    this.tbar = bar;

	    this.items = [{
			xtype : 'verticaltabpanel',
			border: false,
            items : [
	    		{ xtype: 'user.usercontactinfo', padding: 8, title: NP.Translator.translate('User Information') },
				{ xtype: 'user.usersformdetails', passwordRequired: this.passwordRequired, isNewUser: this.isNewUser },
	    		{ xtype: 'user.usersformpermissions' },
	    		{ xtype: 'user.usersformemail', itemId: 'userEmailAlertPanel' },
				{ xtype: 'user.usersfrequentlybasedemailalertsform', itemId: 'userFrequentlyBasedEmailAlertPanel', title: NP.Translator.translate('Frequency-Based Alerts') },
                {
                    xtype : 'user.userdelegation',
                    itemId: 'userManagerDelegation',
                    title : NP.Translator.translate('Delegation'),
                    border: false,
                    items : [{ xtype: 'user.userdelegationmain' }],
                    hidden: true
                }
	    	]
	    }];

	    this.callParent(arguments);
    },

    isValid: function() {
        var me          = this,
            isValid     = this.callParent(),
            field       = this.findField('properties'),
            codingField = this.findField('coding_properties'),
            emailField  = this.findField('email_address'),
            zipField    = this.findField('address_zip'),
            zipExtField    = this.findField('address_zipext');

        
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

            if (emailField.getValue().length > 0) {
                var ereg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
                if (!(isValid = ereg.test(emailField.getValue()))) {
                    emailField.markInvalid(NP.Translator.translate('Use correct email address, please.'));
                }
            }
            if (zipField.getValue().length > 0) {
                if (!(isValid = /(\d{5})/.test(zipField.getValue()))) {
                    zipField.markInvalid(NP.Translator.translate('Zip should contain five digits.'));
                }

            }
            if (zipExtField.getValue().length > 0) {
                if (!(isValid = /(\d{4})/.test(zipExtField.getValue()))) {
                    zipExtField.markInvalid(NP.Translator.translate('Zip ext should contain four digits.'));
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