/**
 * New button
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.button.New', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.new',

    requires: ['NP.lib.core.Translator'],

    text   : 'New',
    iconCls: 'new-btn',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});