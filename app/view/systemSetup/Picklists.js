/**
 * System Setup: Picklist section
 *
 * @author Witold Frackiewicz - Testerix
 */
Ext.define('NP.view.systemSetup.Picklists', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.systemsetup.picklists',

    requires: ['NP.lib.core.Translator'],
    
    title: 'Picklist',

    html: 'Coming soon...',

    initComponent: function() {
    	this.title = NP.Translator.translate(this.title);

    	this.callParent(arguments);
    }
});