/**
 * View button
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.button.View', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.view',

    requires: ['NP.lib.core.Translator'],

    text   : 'View',
    iconCls: 'view-btn',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});