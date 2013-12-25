Ext.define('NP.view.shared.button.Close', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.close',

    requires: ['NP.lib.core.Translator'],

    text: 'Close',
    iconCls: 'close-btn',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});