/**
 * Edit button
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.button.Edit', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.edit',

    requires: ['NP.lib.core.Translator'],

    text: 'Edit',
    iconCls: 'edit-btn',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});