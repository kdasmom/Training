Ext.define('NP.view.shared.button.Next', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.next',

    requires: ['NP.lib.core.Translator'],

    text: 'Next Step',
    iconCls: 'next-btn',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});