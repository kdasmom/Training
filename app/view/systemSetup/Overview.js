/**
 * System Setup: Overview section
 *
 * @author Witold Frackiewicz - Testerix
 */
Ext.define('NP.view.systemSetup.Overview', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.systemsetup.overview',
    
    requires: ['NP.lib.core.Config'],

    title: 'Overview',

    margin: 8,

	introText					: 'Much of the information in System Setup is established at the time that the system is first deployed or a new feature is added.  However, the system administrator can access this information, as necessary, for review or update.',
	settingsText				: '<b>Settings</b> - this section should be accessed only by your NexusPayables support staff.',
	workflowManagerText			: '<b>Workflow Manager</b> - this tab contains the full list of Workflow rules set up in the system and provides a way for you to add, edit, and delete these rules at any time.  Please refer to the specific overview section within this tab for more information.',
	glAccountsText				: '<b>GL Accounts</b> - this tab contains the full list of GL accounts set up in the system and provides a way for you to add, edit, and delete these accounts. Please refer to the specific overview section within this tab for more information.',
	passwordConfigurationText	: '<b>Password Configuration</b> - the Password Configuration options available in this tab are provided as a means to control how users set up and change their passwords.',
	customFieldsText			: '<b>Custom Fields</b> - this tab provides a way to manage up to three custom fields, to be defined by you, for use on Purchase Orders and Invoices',
	picklistsText				: '<b>Picklists</b> - this tab provides a way to manage the values that should display on Rejection Notes, Vendor Types, and Vendor Document Types.  These values can be updated and added to at any time.',
	defaultSplitsText			: '<b>Default Splits</b> - this tab displays a list of current default splits set up in the system and provides a way to upload new default splits in the system.',

    initComponent: function() {
    	this.html = 
    		this.introText +
	    	'<br /><br />' +
			'<ul>' +
				'<li>' + this.settingsText +'</li>';
    	
    	if (NP.Security.hasPermission(1041)) {
            this.html += '<li>' + this.workflowManagerText +'</li>';
        }
    	
    	this.html +='<li>' + this.glAccountsText +'</li>';
    	
    	if (NP.Security.hasPermission(6085)) {
            this.html += '<li>' + this.passwordConfigurationText +'</li>';
        }
    	
    	if (NP.Security.hasPermission(6086)) {
            this.html += '<li>' + this.customFieldsText +'</li>';
        }
    	
    	if (NP.Security.hasPermission(6087)) {
            this.html += '<li>' + this.picklistsText +'</li>';
        }
    	
    	if (NP.Security.hasPermission(6088)) {
            this.html += '<li>' + this.defaultSplitsText +'</li>';
        }
				
		this.html +='</ul>';

	    this.callParent(arguments);
    }
});