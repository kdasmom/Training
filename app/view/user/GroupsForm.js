/**
 * User Manager > Groups tab > Form
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.GroupsForm', {
    extend: 'NP.lib.ui.BoundForm',
    alias: 'widget.user.groupsform',

    requires: [
    	'NP.lib.ui.VerticalTabPanel',
    	'NP.view.shared.button.Save',
        'NP.view.shared.button.New',
    	'NP.view.shared.button.Cancel',
    	'NP.view.user.GroupsFormInfo',
    	'NP.view.user.GroupsFormPermissions',
    	'NP.view.user.UsersFormEmail',
        'NP.view.user.GroupsFormDashboard',
    ],

    layout: 'fit',
    border: false,

    // For localization
    createCopyBtnText: 'Create Copy',
    
    initComponent: function() {
    	var that = this;

    	var bar = [
    		{ xtype: 'shared.button.save' },
    		{ xtype: 'shared.button.cancel' },
            { xtype: 'shared.button.new', itemId: 'createGroupCopyBtn', text: this.createCopyBtnText }
	    ];
	    this.tbar = bar;
	    this.bbar = bar;

	    this.items = [{
			xtype : 'verticaltabpanel',
			border: false,
            items : [
	    		{ xtype: 'user.groupsforminfo' },
	    		{ xtype: 'user.groupsformpermissions' },
	    		{ xtype: 'user.usersformemail', showEmailOverwrite: true, itemId: 'groupEmailAlertPanel' },
                { xtype: 'user.groupsformdashboard', border: false }
	    	]
	    }];

	    this.callParent(arguments);
    }
});