/**
 * My Settings: Overview section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.admin.mysettings.Overview', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.admin.mysettings.overview',
    
    requires: ['NP.lib.core.Config'],

    title: 'Overview',

    margin: 8,

	introText         : 'My Settings allows users to change their personal user information as well as manage certain system settings. The following tabs contain information to allow the user to manage the following information:',
	userInfoText      : '<b>User Information</b> - allows the user to change their password and update personal information such as their contact information and email address.',
	settingsText      : '<b>Settings</b> - allows the user to configure their dashboard default settings of what property they want to automatically log into as well as what summary statistic they want to auto display.',
	displayText       :  '<b>Display</b> - allows the user to choose which default percentage setting they want to view on split screen views.  Note this is only applicable for users with access to view images in the system.',
	emailNotifText    : '<b>Email Notification</b>- allows the user to manage specific email alert frequencies for Purchase Orders and/or Invoices that require approval and for budget overage notifications.',
	mobileSettingsText: '<b>Mobile Settings</b>- allows users to register their mobile phone to begin using the Mobile Application for PO, Receipt and Invoice approvals. If you do not see this tab display, your role right has not been granted access to this section.',
	userDelegText     : '<b>User Delegation</b> - allows the user to delegate approval authority to another user while they are away.  Please note this will appear only on the Settings tab and for users who have been given rights to this functionality.',

    initComponent: function() {
    	this.html = 
    		this.introText +
	    	'<br /><br />' +
			'<ul>' +
				'<li>' + this.userInfoText +'</li>' +
				'<li>' + this.settingsText +'</li>';

		var settingVal = NP.lib.core.Config.getSetting('pn.main.WebDocumentz', 0);
		if (settingVal == 1 || settingVal == 2) {
			this.html += '<li>' + this.displayText +'</li>';
		}
		
		this.html += 
				'<li>' + this.emailNotifText +'</li>' +
				'<li>' + this.mobileSettingsText +'</li>' +
				'<li>' + this.userDelegText +'</li>' +
			'</ul>';

	    this.callParent(arguments);
    }
});