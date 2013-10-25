/**
 * User Manager > Overview tab
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.Overview', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.user.overview',
    
    requires: [
        'NP.lib.core.Translator',
    	'NP.view.shared.button.New'
    ],

    bodyPadding: 8,

	html: 'User Manager provides access to all active users and user roles in NexusPayables. From User Manager, the administrator can add new users or update existing users as well as manage user roles and the rights assigned to each role.',

    initComponent: function() {
        this.title = NP.Translator.translate('Overview');

    	var bar = [
    		{ xtype: 'shared.button.new', itemId: 'newUserBtn', text: NP.Translator.translate('Create a New User') },
    		{ xtype: 'shared.button.new', itemId: 'newGroupBtn', text: NP.Translator.translate('Create a New User Group') }
    	];

    	this.tbar = bar;
    	this.bbar = bar;

    	this.callParent(arguments);
    }
});