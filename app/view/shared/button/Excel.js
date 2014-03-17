/**
 * Export to Excel button
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.button.Excel', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.excel',

    requires: ['NP.lib.core.Translator'],

    iconCls: 'excel-btn',
    text   : 'Export to Excel',

    initComponent: function() {
        this.text = NP.Translator.translate(this.text);
        
        this.callParent(arguments);
    }
});