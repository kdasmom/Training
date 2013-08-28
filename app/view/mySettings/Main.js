/**
 * My Settings section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.mySettings.Main', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.mysettings.main',
    
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
    	'NP.view.mySettings.Overview',
    	'NP.view.mySettings.UserInformation',
    	'NP.view.mySettings.Settings',
        'NP.view.mySettings.Dashboard',
    	'NP.view.mySettings.Display',
    	'NP.view.mySettings.EmailNotification',
    	'NP.view.mySettings.MobileSettings',
    	'NP.view.user.UserDelegation'
    ],

    title: 'My Settings',
    
    initComponent: function() {
    	this.items = [
    		{
	    		xtype: 'mysettings.overview'
	    	},{
	    		xtype: 'mysettings.userinformation'
	    	},{
	    		xtype: 'mysettings.settings'
	    	},{
                xtype: 'mysettings.dashboard'
            }
    	];

    	var settingVal = NP.Config.getSetting('pn.main.WebDocumentz', 0);
		if (settingVal == 1 || settingVal == 2) {
			this.items.push({
	    		xtype: 'mysettings.display'
	    	});
		}

        if (NP.Security.hasPermission(2095)) {
            this.items.push({
                xtype: 'mysettings.emailnotification'
            });
        }

        if (NP.Security.hasPermission(6049)) {
            this.items.push({
                xtype: 'mysettings.mobilesettings'
            });
        }

		this.items.push({ xtype: 'user.userdelegation', itemId:'mySettingsDelegation' });

    	this.callParent(arguments);
    }
});