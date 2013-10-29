/**
 * Save And Add Another button
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.button.SaveAndAdd', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.saveandadd',

    requires: ['NP.lib.core.Translator'],

    text   : 'Save And Add Another',
    iconCls: 'save-and-add-btn',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});