/**
 * The invoice payment window
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.PaymentWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.invoice.paymentwindow',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Translator',
        'NP.lib.core.Util',
    	'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Save',
        'NP.view.shared.button.New',
        'Ext.grid.plugin.CellEditing',
        'NP.store.invoice.InvoicePayments',
        'NP.store.invoice.InvoicePaymentTypes'
    ],

    layout     : {
        type : 'vbox',
        align: 'stretch'
    },
    width      : 800,
    height     : 400,
    border     : false,
    modal      : true,
    minimizable: false,
    autoScroll : true,

    // These need to be passed into the window
    invoice_status: null,
    invoice_ref   : null,
    invoice_amount: null,

    // This is a private variable used to track error messages
    errorMsg   : null,

    initComponent: function() {
    	var me       = this,
            question = 'Do you want to mark the invoice as paid or do you ' +
                        'want to maintain its current status?',
            note     = 'NOTE: If invoices normally automatically transfer to ' +
                        'your GL system and the invoice is manually marked as ' +
                        'Paid, this invoice WILL NOT be included in the invoice ' + 
                        'transfer and will not be inserted into your GL system.';

        me.title = NP.Translator.translate('Pay Invoice');

        me.tbar = [
            { xtype: 'shared.button.cancel', handler: function() { me.close(); } },
            { itemId: 'applyPaymentSaveBtn', xtype: 'shared.button.save' }
        ];

        me.paymentTypeStore = Ext.create('NP.store.invoice.InvoicePaymentTypes', {
            service    : 'PicklistService',
            action     : 'getConfiguredList',
            extraParams: {
                picklist_table_display: 'Pay By'
            },
            autoLoad   : true
        });

        me.items = [
            {
                xtype   : 'container',
                layout  : 'hbox',
                defaults: { labelWidth: 65, margin: '0 8 0 8' },
                items   : [
                    {
                        xtype     : 'displayfield',
                        fieldLabel: NP.Translator.translate('Invoice #'),
                        value     : me.invoice_ref
                    },{
                        xtype     : 'displayfield',
                        fieldLabel: NP.Translator.translate('Amount'),
                        value     : NP.Util.currencyRenderer(me.invoice_amount)
                    }
                ]
            }
        ];

        // Only add the radio buttons and instructions if invoice is not paid
        if (me.invoice_status !== 'paid') {
            me.items.push(
                {
                    xtype : 'component',
                    margin: 8,
                    html  : NP.Translator.translate(question)
                },{
                    xtype : 'radiogroup',
                    itemId: 'mark_as_paid',
                    layout: 'hbox',
                    defaults: { margin: '0 8 0 8' },
                    items : [
                        {
                            boxLabel  : NP.Translator.translate('Mark as Paid'),
                            name      : 'mark_as_paid',
                            inputValue: 1,
                            checked   : true
                        },{
                            boxLabel  : NP.Translator.translate('Maintain Status'),
                            name      : 'mark_as_paid',
                            inputValue: 0
                        }
                    ]
                },{
                    xtype: 'component',
                    margin: 8,
                    html : NP.Translator.translate(note)
                }
            );
        }

        // Add the payment grid
        me.items.push({
            xtype          : 'customgrid',
            plugins        : [Ext.create('Ext.grid.plugin.CellEditing', { clicksToEdit: 1 })],
            sortableColumns: false,
            viewConfig     : { markDirty: false },
            store          : { type: 'invoice.invoicepayments' },
            tbar           : [
                { xtype: 'shared.button.new', text: NP.Translator.translate('Add Payment') }
            ],
            columns        : [
                {
                    text     : 'Date',
                    itemId   : 'paymentDateCol',
                    dataIndex: 'invoicepayment_datetm',
                    xtype    : 'datecolumn',
                    width    : 95,
                    editor   : {
                        xtype     : 'datefield',
                        allowBlank: false
                    }
                },
                {
                    text     : 'Paid By',
                    itemId   : 'paidByCol',
                    dataIndex: 'invoicepayment_type_id',
                    flex     : 1,
                    renderer : function(val, meta, rec) {
                        if (me.paymentTypeStore.isLoaded && val !== null) {
                            return me.paymentTypeStore.getById(val).get('invoicepayment_type');
                        } else {
                            me.paymentTypeStore.on('load', function() {
                                rec.set('invoicepaymenttype_id', val);
                            }, this, { single: true })
                        }

                        return '';
                    },
                    editor   : {
                        xtype            : 'customcombo',
                        allowBlank       : false,
                        displayField     : 'invoicepayment_type',
                        valueField       : 'invoicepayment_type_id',
                        selectFirstRecord: true,
                        store            : me.paymentTypeStore
                    }
                },
                {
                    text     : 'Reference #',
                    dataIndex: 'invoicepayment_checknum',
                    flex     : 1,
                    editor   : {
                        xtype    : 'textfield',
                        maxLength: 50
                    }
                },
                {
                    text     : 'Cleared Date',
                    itemId   : 'paymentClearedDateCol',
                    dataIndex: 'invoicepayment_checkcleared_datetm',
                    xtype    : 'datecolumn',
                    width    : 95,
                    editor   : {
                        xtype     : 'datefield',
                        allowBlank: false
                    }
                },
                {
                    xtype    : 'numbercolumn',
                    text     : 'Payment Amount',
                    itemId   : 'paymentAmountCol',
                    dataIndex: 'invoicepayment_amount',
                    renderer : NP.Util.currencyRenderer,
                    width    : 110,
                    editor   : {
                        xtype           : 'numberfield',
                        decimalPrecision: 2,
                        allowBlank      : false
                    }
                },
                {
                    xtype    : 'numbercolumn',
                    text     : 'Applied Amount',
                    itemId   : 'appliedAmountCol',
                    dataIndex: 'invoicepayment_applied_amount',
                    renderer : NP.Util.currencyRenderer,
                    width    : 110,
                    editor   : {
                        xtype           : 'numberfield',
                        decimalPrecision: 2,
                        allowBlank      : false
                    }
                }
            ],
            flex : 1
        });

    	me.callParent(arguments);
    },

    isValid: function() {
        var me       = this,
            grid     = me.down('customgrid'),
            recs     = grid.getStore().getRange(),
            cols     = ['paymentDateCol','paidByCol','paymentClearedDateCol','paymentAmountCol','appliedAmountCol'],
            fields   = ['invoicepayment_datetm','invoicepayment_type_id','invoicepayment_checkcleared_datetm',
                        'invoicepayment_amount','invoicepayment_applied_amount'],
            isValid  = true;

        me.errorMsg = null;
        // Check if there's at least one payment
        if (recs.length) {
            // Loop through payment lines to validate
            Ext.Array.each(recs, function(rec, row) {
                Ext.Array.each(cols, function(col, colIdx) {
                    var field = fields[colIdx],
                        cell  = grid.getView().getCell(rec, Ext.ComponentQuery.query('#'+col)[0]);

                    cell = Ext.create('Ext.dom.Element', cell);
                    if (rec.get(field) === null) {
                        cell.addCls('grid-invalid-cell');
                        if (isValid) {
                            me.errorMsg = 'There was an error with one or more payments you entered.';
                        }
                        isValid = false;
                    } else {
                        cell.removeCls('grid-invalid-cell');
                    }
                })
            });
        } else {
            isValid = false;
            me.errorMsg = 'You must enter at least one payment';
        }

        return isValid;
    },

    getErrorMsg: function() {
        return this.errorMsg;
    }
});