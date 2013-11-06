/**
 * Back button
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.button.Back', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.back',

    requires: ['NP.lib.core.Translator'],

    text: 'Back',
    iconCls: 'back-btn',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});