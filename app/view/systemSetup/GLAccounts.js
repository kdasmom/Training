/**
 * System Setup: GL Accounts section
 *
 * @author Witold Frackiewicz - Testerix
 */
Ext.define('NP.view.systemSetup.GLAccounts', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.systemsetup.glaccounts',

    requires: ['NP.lib.core.Translator'],
    
    title: 'GL Accounts',

    html: 'Coming soon...',

    initComponent: function() {
    	this.title = NP.Translator.translate(this.title);

    	this.callParent(arguments);
    }
});