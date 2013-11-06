/**
 * My Settings: User Delegation section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.UserDelegation', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.user.userdelegation',
	
    requires: ['NP.lib.core.Translator'],

    title: 'User Delegation',

    layout: 'fit',

	initComponent: function() {
		this.title = NP.Translator.translate(this.title);
		
		this.callParent(arguments);
	}
});