/**
 * The invoice void window
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.VoidWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.invoice.voidwindow',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Translator',
    	'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Save'
    ],

    layout     : {
        type : 'vbox',
        align: 'stretch'
    },
    width      : 640,
    height     : 480,
    border     : false,
    bodyPadding: 8,
    modal      : true,
    minimizable: false,
    autoScroll : true,

    initComponent: function() {
    	var me           = this,
            instructions = 'Please Note: Once an invoice is voided, it cannot be re-activated.';

        me.title = NP.Translator.translate('Void Invoice');

        me.tbar = [
            { itemId: 'invoiceVoidCancelBtn', xtype: 'shared.button.cancel' },
            { itemId: 'invoiceVoidSaveBtn', xtype: 'shared.button.save' }
        ];

        me.items = [
            {
                xtype: 'component',
                html : '<b>' + NP.Translator.translate(instructions) + '</b>',
                margin: '0 0 8 0',
            },{
                xtype     : 'textarea',
                name      : 'note',
                fieldLabel: NP.Translator.translate('Void Note'),
                labelAlign: 'top',
                flex      : 1,
                allowBlank: false,
                maxLength : 2000
            }
        ];

    	me.callParent(arguments);
    }
});