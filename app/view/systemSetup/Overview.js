/**
 * System Setup: Overview section
 *
 * @author Witold Frackiewicz - Testerix
 */
Ext.define('NP.view.systemSetup.Overview', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.systemsetup.overview',
    
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Translator'
    ],

    margin: 8,

	initComponent: function() {
        var me = this;

        me.title = NP.Translator.translate('Overview');

        me.translateText();

    	me.html = 
    		me.introText +
	    	'<br /><br />' +
			'<ul>' +
				'<li>' + me.settingsText +'</li>';
    	
    	if (NP.Security.hasPermission(1041)) {
            me.html += '<li>' + me.workflowManagerText +'</li>';
        }
    	
    	me.html +='<li>' + me.glAccountsText +'</li>';
    	
    	if (NP.Security.hasPermission(6085)) {
            me.html += '<li>' + me.passwordConfigurationText +'</li>';
        }
    	
    	if (NP.Security.hasPermission(6086)) {
            me.html += '<li>' + me.customFieldsText +'</li>';
        }
    	
    	if (NP.Security.hasPermission(6087)) {
            me.html += '<li>' + me.picklistsText +'</li>';
        }
    	
    	if (NP.Security.hasPermission(6088)) {
            me.html += '<li>' + me.defaultSplitsText +'</li>';
        }
				
		me.html +='</ul>';

	    me.callParent(arguments);
    },

    translateText: function() {
        var me = this;

        me.introText                 = 'Much of the information in System Setup is established at the time that the system is first deployed or a new feature is added.  However, the system administrator can access this information, as necessary, for review or update.';
        me.settingsText              = '<b>Settings</b> - this section should be accessed only by your NexusPayables support staff.';
        me.workflowManagerText       = '<b>Workflow Manager</b> - this tab contains the full list of Workflow rules set up in the system and provides a way for you to add, edit, and delete these rules at any time.  Please refer to the specific overview section within this tab for more information.';
        me.glAccountsText            = '<b>GL Accounts</b> - this tab contains the full list of GL accounts set up in the system and provides a way for you to add, edit, and delete these accounts. Please refer to the specific overview section within this tab for more information.';
        me.passwordConfigurationText = '<b>Password Configuration</b> - the Password Configuration options available in this tab are provided as a means to control how users set up and change their passwords.';
        me.customFieldsText          = '<b>Custom Fields</b> - this tab provides a way to manage up to three custom fields, to be defined by you, for use on Purchase Orders and Invoices';
        me.picklistsText             = '<b>Picklists</b> - this tab provides a way to manage the values that should display on Rejection Notes, Vendor Types, and Vendor Document Types.  These values can be updated and added to at any time.';
        me.defaultSplitsText         = '<b>Default Splits</b> - this tab displays a list of current default splits set up in the system and provides a way to upload new default splits in the system.';
    }
});