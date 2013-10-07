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
    	'NP.view.shared.button.Inactivate',
        'NP.view.mobileSetup.MobileForm'
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

    	this.items = [{ xtype: 'mobilesetup.mobileform' }];

    	this.callParent(arguments);
    },

    isValid: function() {
        var me      = this,
            isValid = me.callParent(arguments);

        return isValid && me.query('[xtype="mobilesetup.mobileform"]')[0].isValid();
    }
});