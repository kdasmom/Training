Ext.define('NP.view.invoice.View', {
    extend: 'NP.lib.ui.BoundForm',
    alias: 'widget.invoice.view',
    
    //title: 'Invoice',
    border: 0,
    defaults: {
        layout: 'form'
    },
 
    locale: {
        createdOn: 'Created On',
        createdBy: 'Created By',
        remitAdvice: 'Remittance Advice',
        priority: 'Priority',
        neededBy: 'Needed By',
        payBy: 'Pay By',
        invoiceNum: 'Invoice Number',
        invoiceTotal: 'Invoice Total',
        invoiceDate: 'Invoice Date',
        invoiceDueDate: 'Due Date',
        invoicePeriod: 'Invoice ' + NP.Config.getSetting('PN.General.postPeriodTerm', 'Post Period'),
        associatedPO: 'Associated POs',
        vendorCode: 'Vendor Code',
        cycleFrom: 'Cycle From',
        cycleTo: 'Cycle To'
    },

    requires: [
        'NP.view.shared.VendorAutoComplete',
        'NP.view.shared.PropertyCombo',
        'NP.store.property.Properties',
        'NP.store.vendor.Vendors',

        'NP.view.shared.CustomFieldContainer',

    	'NP.view.shared.invoicepo.ViewLines',
    	'NP.view.shared.invoicepo.ViewLineGrid',
    	'NP.store.invoice.InvoiceItems',

    	'NP.view.shared.invoicepo.ForwardsGrid',
        'NP.view.shared.invoicepo.HistoryLogGrid'
    ],
    
    initComponent: function() {
        var items = [];
        items = items.concat(
            this.markupBase(),
            this.markupCustomFields(),
            this.markupLineItems(),
            this.markupNotes(),
            this.markupHistoryLog(),
            this.markupInvoiceForwards()
        );
        this.items = items;

        this.tbar = [
            {xtype:'button', text: 'Cancel'},
            {xtype:'button', text: 'Delete'},
            {xtype:'button', text: 'Update'},
            {xtype:'button', text: 'Bulk Entry'},
            {xtype:'button', text: 'Upload Items'},
            {xtype:'button', text: 'Use Template'},
            {xtype:'button', text: 'Forward'},
            {xtype:'button', text: 'Change Property'},
            {xtype:'button', text: 'Budget Report'},

            {xtype:'button', text: 'Update and Next'},
            {xtype:'button', text: 'Return to Image Management'},
            {xtype:'button', text: 'Place on Hold'},
            {xtype:'button', text: 'Void'},

            {xtype:'button', text: 'Split Screen'},
            {xtype:'button', text: 'Upload'},
            {xtype:'button', text: 'Add Image'},
            {xtype:'button', text: 'View Image'},
            {xtype:'button', text: 'Manage Images'}
        ];
        //this.getDockedItems()

        this.callParent(arguments);
    },

    /***************************************************************************
     * Section: Base
     **************************************************************************/
    markupBase: function() {
        return [
            {
                xtype: 'panel',
                title: 'Invoice:' + 'In Progress',
                align: 'stretch',
                layout: 'hbox',

                items: [
                    {
                        xtype: 'container',
                        flex: 1,
                        items: this.markupBaseColumn1()
                    },
                    {
                        xtype: 'container',
                        flex: 1,
                        items: this.markupBaseColumn2()
                    },
                    {
                        xtype: 'container',
                        flex: 1,
                        items: this.markupBaseColumn3()
                    }
                ]
            }
        ]
    },

    markupBaseColumn1: function() {
        var storeVendorNames =
            Ext.create('NP.store.vendor.Vendors', {
                service    : 'ImageService',
                action     : 'listVendor',
                extraParams: {
                    'userprofile_id': NP.Security.getUser().get('userprofile_id'),
                    'delegation_to_userprofile_id': NP.Security.getUser().get('delegation_to_userprofile_id')
                }
            }
        );
        storeVendorNames.load();

        var items = [
            {
                id: 'field-vendor',
                
                xtype: 'customcombo',
                fieldLabel: 'Vendor:',
                addBlankRecord: true,

                //name: 'invoiceimage_vendorsite_id',

                displayField: 'vendor_name',
                valueField:   'vendorsite_id',

                store: storeVendorNames
            }
        ];

        return items;
    },

    markupBaseColumn2: function() {
    	var self = this;

        var items = [
            {
                xtype     : 'textfield',
                fieldLabel: self.locale.invoiceNum,

                name      : 'invoice_ref',
                allowBlank: false
            },
            {
                xtype     : 'datefield',
                fieldLabel: self.locale.invoiceDate,

                name      : 'invoice_datetm',
                allowBlank: false
            },
            {
                xtype     : 'datefield',
                fieldLabel: self.locale.invoiceDueDate,

                name      : 'invoice_duedate',
                allowBlank: (NP.Config.getSetting('PN.InvoiceOptions.DueOnRequired', '0') == '1') ? false : true
            },
            {
                xtype     : 'displayfield',
		fieldLabel: self.locale.createdOn,

		name      : 'invoice_createddatetm',

		//renderer  : function() {
                    //var invoice = self.up('boundform').getModel('invoice.Invoice');
                    //return Ext.Date.format(invoice.get('invoice_createddatetm'), NP.Config.getDefaultDateFormat());
		//}
            },
            {
                xtype     : 'displayfield',
                fieldLabel: self.locale.createdBy,

                name      : 'userprofile_username'
            }
        ];

        if (NP.Config.getSetting('CP.INVOICE_PAY_BY_FIELD', '0') == '1') {
            items.push(
                {
                    xtype       : 'customcombo',
                    fieldLabel  : self.locale.payBy,

                    name        : 'invoicepayment_type_id',

                    displayField: 'invoicepayment_type',
                    valueField  : 'invoicepayment_type_id',

                    allowBlank  : false,
                    store       : {
                        type       : 'invoice.invoicepaymenttypes',
                        service    : 'PicklistService',
                        action     : 'getList',
                        autoLoad   : true,
                        extraParams: {
                            entityType: 'invoicePaymentType'
                        }
                    }
                }
            );
        }

        return items;
    },

    markupBaseColumn3: function() {
        var self = this;
        var items = [
            {
                xtype           : 'numberfield',
                fieldLabel      : self.locale.invoiceTotal,

                name            : 'control_amount',
                decimalPrecision: 2,
                allowBlank      : (NP.Config.getSetting('PN.InvoiceOptions.InvoiceTotalRequired', '0') == '1') ? false : true
            },
            {
                xtype       : 'customcombo',
                fieldLabel  : self.locale.invoicePeriod,
                name        : 'invoice_period',
                displayField: 'accounting_period_display',
                valueField  : 'accounting_period',
                allowBlank  : false,
                store       : Ext.create('Ext.data.Store', {
                    fields: [
                        { name: 'accounting_period_display' },
			{ name: 'accounting_period' }
                    ]
                })
            },
            {
                xtype         : 'checkbox',
                fieldLabel    : self.locale.remitAdvice,

		name          : 'remit_advice',

		inputValue    : 1,
		uncheckedValue: 0
            }
        ];

        if (NP.Security.hasPermission(6007)) {
            items.push(
                {
                    xtype       : 'customcombo',
                    fieldLabel  : self.locale.priority,

                    name        : 'PriorityFlag_ID_Alt',

                    displayField: 'PriorityFlag_Display',
                    valueField  : 'PriorityFlag_ID_Alt',
                    //store       : { type: 'system.priorityflags' }
                },
                {
                    xtype     : 'datefield',
                    fieldLabel: self.locale.neededBy,

                    name      : 'invoice_NeededBy_datetm'
                }
            );
        }

        if (NP.Security.hasPermission(1026)) {
            items.push(
                {
                    xtype: 'displayfield',
                    fieldLabel: self.locale.associatedPO,

                    name: 'associated_pos',
                    renderer: function(val, field) {
                        if (val.join) {
                            return val.join(',');
                        }
                        return '<i>None</i>';
                    }
                }
            );
        }

        if (NP.Config.getSetting('PN.InvoiceOptions.AllowVendorCode', '0') == '1') {
            items.push(
                {
                    xtype: 'textfield',
                    fieldLabel: self.locale.vendorCode,

                    name: 'vendor_code'
                }
            );
        }

        items.push(
            {
                xtype     : 'datefield',
                fieldLabel: self.locale.cycleFrom,

                name      : 'invoice_cycle_from',
                hidden    : true
            },
            {
                xtype     : 'datefield',
                fieldLabel: self.locale.cycleToLbl,

                name      : 'invoice_cycle_to',
		hidden    : true
            }
        );

        return items;
    },

    /***************************************************************************
     * Section: Custom Fields
     **************************************************************************/
    markupCustomFields: function() {
        return [
            {
                xtype: 'shared.customfieldcontainer',
                title: 'Custom Fields',
                type: 'invoice',
                isLineItem: 0
            }
        ];
    },

    /***************************************************************************
     * Section: Line Items
     **************************************************************************/
    markupLineItems: function() {
        //var type = null; // Needs to be set to 'invoice' or 'po'
        var type = 'invoice';
        var capitalizedType = Ext.util.Format.capitalize(type);

    	var self = this;

    	var storeCfg = Ext.create('NP.store.' + type + '.' + capitalizedType + 'Items', {
            service  : capitalizedType + 'Service',
            action   : 'get' + capitalizedType + 'Lines',
            listeners: {
                datachanged: function(store) {
                    var form = self.up('boundform');

                    // Enable the vendor and property fields if there are no line items
                    if (store.getCount() === 0) {
                        form.findField('vendor_id').enable();
                        form.findField('property_id').enable();
                    // Otherwise, if not lines, disable them
                    } else {
                        form.findField('vendor_id').disable();
                        form.findField('property_id').disable();
                    }
                }
            }
    	});

        return [
            {
                xtype: 'panel',
                title: 'Line Items',
                //align: 'stretch',
                border: false,
                layout: 'card',

                defaults: {
                    type: type,
                    store: storeCfg
                },

                items: [
                    {
                        xtype: 'shared.invoicepo.viewlines'
                    },
                    {
                        xtype: 'shared.invoicepo.viewlinegrid'
                    }
                ]
            }
        ];

    },

    /***************************************************************************
     * Section: Notes
     **************************************************************************/
    markupNotes: function() {
        var items = [
            {
                xtype     : 'textarea',
                fieldLabel: this.noteFieldLbl,

                name      : 'invoice_note'
            },
            {
                xtype     : 'displayfield',
                fieldLabel: this.rejectNoteFieldLbl,

                name      : 'invoice_reject_note',
                hidden    : true,
                listeners: {
                    change: this.onNoteFieldChange
                }
            },
            {
                xtype     : 'displayfield',
                fieldLabel: this.rejectReasonFieldLbl,

                name      : 'invoice_reject_reason',
                hidden    : true,
                listeners: {
                    change: this.onNoteFieldChange
                }
            }
        ];

        if (NP.Config.getSetting('PN.InvoiceOptions.BudgetOverNotesOn') == '1') {
            items.push(
                {
                    xtype     : 'textarea',
                    fieldLabel: this.budgetNoteFieldLbl,

                    name      : 'invoice_budgetoverage_note'
    		}
            );
    	}

    	if (NP.Config.getSetting('PN.InvoiceOptions.HoldOn') == '1') {
            items.push(
                {
                    xtype     : 'displayfield',
                    fieldLabel: this.holdNoteFieldLbl,

                    name      : 'invoice_hold_note',
                    hidden    : true,
                    listeners: {
                        change: this.onNoteFieldChange
                    }
                }
            );
    	}

        items.push(
            {
                xtype     : 'displayfield',
                fieldLabel: this.vcNoteFieldLbl,

                name      : 'vendoraccess_notes',
                hidden    : true,
                listeners: {
                    change: this.onNoteFieldChange
                }
            }
        );

        return [
            {
                xtype: 'panel',
                title: 'Notes',
                //align: 'stretch',
                //layout: 'hbox',
                items: items
            }
        ];
    },

    onNoteFieldChange: function(field, newVal) {
        if (newVal === null || newVal == '') {
            field.hide();
        } else {
            field.show();
        }
    },

    /***************************************************************************
     * Section: History Log
     **************************************************************************/
    markupHistoryLog: function() {
        return [
            {
                xtype: 'shared.invoicepo.historyloggrid',
                type: 'invoice',
                maxHeight: 400
            }
        ];
    },

    /***************************************************************************
     * Section: Invoice Forwards
     **************************************************************************/
    markupInvoiceForwards: function() {
        return [
            {
                xtype: 'shared.invoicepo.forwardsgrid',
                title: 'Invoice Forwards',
                type: 'invoice',
                maxHeight: 400
            }
        ];
    }
});