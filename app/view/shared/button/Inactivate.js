/**
 * Inactivate button
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.button.Inactivate', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.inactivate',

    requires: ['NP.lib.core.Translator'],

    text: 'Inactivate',
    iconCls: 'inactivate-btn',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});