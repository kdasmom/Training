Ext.define('NP.view.images.Index', {
    extend: 'NP.lib.ui.BoundForm',
    alias:  'widget.images.index',

    title:  'Index Images',

    ids: {
        buttonReturn: 'buttonReturn',

        buttonNext: 'buttonNext',
        buttonPrev: 'buttonPrev',

        buttonSaveAndNext:     'buttonSaveAndNext',
        buttonSaveAndPrev:     'buttonSaveAndPrev',
        buttonSaveAsException: 'buttonSaveAsException',

        buttonDelete: 'buttonDelete',
        buttonInvoice: 'buttonInvoice'
    },
    locale: {
        buttonReturn: 'Return to Image Management',

        buttonNext: 'Next',
        buttonPrev: 'Previous',

        buttonSaveAndNext:     'Save and Next',
        buttonSaveAndPrev:     'Save and Previous',
        buttonSaveAsException: 'Save as Exception',

        buttonDelete: 'Delete',
        buttonInvoice: 'Create Invoice'
    },

    initComponent: function() {
        var widthLabel = 130;
        var widthField = "50%";

        var fields = [
            //Document type
            {
                name: 'Image_Doctype_Id',
                xtype: 'combobox',
                fieldLabel: 'Document Type:',

                displayField: 'image_doctype_name',
                valueField:   'image_doctype_id',

                queryMode: 'local',
                store: Ext.create('NP.store.images.ImageDocTypes',{
                    service    : 'ImageService',
                    action     : 'listDocTypes'
                }),
                listeners: {
                    select: this.onDocumentTypeChange
                }
            },
            //Image name
            {
                name: 'Image_Index_Name',
                xtype: 'textfield',
                fieldLabel: 'Image Name:'
            },
            //Integration Package
            {
                id: 'field-integration-package',
                xtype: 'combobox',
                labelWidth: widthLabel,
                fieldLabel: 'Integration Package:',

                displayField: 'integration_package_name',
                valueField:   'integration_package_id',

                queryMode: 'local',
                store: Ext.create('NP.store.images.IntegrationPackages', {
                    service    : 'ImageService',
                    action     : 'listIntegrationPackages'
                })
            },
            //Account Number
            {
                id: 'field-account-number',
                name: 'utilityaccount_accountnumber',
                xtype: 'textfield',
                fieldLabel: 'Account Number:'
            },
            //Property code
            {
                id: 'field-property-code',
                //name: '' $request['property_alt_id'] = $_REQUEST['field-property-code-inputEl'];
                xtype: 'combobox',
                fieldLabel: 'Property Code:',

                displayField: 'title',
                valueField:   'value',

                store: {
                    fields: ['title', 'value'],
                    data : [
                        {"title":"000", "value":"Invoice"},
                        {"title":"001", "value":"Yardi"},
                    ]                            
                }
            },
            //Meter Number
            {
                id: 'field-meter-number',
                name: 'utilityaccount_metersize',
                xtype: 'textfield',
                fieldLabel: 'Meter Number:'
            },
            //Vendor code
            {
                id: 'field-vendor-code',
                //name            $request['invoiceimage_vendorsite_alt_id'] = $_REQUEST['field-vendor-code-inputEl'];
                xtype: 'combobox',
                fieldLabel: 'Vendor Code:',

                displayField: 'title',
                valueField:   'value',

                store: {
                    fields: ['title', 'value'],
                    data : [
                        {"title":"32135", "value":"Invoice"},
                        {"title":"65456", "value":"Yardi"},
                    ]                            
                }
            },
            // Property
            {
                id: 'field-property',
                name: 'Property_Id',
                xtype: 'combobox',
                fieldLabel: 'Property:',

                displayField: 'title',
                valueField:   'value',

                store: {
                    fields: ['title', 'value'],
                    data : [
                        {"title":"32135", "value":"Invoice"},
                        {"title":"65456", "value":"Yardi"},
                    ]                            
                }
            },
            // Vendor
            {
                id: 'field-vendor',
                //name: $request['invoiceimage_vendorsite_id'] = $_REQUEST['field-vendor-inputEl'];
                xtype: 'combobox',
                fieldLabel: 'Vendor:',

                displayField: 'title',
                valueField:   'value',

                store: {
                    fields: ['title', 'value'],
                    data : [
                        {"title":"32135", "value":"Invoice"},
                        {"title":"65456", "value":"Yardi"},
                    ]                            
                }
            },
            // Invoice number
            {
                id: 'field-invoice-number',
                //name $request['invoiceimage_ref']
                xtype: 'textfield',
                value: '97560',
                fieldLabel: 'Invoice Number:'
            },
            // Invoice date
            {
                id: 'field-invoice-date',
                //name             $request['invoiceimage_invoice_date'] = $_REQUEST['field-invoice-date-inputEl'];
                xtype: 'datefield',
                fieldLabel: 'Invoice Date:',
                maxValue: new Date()
            },
            // Invoice due date
            {
                id: 'field-due-date',
                //name $request['invoiceimage_invoice_duedate'] = $_REQUEST['field-due-date-inputEl'];
                xtype: 'datefield',
                labelWidth: widthLabel,
                fieldLabel: 'Invoice Due Date:'
            },
            // P0 number
            {
                id: 'field-p0-number',
                xtype: 'textfield',
                fieldLabel: 'P0 number:'
            },
            // Amount
            {
                id: 'field-amount',
                name: 'Image_Index_Amount',
                xtype: 'textfield',
                fieldLabel: 'Amount:'
            },
            // Cycle From Date
            {
                id: 'field-cycle-from-date',
                name: 'cycle_from',
                xtype: 'datefield',
                labelWidth: widthLabel,
                fieldLabel: 'Cycle From Date:'
            },
            // Cycle To Date
            {
                id: 'field-cycle-to-date',
                name: 'cycle_to',
                xtype: 'datefield',
                labelWidth: widthLabel,
                fieldLabel: 'Cycle To Date:'
            },
            // Remittance Advice
            {
                id: 'field-remittance-advice',
                name: 'remit_advice',
                xtype: 'checkbox',
                labelWidth: widthLabel,
                fieldLabel: 'Remittance Advice:'
            },
            // Needed By
            {
                id: 'field-needed-by',
                name: 'image_index_NeededBy_datetm',
                xtype: 'datefield',
                fieldLabel: 'Needed By:'
            },
            // Priority
            {
                id: 'field-priority-invoice',
                xtype: 'combobox',
                fieldLabel: 'Priority:',

                displayField: 'title',
                valueField:   'value',

                store: {
                    fields: ['title', 'value'],
                    data : [
                        {"title":"High", "value":"Invoice"},
                        {"title":"Low", "value":"Yardi"},
                    ]                            
                }
            },
            // Exception Reason
            {
                id: 'field-exception-reason',
                name: 'Image_Index_Exception_reason',
                xtype: 'textarea',
                labelWidth: widthLabel,
                fieldLabel: 'Exception Reason:'
            },
        ]

/*
        var form  = [
            // Link Show Property Address
            {
                xtype: 'button',
                text: 'Property Address',
                href: 'http://google.com'
            },
            // Link Show Vendor Address
            {
                xtype: 'button',
                text: 'Vendor Address',
                href: 'http://google.com'
            },
            // Link for Use Template
            {
                xtype: 'button',
                text: 'Use Template',
                href: 'http://google.com'
            },
        ];*/
        var form = fields;

        this.id = 'panel-index';
        this.layout = 'border';

        this.items = [
            {
                xtype: 'panel',
                width: 620,
                border: 0,
                region: 'west',
                bodyPadding: 10,
                items: [
                    {
                        id: 'iframe-panel',
                        xtype: 'component',
                        border: 0,
                        width: 598,
                        height: 600,
                        autoEl: {
                            tag : "iframe",
                            src : ""
                        }
                    }
                ]
            },
            {
                id: 'index-form',
                xtype: 'panel', 
                //itemId: 'tExperiment'
                border: 0,
                layout: 'form',
                region: 'center',
                bodyPadding: 10,
                overflowY: 'scroll',
                items: form
            }
        ];
        this.tbar = [
            {xtype: 'button', itemId: this.ids.buttonReturn,  text: this.locale.buttonReturn},

            {xtype: 'tbspacer', width: 20},

            {xtype: 'button', itemId: this.ids.buttonPrev,  text: this.locale.buttonPrev},
            {xtype: 'button', itemId: this.ids.buttonNext,  text: this.locale.buttonNext},

            {xtype: 'tbspacer', width: 20},

            {xtype: 'button', itemId: this.ids.buttonSaveAndPrev,      text: this.locale.buttonSaveAndPrev},
            {xtype: 'button', itemId: this.ids.buttonSaveAsException,  text: this.locale.buttonSaveAsException},
            {xtype: 'button', itemId: this.ids.buttonSaveAndNext,      text: this.locale.buttonSaveAndNext},

            {xtype: 'tbspacer', width: 20},

            {xtype: 'button', itemId: this.ids.buttonDelete,  text: this.locale.buttonDelete},
            {xtype: 'button', itemId: this.ids.buttonInvoice, text: this.locale.buttonInvoice},
        ];
        this.callParent(arguments);

        this.onDocumentTypeChange();
    },

    onDocumentTypeChange: function(combo, records) {
        var visibility = {
            'Invoice': {
                'field-integration-package': true,
                'field-account-number': false,
                'field-property-code': true,
                'field-meter-number': false,
                'field-vendor-code': true,
                'field-property': true,
                'field-vendor': true,
                'field-invoice-number': true,
                'field-invoice-date': true,
                'field-due-date': true,
                'field-p0-number': false,
                'field-cycle-from-date': false,
                'field-cycle-to-date': false,
                'field-remittance-advice': true,
                'field-needed-by': true,
                'field-priority-invoice': true
            },
            'Utility Invoice': {
                'field-integration-package': false,
                'field-account-number': true,
                'field-property-code': false,
                'field-meter-number': true,
                'field-vendor-code': false,
                'field-property': false,
                'field-vendor': false,
                'field-invoice-number': true,
                'field-invoice-date': true,
                'field-due-date': true,
                'field-p0-number': false,
                'field-cycle-from-date': true,
                'field-cycle-to-date': true,
                'field-remittance-advice': true,
                'field-needed-by': false,
                'field-priority-invoice': false
            },
            'Purchase Order': {
                'field-integration-package': true,
                'field-account-number': false,
                'field-property-code': true,
                'field-meter-number': false,
                'field-vendor-code': true,
                'field-property': true,
                'field-vendor': true,
                'field-invoice-number': false,
                'field-invoice-date': false,
                'field-due-date': false,
                'field-p0-number': true,
                'field-cycle-from-date': false,
                'field-cycle-to-date': false,
                'field-remittance-advice': false,
                'field-needed-by': false,
                'field-priority-invoice': false
            },
            'Receipt': {
                'field-integration-package': true,
                'field-account-number': false,
                'field-property-code': true,
                'field-meter-number': false,
                'field-vendor-code': true,
                'field-property': true,
                'field-vendor': true,
                'field-invoice-number': false,
                'field-invoice-date': false,
                'field-due-date': false,
                'field-p0-number': false,
                'field-cycle-from-date': false,
                'field-cycle-to-date': false,
                'field-remittance-advice': false,
                'field-needed-by': false,
                'field-priority-invoice': false
            }
        };

        if (combo && records) {
            var title = records[0]['data'][combo['displayField']];
        } else {
            title = 'Invoice';
        }

        for (var key in visibility[title]) {
            var field = Ext.ComponentQuery.query('[id~="' + key + '"]')[0];
            visibility[title][key] ? field.show() : field.hide();
        }
    }
});