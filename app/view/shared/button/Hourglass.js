/**
 * Hourglass button
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.button.Hourglass', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.hourglass',

    requires: ['NP.lib.core.Translator'],

    text: 'Place On Hold',
    iconCls: 'hourglass-btn',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});