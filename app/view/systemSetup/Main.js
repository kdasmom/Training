/**
 * System Setup section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.systemSetup.Main', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.systemsetup.main',
    
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
    	'NP.view.systemSetup.Overview',
    	'NP.view.systemSetup.Settings',
    	'NP.view.systemSetup.WorkflowManager',
    	'NP.view.systemSetup.GLAccounts',
    	'NP.view.systemSetup.PasswordConfiguration',
    	'NP.view.systemSetup.CustomFields',
    	'NP.view.systemSetup.Picklists',
    	'NP.view.systemSetup.DefaultSplits'
    ],

    title: 'System Setup',
    
    initComponent: function() {
    	this.items = [
    		{
	    		xtype: 'systemsetup.overview'
	    	},{
	    		xtype: 'systemsetup.settings'
	    	}
    	];
    	
    	if (NP.Security.hasPermission(1041)) {
            this.items.push({
                xtype: 'systemsetup.workflowmanager'
            });
        }
    	
    	 this.items.push({
             xtype: 'systemsetup.glaccounts'
         });
    	
    	if (NP.Security.hasPermission(6085)) {
            this.items.push({
                xtype: 'systemsetup.passwordconfiguration'
            });
        }
    	
    	if (NP.Security.hasPermission(6086)) {
            this.items.push({
                xtype: 'systemsetup.customfields'
            });
        }
    	
    	if (NP.Security.hasPermission(6087)) {
            this.items.push({
                xtype: 'systemsetup.picklists'
            });
        }
    	
    	if (NP.Security.hasPermission(6088)) {
            this.items.push({
                xtype: 'systemsetup.defaultsplits'
            });
        }
    	

    	this.callParent(arguments);
    }
});