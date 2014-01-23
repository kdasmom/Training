/**
 * The invoice/PO reject window
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.RejectWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.shared.invoicepo.rejectwindow',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Translator',
        'NP.lib.ui.ComboBox',
    	'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Save',
        'Ext.form.Panel',
        'NP.store.shared.RejectionNotes'
    ],

    layout     : 'fit',
    width      : 640,
    height     : 480,
    border     : false,
    modal      : true,
    minimizable: false,
    autoScroll : true,

    // Type can be set to invoice or po
    type: null,

    initComponent: function() {
    	var me = this;

        if (!Ext.Array.contains(['invoice','po'], me.type)) {
            throw 'The "type" config is required and must be set to either "invoice" or "po"';
        }

        me.title = NP.Translator.translate('Reject');

        me.tbar = [
            { xtype: 'shared.button.cancel', handler: function() { me.close(); } },
            { itemId: me.type + 'RejectSaveBtn', xtype: 'shared.button.save' }
        ];

        me.items = [{
            xtype      : 'form',
            bodyPadding: 8,
            layout     : {
                type : 'vbox',
                align: 'stretch'
            },
            items      : [
                {
                    xtype       : 'customcombo',
                    fieldLabel  : NP.Translator.translate('Reason'),
                    labelAlign  : 'top',
                    name        : 'rejectionnote_id',
                    displayField: 'rejectionnote_text',
                    valueField  : 'rejectionnote_id',
                    store       : {
                        type       : 'shared.rejectionnotes',
                        service    : 'PicklistService',
                        action     : 'getRejectionReasons',
                        autoLoad   : true
                    },
                    margin    : '0 0 8 0',
                    allowBlank: false
                },{
                    xtype     : 'textarea',
                    name      : 'invoice_reject_note',
                    fieldLabel: NP.Translator.translate('Rejection Note'),
                    labelAlign: 'top',
                    flex      : 1,
                    maxLength : 2000
                }
            ]
        }];

    	me.callParent(arguments);
    }
});