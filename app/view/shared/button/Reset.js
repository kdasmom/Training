/**
 * Back button
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.button.Reset', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.reset',

    requires: ['NP.lib.core.Translator'],

    text   : 'Reset',
    iconCls: 'reset-btn',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});