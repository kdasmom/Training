/**
 * My Settings section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.mySettings.Main', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.mysettings.main',
    
    requires: [
    	'NP.view.mySettings.Overview',
    	'NP.view.mySettings.UserInformation',
    	'NP.view.mySettings.Settings',
    	'NP.view.mySettings.Display',
    	'NP.view.mySettings.EmailNotification',
    	'NP.view.mySettings.MobileSettings',
    	'NP.view.mySettings.UserDelegation'
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
	    	}
    	];

    	var settingVal = NP.lib.core.Config.getSetting('pn.main.WebDocumentz', 0);
		if (settingVal == 1 || settingVal == 2) {
			this.items.push({
	    		xtype: 'mysettings.display'
	    	});
		}

		this.items.push(
			{
	    		xtype: 'mysettings.emailnotification'
	    	},
	    	{
	    		xtype: 'mysettings.mobilesettings'
	    	},
	    	{
	    		xtype: 'mysettings.userdelegation'
    		}
    	);

    	this.callParent(arguments);
    }
});