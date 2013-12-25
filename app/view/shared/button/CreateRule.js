Ext.define('NP.view.shared.button.CreateRule', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.createrule',

    requires: ['NP.lib.core.Translator'],

    text: 'Create Rule',
    iconCls: 'create-rule-btn',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});