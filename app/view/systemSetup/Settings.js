/**
 * System Setup: Settings section
 *
 * @author Witold Frackiewicz - Testerix
 */
Ext.define('NP.view.systemSetup.Settings', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.systemsetup.settings',

    requires: ['NP.lib.core.Translator'],
    
    title: 'Settings',

    html: 'Coming soon...',

    initComponent: function() {
    	this.title = NP.Translator.translate(this.title);

    	this.callParent(arguments);
    }
});