/**
 * UserManager section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.UserManager', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.user.usermanager',
    
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
    	'NP.view.user.Overview',
    	'NP.view.user.Users',
    	'NP.view.user.Groups',
    	'NP.view.user.Reports'
    ],

    title: 'User Manager',
    
    items: [
        {
            xtype: 'user.overview'
        },{
            xtype: 'user.users'
        },{
            xtype: 'user.groups'
        },{
            xtype: 'user.reports'
        }
    ]
});