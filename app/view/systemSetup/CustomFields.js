/**
 * System Setup: Custom Fields section
 *
 * @author Witold Frackiewicz - Testerix
 */
Ext.define('NP.view.systemSetup.CustomFields', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.systemsetup.customfields',

    requires: ['NP.lib.core.Translator'],
    
    title: 'Custom Fields',

    html: 'Coming soon...',

    initComponent: function() {
    	this.title = NP.Translator.translate(this.title);

    	this.callParent(arguments);
    }
});