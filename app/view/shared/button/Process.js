/**
 * Process button
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.button.Process', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.process',

    requires: ['NP.lib.core.Translator'],

    text        : 'Process',
    iconCls     : 'process-btn',
    componentCls: 'process-comp-btn',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});