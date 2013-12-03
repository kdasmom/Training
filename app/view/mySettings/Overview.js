/**
 * My Settings: Overview section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.mySettings.Overview', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mysettings.overview',
    
    requires: ['NP.lib.core.Config'],

    title: 'Overview',

    margin: 8,

	initComponent: function() {
		var me = this;

		me.introText          = 'My Settings allows users to change their personal user information as well as manage certain system settings. The following tabs contain information to allow the user to manage the following information:';
		me.userInfoText       = '<b>User Information</b> - allows the user to change their password and update personal information such as their contact information and email address.';
		me.settingsText       = '<b>Settings</b> - allows the user to configure their dashboard default settings of what {property} they want to automatically log into as well as what summary statistic they want to auto display.';
		me.displayText        = '<b>Display</b> - allows the user to choose which default percentage setting they want to view on split screen views.  Note this is only applicable for users with access to view images in the system.';
		me.emailNotifText     = '<b>Email Notification</b>- allows the user to manage specific email alert frequencies for Purchase Orders and/or Invoices that require approval and for budget overage notifications.';
		me.mobileSettingsText = '<b>Mobile Settings</b>- allows users to register their mobile phone to begin using the Mobile Application for PO; Receipt and Invoice approvals. If you do not see this tab display; your role right has not been granted access to this section.';
		me.userDelegText      = '<b>User Delegation</b> - allows the user to delegate approval authority to another user while they are away.  Please note this will appear only on the Settings tab and for users who have been given rights to this functionality.';

    	me.html = 
    		me.introText +
	    	'<br /><br />' +
			'<ul>' +
				'<li>' + me.userInfoText +'</li>' +
				'<li>' + me.settingsText +'</li>';

		var settingVal = NP.lib.core.Config.getSetting('pn.main.WebDocumentz', 0);
		if (settingVal == 1 || settingVal == 2) {
			me.html += '<li>' + me.displayText +'</li>';
		}
		
		me.html += 
				'<li>' + me.emailNotifText +'</li>' +
				'<li>' + me.mobileSettingsText +'</li>' +
				'<li>' + me.userDelegText +'</li>' +
			'</ul>';

	    me.callParent(arguments);
    }
});