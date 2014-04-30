Ext.define('NP.view.shared.button.SaveAndActivate', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.saveandactivate',

    requires: ['NP.lib.core.Translator'],

    text: 'Save & Activate',
    iconCls: 'save-and-activate-btn',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});