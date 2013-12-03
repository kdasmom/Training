/**
 * System Setup > Default Splits section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.systemSetup.DefaultSplits', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.systemsetup.defaultsplits',

    requires: ['NP.lib.core.Translator'],
    
    title: 'Default Splits',

    layout: 'fit',

    initComponent: function() {
    	this.title = NP.Translator.translate(this.title);

    	this.callParent(arguments);
    }
});