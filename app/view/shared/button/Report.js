/**
 * @author Baranov A.V.
 * @date 9/30/13
 */
Ext.define('NP.view.shared.button.Report', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.report',

    requires: ['NP.lib.core.Translator'],

    text: 'Report',
    iconCls: 'report-btn',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});