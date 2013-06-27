/**
 * User Manager > Overview tab
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.Overview', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.user.overview',
    
    requires: [
    	'NP.view.shared.button.New'
    ],

    // For localization
	title           : 'Overview',
	newUserBtnLabel : 'Create a New User',
	newGroupBtnLabel: 'Create a New User Group',

    bodyPadding: 8,

	html: 'User Manager provides access to all active users and user roles in NexusPayables. From User Manager, the administrator can add new users or update existing users as well as manage user roles and the rights assigned to each role.',

    initComponent: function() {
    	var bar = [
    		{ xtype: 'shared.button.new', text: this.newUserBtnLabel },
    		{ xtype: 'shared.button.new', text: this.newGroupBtnLabel }
    	];

    	this.tbar = bar;
    	this.bbar = bar;

    	this.callParent(arguments);
    }
});