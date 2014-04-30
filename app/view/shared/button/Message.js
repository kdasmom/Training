/**
 * Message button
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.button.Message', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.message',

    requires: ['NP.lib.core.Translator'],

    text        : 'Send',
    iconCls     : 'message-btn',
    componentCls: 'message-comp-btn',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});