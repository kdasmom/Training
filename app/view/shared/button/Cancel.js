/**
 * Cancel button
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.button.Cancel', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.cancel',

    requires: ['NP.lib.core.Translator'],

    text: 'Cancel',
    iconCls: 'cancel-btn',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});