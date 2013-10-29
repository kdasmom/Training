/**
 * Activate button
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.button.Activate', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.activate',

    requires: ['NP.lib.core.Translator'],

    text: 'Activate',
    iconCls: 'activate-btn',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});