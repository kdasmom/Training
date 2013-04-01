/**
 * My Settings section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.admin.MySettings', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.admin.mysettings',
    
    requires: [
    	'NP.view.admin.mysettings.Overview',
    	'NP.view.admin.mysettings.UserInformation',
    	'NP.view.admin.mysettings.Settings',
    	'NP.view.admin.mysettings.Display',
    	'NP.view.admin.mysettings.EmailNotification',
    	'NP.view.admin.mysettings.MobileSettings',
    	'NP.view.admin.mysettings.UserDelegation'
    ],

    title: 'User Settings',
    
    initComponent: function() {
    	this.items = [
    		{
	    		xtype: 'admin.mysettings.overview'
	    	},{
	    		xtype: 'admin.mysettings.userinformation'
	    	},{
	    		xtype: 'admin.mysettings.settings'
	    	}
    	];

    	var settingVal = NP.lib.core.Config.getSetting('pn.main.WebDocumentz', 0);
		if (settingVal == 1 || settingVal == 2) {
			this.items.push({
	    		xtype: 'admin.mysettings.display'
	    	});
		}

		this.items.push(
			{
	    		xtype: 'admin.mysettings.emailnotification'
	    	},
	    	{
	    		xtype: 'admin.mysettings.mobilesettings'
	    	},
	    	{
	    		xtype: 'admin.mysettings.userdelegation'
    		}
    	);

    	this.callParent(arguments);
    }
});