/**
 * @author Baranov A.V.
 * @date 9/27/13
 */
Ext.define('NP.view.shared.button.Print', {
    extend: 'Ext.button.Button',
    alias: 'widget.shared.button.print',

    requires: ['NP.lib.core.Translator'],

    iconCls: 'print-btn',
    text   : 'Print',

    initComponent: function() {
        this.text = NP.Translator.translate(this.text);
        
        this.callParent(arguments);
    }
});