/**
 * Save button
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.button.Save', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.save',

    requires: ['NP.lib.core.Translator'],

    text   : 'Save',
    iconCls: 'save-btn',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});