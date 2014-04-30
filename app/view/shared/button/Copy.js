Ext.define('NP.view.shared.button.Copy', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.copy',

    requires: ['NP.lib.core.Translator'],

    text: 'Copy',
    iconCls: 'copy-btn',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});