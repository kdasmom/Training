/**
 * Delete button
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.button.Delete', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.delete',

    requires: ['NP.lib.core.Translator'],

    text: 'Delete',
    iconCls: 'delete-btn',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});