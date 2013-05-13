/**
 * My Settings: Mobile Settings section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.mySettings.MobileSettings', {
    extend: 'NP.lib.ui.BoundForm',
    alias: 'widget.mysettings.mobilesettings',
    
    requires: [
    	'NP.lib.core.Security',
    	'NP.view.shared.button.Save',
    	'NP.view.shared.button.New',
    	'NP.view.shared.button.Inactivate'
    ],

    bind: {
    	models     : ['user.MobInfo'],
		service    : 'UserService',
		action     : 'getMobileInfo',
		extraParams: {
			userprofile_id: NP.Security.getUser().get('userprofile_id')
        }
	},

    title: 'Mobile Settings',

    bodyPadding: 8,

    initComponent: function() {
    	var bar = [
	    	 { xtype: 'shared.button.save', text: 'Save and Activate' },
	    	 { xtype: 'shared.button.new', text: 'Register New Device', hidden: true },
	    	 { xtype: 'shared.button.inactivate', text: 'Disable', hidden: true }
	    ];

    	this.tbar = bar;
    	this.bbar = bar;

    	this.defaults = { labelWidth: 150, hideTrigger: true, enforceMaxLength: true, validateOnBlur: false, validateOnChange: false };
    	this.items = [
    		{
    			xtype     : 'textfield',
				fieldLabel: 'Mobile Phone Number',
				name      : 'mobinfo_phone',
				margin    : '0 0 0 0',
				minLength : 10,
				maxLength : 10
    		},{
				xtype    : 'displayfield',
				value    : '<i>Enter your 10 digit phone number as 7035551212</i>'
    		},{
    			xtype      : 'textfield',
				fieldLabel : 'New PIN',
				inputType  : 'password',
				name       : 'mobinfo_pin',
				minLength : 4,
				maxLength : 4
    		},{
    			xtype     : 'textfield',
				fieldLabel: 'Confirm New PIN',
				inputType : 'password',
				name      : 'mobinfo_pin_confirm',
				minLength : 4,
				maxLength : 4
    		}
    	];

    	this.callParent(arguments);

        this.on('afterrender', function(el) {
            this.query('displayfield')[0].labelCell.setVisibilityMode(Ext.dom.Element.VISIBILITY).setVisible(false);
        }, this);
    },

    isValid: function() {
        // Call the standard validation function
        var isValid = this.callParent();

        // Do validation specific to an implementation
        var pinConfirmField = this.findField('mobinfo_pin_confirm');
        if (this.findField('mobinfo_pin').getValue() != this.findField('mobinfo_pin_confirm').getValue()) {
        	pinConfirmField.markInvalid("Your PIN fields don't match");
        	isValid = false;
        }

        return isValid;
    }
});