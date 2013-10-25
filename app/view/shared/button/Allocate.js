/**
 * Allocate button
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.button.Allocate', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.allocate',

    requires: ['NP.lib.core.Translator'],

    text: 'Allocate',
    iconCls: 'allocate-btn',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});