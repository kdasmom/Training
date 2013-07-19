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
    	'NP.view.user.UsersFormEmail'
    ],

    layout: 'fit',
    border: false,

    // For localization
    delegationTabText: 'Delegation',
    infoTabText      : 'User Information',
    passwordRequired : false,
    
    initComponent: function() {
    	var that = this;

    	var bar = [
    		{ xtype: 'shared.button.save' },
    		{ xtype: 'shared.button.cancel' }
	    ];
	    this.tbar = bar;
	    this.bbar = bar;

	    this.items = [{
			xtype : 'verticaltabpanel',
			border: false,
            items : [
	    		{ xtype: 'user.usersformdetails', passwordRequired: this.passwordRequired },
	    		{ xtype: 'user.usercontactinfo', padding: 8, title: this.infoTabText },
	    		{ xtype: 'user.usersformpermissions' },
	    		{ xtype: 'user.usersformemail' },
                {
                    xtype : 'user.userdelegation',
                    itemId: 'userManagerDelegation',
                    title : 'Delegation',
                    border: false,
                    items : [{ xtype: 'user.userdelegationmain' }],
                    hidden: true
                }
	    	]
	    }];

	    this.callParent(arguments);
    }
});