Ext.define('NP.view.image.Index', {
    extend: 'NP.lib.ui.BoundForm',
    alias:  'widget.image.index',

    title:  'Index Images',
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
        'NP.lib.core.Translator',
        'NP.store.invoice.Invoices',
        'NP.view.shared.PropertyCombo',
        'NP.view.shared.VendorAutoComplete',
        'NP.view.shared.CustomFieldContainer',
        'NP.view.shared.button.Reset',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Save',
        'NP.view.shared.button.Delete',
        'NP.view.shared.button.Previous',
        'NP.view.shared.button.Next',
        'NP.view.shared.button.SaveAndNext',
        'NP.view.shared.button.SaveAndPrevious',
        'NP.store.system.PriorityFlags',
        'NP.view.invoice.UseTemplateWindow'
    ],

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
        this.layout = 'border';

        this.labelWidth  = 150;
        this.buttonWidth = 125;

        this.locale.utilityAccountText = 
            NP.Security.hasPermission(6095) ?
                'Enter a valid account number and/or meter number' :
                'Select a utility account'
        ;

        // Prepare stores for comboboxes.
        this['postload-store'] = {
            'vendor-names': Ext.create('NP.store.vendor.Vendors', {
                service    : 'VendorService',
                action     : 'getByIntegrationPackage',
                extraParams: Ext.apply(this.getStoreParams(), {
                                vendor_status : 'active'
                            })
            }),
            'property-names': Ext.create('NP.store.property.Properties', {
                service : 'PropertyService',
                action  : 'getByIntegrationPackage',
                extraParams: this.getStoreParams()
            })
        };

        // Prepare markup.
        var fields = [];
        fields = fields.concat(
            this.markupBase(
                this['preload-store'].doctype, 
                this['preload-store'].integrationPackage
            ), 
            this.markupUtility(),
            this.markupPropertyName(),
            this.markupVendorName(),
            this.markupInvoiceNumber(),
            this.markupP0Number(),
            this.markupInvoiceDates(),
            this.markupAmount(),
            this.markupUtility2(),
            this.markupTemplate(),
            this.markupRemitAdvice(),
            this.markupPriorityAndNeededByPanel(),
            this.markupUniversalFields(),
            this.markupExceptionReason()
        );

        this.items = [
            {
                xtype: 'panel',
                width: 620,
                border: 0,
                region: 'west',
                bodyPadding: 10,
                layout: 'fit',
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
                xtype      : 'panel', 
                border     : 0,
                layout     : 'form',
                region     : 'center',
                bodyPadding: 8,
                autoScroll : true,
                defaults   : { labelWidth: this.labelWidth },
                items      : fields
            }
        ];

        // Prepare top toolbar elements.
        this.tbar = [
            {xtype: 'shared.button.reset', itemId: 'buttonReturn',  text: NP.Translator.translate(this.locale.buttonReturn)},
            {xtype: 'tbseparator'},
            {xtype: 'shared.button.previous', itemId: 'buttonPrev',  text: NP.Translator.translate(this.locale.buttonPrev)},
            {xtype: 'shared.button.next', itemId: 'buttonNext',  text: NP.Translator.translate(this.locale.buttonNext)},
            {xtype: 'tbseparator'},
            {xtype: 'shared.button.saveandprevious', itemId: 'buttonSaveAndPrev', text: NP.Translator.translate(this.locale.buttonSaveAndPrev), hidden: true},
            {xtype: 'shared.button.saveandnext', itemId: 'buttonSaveAndNext', text: NP.Translator.translate(this.locale.buttonSaveAndNext)},
            {xtype: 'shared.button.saveandnext', itemId: 'buttonIndexingComplete', text: NP.Translator.translate('Indexing Complete and Next'), hidden: true},
            {xtype: 'tbseparator', itemId: 'tbSep'},
            {xtype: 'shared.button.saveandnext', itemId: 'buttonSaveAsException',  text: NP.Translator.translate(this.locale.buttonSaveAsException), hidden: true},
            {xtype: 'shared.button.save', itemId: 'buttonInvoice', text: NP.Translator.translate(this.locale.buttonInvoice), hidden: true},
            {xtype: 'shared.button.delete', itemId: 'buttonDeleteFromQueue',  text: NP.Translator.translate(this.locale.buttonDelete), hidden: true}
        ];

        this.callParent(arguments);
        this.onDocumentTypeChange();
    },

    /***************************************************************************
     * Seciton: Base
     **************************************************************************/
    /**
     * Prepare markup for Basic section.
     * 
     * @param {} storeDoctypes Store for "Document Type" combobox.
     * @param {} storeIntegrationPackages Store for "Integration Package" combobox.
     */
    markupBase: function(storeDoctypes, storeIntegrationPackages) {
        var propertyStore = Ext.getStore('property.AllProperties'),
            context = NP.Security.getCurrentContext(),
            propertyRec,
            defaultIntPkg = null;

        // First, try to default the integration package to the one that matches the
        // property in the current context
        if (context.property_id) {
            propertyRec   = propertyStore.findRecord('property_id', context.property_id);
            if (propertyRec !== null) {
                defaultIntPkg = storeIntegrationPackages.getById(
                    propertyRec.get('integration_package_id')
                );
            }
        }

        // If we couldn't get a default, try to use a default integration package
        if (defaultIntPkg === null) {
            defaultIntPkg = storeIntegrationPackages.findRecord('universal_field_status', 2);
        }

        // Otherwise, just use the first record
        if (defaultIntPkg === null) {
            defaultIntPkg = storeIntegrationPackages.getAt(0)
        }

        return [
            // Field: Document type
            {
                name: 'Image_Doctype_Id',

                xtype: 'customcombo',
                fieldLabel: NP.Translator.translate('Document Type'),

                editable         : false,
                typeAhead        : false,
                forceSelection   : true,
                selectFirstRecord: true,
                allowBlank       : false,

                store: storeDoctypes,
                valueField:   'image_doctype_id',
                displayField: 'image_doctype_name',

                listeners: {
                    select: this.onDocumentTypeChange.bind(this)
                }
            },
            // Field: Image name
            {
                name: 'Image_Index_Name',

                xtype: 'textfield',
                fieldLabel: NP.Translator.translate('Image Name')
            },
            // Field: Integration Package
            {
                itemId: 'field-integration-package',

                xtype: 'customcombo',
                fieldLabel: NP.Translator.translate('Integration Package'),

                editable: false,
                typeAhead: false,

                store: storeIntegrationPackages,
                valueField:   'integration_package_id',
                displayField: 'integration_package_name',

                value: defaultIntPkg,

                listeners: {
                    select: this.onIntegrationPackageChange.bind(this)
                }
            }
        ]
    },

    /**
     * Show appropriate fields if Document Type is changed.
     * 
     * @param combo Document type combo box.
     * @param records Combobox data.
     */
    onDocumentTypeChange: function(combo, records) {
        var docType = 
            (combo && records) ?
                records[0].get('image_doctype_name'):
                'Invoice'
        ;
        docType = docType.replace(' ', '');

        this.hideAll();

        if (this['display' + docType]) {
            this['display' + docType]();
        } else {
            this.displayOtherDocTypes();
        }
    },

    /**
     * Reload property and vendor comboboxes data if integration package is changed.
     * 
     * @param combo Document type combo box.
     * @param records Combobox data.
     */
    onIntegrationPackageChange: function(combo, records) {
        var params = this.getStoreParams();
        var fields = [
            'field-property-name',
            'field-vendor-name'
        ]

        for (var i = 0, l = fields.length; i < l; i++) {
            var component = Ext.ComponentQuery.query('#' + fields[i])[0];
            component.setValue(null);
            component.getStore().addExtraParams(params);
        }
    },

    /**
     * Hide all hideable fields
     */
    hideAll: function() {
        var fields = [
            'field-integration-package',
            'panel-utility',
            'field-property-name',
            'field-vendor-name',
            'field-invoice-number',
            'field-p0-number',
            'field-invoice-date',
            'field-due-date',
            'panel-utility-2',
            'field-use-template',
            'field-remittance-advice',
            'field-needed-by-date',
            'field-priority-invoice',
            'image-index-amount',
            'invoice-custom-panel'
        ];

        Ext.suspendLayouts();

        for (var i=0; i<fields.length; i++) {
            Ext.ComponentQuery.query('#' + fields[i])[0].hide();
        }
        
        Ext.resumeLayouts(true);
    },

    /**
     * Show/hide form fields depending on passed configuration.
     * 
     * @param fields Key-value pairs where key is fields itemId and value is visibility flag.
     */
    display: function(fields) {
        Ext.suspendLayouts();

        for (var key in fields) {
            var field = Ext.ComponentQuery.query(
                '[itemId~="' + key + '"]'
            )[0];
            fields[key] ? field.show() : field.hide();
        }

        Ext.resumeLayouts(true);
    },

    /**
     * Display fields for Invoice document type.
     */
    displayInvoice: function() {
        var fields = {
            'field-integration-package': true,
            'field-property-name'      : true,
            'field-vendor-name'        : true,
            'field-invoice-number'     : true,
            'field-invoice-date'       : true,
            'field-due-date'           : true,
            'field-use-template'       : true,
            'field-remittance-advice'  : true,
            'field-needed-by-date'     : true,
            'field-priority-invoice'   : true,
            'image-index-amount'       : true,
            'invoice-custom-panel'     : true
        };

        this.display(fields);
    },

    /**
     * Display fields for Utility Invoice document type.
     */
    displayUtilityInvoice: function() {
        var fields = {
            'field-invoice-number'   : true,
            'field-invoice-date'     : true,
            'field-due-date'         : true,
            'panel-utility-2'        : true,
            'field-use-template'     : true,
            'field-remittance-advice': true,
            'panel-utility'          : true,
            'field-priority-invoice' : true,
            'image-index-amount'     : true,
            'invoice-custom-panel'   : true
        };
        this.display(fields);
    },

    /**
     * Display fields for Purchase Order document type.
     */
    displayPurchaseOrder: function() {
        var fields = {
            'field-integration-package': true,
            'field-property-name'      : true,
            'field-vendor-name'        : true,
            'field-p0-number'          : true,
            'image-index-amount'       : true
        };
        this.display(fields);
    },

    /**
     * Display fields for Receipt document type.
     */
    displayReceipt: function() {
        var fields = {
            'field-integration-package': true,
            'field-property-name'      : true,
            'field-vendor-name'        : true,
            'image-index-amount'       : true
        };
        this.display(fields);
    },

    /**
     * Display fields for any other document type
     */
    displayOtherDocTypes: function() {
        var fields = {
            'field-integration-package': true,
            'field-vendor-name'        : true
        };
        this.display(fields);
    },

    /***************************************************************************
     * Section: Utility
     **************************************************************************/
    /**
     * Prepare markup for Utility section.
     */
    markupUtility: function() {
        if (NP.Security.hasPermission(6094)) {
            if (NP.Security.hasPermission(6095)) {
                var options = {
                    xtype: 'panel',

                    border  : 0,
                    layout  : 'form',
                    defaults: { labelWidth: this.labelWidth },

                    items: [
                        // Field: Account Number
                        {
                            name: 'UtilityAccount_AccountNumber',

                            xtype: 'textfield',
                            fieldLabel: NP.Translator.translate('Account Number'),

                            listeners: {
                                change: this.checkUtilityAccountNumber.bind(this)
                            }
                        },
                        // Panel: Is Utility Account Valid
                        {
                            xtype : 'displayfield',
                            name  : 'accountNumberValid'
                        },
                        // Field: Meter Number
                        {
                            name: 'UtilityAccount_MeterSize',

                            xtype: 'textfield',
                            fieldLabel: NP.Translator.translate('Meter Number'),

                            listeners: {
                                change: this.checkMeterNumber.bind(this)
                            }
                        },
                        // Panel: Is Meter Number Valid
                        {
                            xtype: 'displayfield',
                            name: 'meterSizeValid'
                        }
                    ]
                }
            } else {
                var extraParams = {
                        userprofile_id              : NP.Security.getUser().get('userprofile_id'),
                        delegation_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id')
                    },
                    storeAccountNumber =
                        Ext.create('NP.store.vendor.UtilityAccounts', {
                            service    : 'UtilityService',
                            action     : 'getAccountNumbersByUser',
                            extraParams : extraParams
                        }
                    ),
                    storeMeterSize =
                        Ext.create('NP.store.vendor.UtilityAccounts', {
                            service    : 'UtilityService',
                            action     : 'getMeterSizesByAccount',
                            extraParams : extraParams
                        }
                    );

                var self = this;
                options = {
                    xtype: 'panel',

                    border  : 0,
                    layout  : 'form',
                    defaults: { labelWidth: this.labelWidth },

                    items: [
                        // Field: Account Number
                        {
                            name: 'UtilityAccount_AccountNumber',

                            xtype     : 'customcombo',
                            fieldLabel: NP.Translator.translate('Account Number'),

                            store                : storeAccountNumber,
                            displayField         : 'UtilityAccount_AccountNumber',
                            valueField           :   'UtilityAccount_AccountNumber',
                            loadStoreOnFirstQuery: true,

                            listeners: {
                                select: function(combo, records) {
                                    var metersizes     = self.findField('UtilityAccount_MeterSize'),
                                        utilityAccount = self.findField('utilityaccount_id'),
                                        accountNumber;

                                    if (records.length) {
                                        self.reloadUtilityAccounts();

                                        accountNumber = records[0].get('UtilityAccount_AccountNumber');

                                        metersizes.getStore().addExtraParams({
                                            UtilityAccount_AccountNumber: accountNumber
                                        }).load();
                                    } else {
                                        utilityAccount.getStore().removeAll();
                                        metersizes.getStore().removeAll();
                                    }
                                }
                            }
                        },
                        // Field: Meter Number
                        {
                            name: 'UtilityAccount_MeterSize',

                            xtype     : 'customcombo',
                            fieldLabel: NP.Translator.translate('Meter Number'),

                            store                : storeMeterSize,
                            displayField         : 'UtilityAccount_MeterSize',
                            valueField           : 'UtilityAccount_MeterSize',
                            loadStoreOnFirstQuery: true,

                            listeners: {
                                select: this.reloadUtilityAccounts.bind(this)
                            }
                        }
                    ]
                };
            };

            var items = [
                options,

                // Field: Utility Account Id Alt. This is also Utility Account Id. It should be displayed for multiple
                // accounts.
                {
                    name: 'utilityaccount_id',

                    xtype                : 'customcombo',
                    fieldLabel           : NP.Translator.translate('Utility Account'),
                    displayField         : 'long_display_name',
                    valueField           : 'UtilityAccount_Id',
                    allowBlank           : false,
                    store                : Ext.create('NP.store.vendor.UtilityAccounts', {
                        service    : 'UtilityService',
                        action     : 'getAccountsByUser',
                        extraParams: {
                            userprofile_id              : NP.Security.getUser().get('userprofile_id'),
                            delegation_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id')
                        }
                    })
                }
            ];
        }

        return [
            {
                itemId: 'panel-utility',

                xtype: 'panel',

                border  : 0,
                layout  : 'form',
                defaults: { labelWidth: this.labelWidth },
                items   : items
            }
        ];
    },

    /**
     * Check if Utility Account Number is correct.
     */
    checkUtilityAccountNumber: function() {
        var me                 = this,
            accountNumberField = me.findField('UtilityAccount_AccountNumber'),
            validField         = me.findField('accountNumberValid'),
            meterField         = me.findField('UtilityAccount_MeterSize'),
            accountField       = me.findField('utilityaccount_id');
        
        me.lastTypingAccount = Date.now();

        setTimeout(function() {
            if (Date.now() - me.lastTypingAccount >= 500) {
                me.accountNumber = accountNumberField.getValue();
                
                if (me.accountNumber.length) {
                    me.checkMeterNumber();

                    NP.lib.core.Net.remoteCall({
                        requests: {
                            service: 'UtilityService',
                            action : 'getAccountsByUser',
                            userprofile_id              : NP.Security.getUser().get('userprofile_id'),
                            delegation_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id'),
                            UtilityAccount_AccountNumber: me.accountNumber,
                            success: function(result) {
                                if (result.length) {
                                    validField.update('<span class="valid-text">Valid account number</span>');
                                    me.reloadUtilityAccounts();
                                } else {
                                    validField.update('<span class="error-text">Invalid account number</span>');
                                    accountField.getStore().removeAll();
                                    accountField.setValue(null);
                                }
                            }
                        }
                    });
                } else {
                    accountField.getStore().removeAll();
                    validField.update('');
                }
            }
        }, 500);
    },

    /**
     * Check if Meter Number is correct.
     */
    checkMeterNumber: function() {
        var me                 = this,
            meterField         = me.findField('UtilityAccount_MeterSize'),
            validField         = me.findField('meterSizeValid'),
            accountField       = me.findField('utilityaccount_id');
        
        me.lastTypingMeter = Date.now();

        setTimeout(function() {
            if (Date.now() - me.lastTypingMeter >= 500) {
                me.meterSize = meterField.getValue();

                if (me.meterSize.length) {
                    NP.lib.core.Net.remoteCall({
                        requests: {
                            service                     : 'UtilityService',
                            action                      : 'getAccountsByUser',
                            userprofile_id              : NP.Security.getUser().get('userprofile_id'),
                            delegation_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id'),
                            UtilityAccount_AccountNumber: me.accountNumber,
                            UtilityAccount_MeterSize    : me.meterSize,
                            success: function(result) {
                                if (result.length) {
                                    validField.update('<span class="valid-text">Valid meter number</span>');
                                    me.reloadUtilityAccounts();
                                } else {
                                    validField.update('<span class="error-text">Invalid meter number</span>');
                                    accountField.setValue(null);
                                    accountField.getStore().removeAll();
                                }
                            }
                        }
                    });
                } else {
                    me.reloadUtilityAccounts();
                    validField.update('');
                }
            }
        }, 500);
    },

    /**
     * Load and check utility account data.
     * 
     * @param Function callback Callback will be called after all necessary data is loaded and
     *      appropriate fields are set.
     */
    reloadUtilityAccounts: function() {
        var me = this,
            accountField        = me.findField('UtilityAccount_AccountNumber')
            meterField          = me.findField('UtilityAccount_MeterSize'),
            utilityAccountField = me.findField('utilityaccount_id'),
            utilityStore        = utilityAccountField.getStore();

        utilityStore.addExtraParams({
            UtilityAccount_AccountNumber: accountField.getValue()
        });

        if (meterField.getValue() !== '' && meterField.getValue() !== null) {
            utilityStore.addExtraParams({
                UtilityAccount_MeterSize: meterField.getValue()
            });
        } else {
            delete utilityStore.getExtraParams()['UtilityAccount_MeterSize'];
        }

        utilityStore.load(function() {
            utilityAccountField.setValue(utilityStore.getAt(0));
        });
    },

    /***************************************************************************
     * Section: Propery Name
     **************************************************************************/
    /**
     * Prepare markup for Propery Name section.
     */
    markupPropertyName: function() {
        var me = this;

        return [
            // Property
            {
                itemId    : 'field-property-name',
                xtype     : 'shared.propertycombo',
                name      : 'Property_Id',
                allowBlank: false,
                minChars  : 1,
                store     : me['postload-store']['property-names']
            },{
                xtype    : 'button',
                text     : NP.Translator.translate('Property Address'),
                width    : me.buttonWidth,
                margin   : '0 0 0 ' + (me.labelWidth + 5),
                listeners: {
                    click: function() {
                        var doctype = me.findField('Image_Doctype_Id').getDisplayValue();

                        if (doctype.toUpperCase() == 'Utility Invoice'.toUpperCase()) {
                            var utilAcctField = me.findField('utilityaccount_id');
                            
                            if (utilAcctField.getValue() === null) {
                                return;
                            }

                            var utilRec = utilAcctField.findRecordByValue(utilAcctField.getValue()),
                                id      = utilRec.get('property_id');
                        } else {
                            id = me.findField('Property_Id').getValue();
                        }

                        me.showAddressWindow.apply(me, [id, 'property', 'Property Address']);
                    }
                }
            }
        ];
    },

    /***************************************************************************
     * Section: Vendor Name
     **************************************************************************/
    /**
     * Prepare markup for Vendor Name section.
     */
    markupVendorName: function() {
        var me = this;

        return [
            // Vendor
            {
                itemId    : 'field-vendor-name',
                xtype     : 'shared.vendorautocomplete',
                name      : 'Image_Index_VendorSite_Id',
                valueField: 'vendorsite_id',
                store     : me['postload-store']['vendor-names']
            },{
                xtype    : 'button',
                text     : NP.Translator.translate('Vendor Address'),
                width    : me.buttonWidth,
                margin   : '0 0 0 ' + (me.labelWidth + 6),
                listeners: {
                    click: function() {
                        var doctype = Ext.ComponentQuery.query(
                            '[name="Image_Doctype_Id"]'
                        )[0].getDisplayValue();

                        if (doctype.toUpperCase() == 'Utility Invoice'.toUpperCase()) {
                            var utilAcctField = me.findField('utilityaccount_id');
                            
                            if (utilAcctField.getValue() === null) {
                                return;
                            }

                            var utilRec = utilAcctField.findRecordByValue(utilAcctField.getValue()),
                                id      = utilRec.get('vendor_id');
                        } else {
                            var vendorField = me.findField('Image_Index_VendorSite_Id');

                            if (vendorField.getValue() === null) {
                                return;
                            }
                            
                            var vendorRec = vendorField.findRecordByValue(vendorField.getValue()),
                                id        = (vendorRec !== false) ? vendorRec.get('vendor_id') : null;
                        }

                        me.showAddressWindow.apply(me, [id, 'vendorsite', 'Vendor Address'])
                    }
                }
            }
        ];
    },

    /***************************************************************************
     * Section: Invoice Number
     **************************************************************************/
    /**
     * Prepare markup for Invoice Number section.
     */
    markupInvoiceNumber: function() {
        return [
            // Invoice number
            {
                itemId: 'field-invoice-number',
                xtype: 'textfield',

                name: 'Image_Index_Ref',//name $request['invoiceimage_ref']//value="#get_current_image.image_index_ref#" 
                fieldLabel: NP.Translator.translate('Invoice Number')
            }
        ];
    },

    /***************************************************************************
     * Section: P0 number
     **************************************************************************/
    /**
     * Prepare markup for P0 Number section.
     */
    markupP0Number: function() {
        return [
            // P0 number
            {
                itemId: 'field-p0-number',
                xtype: 'textfield',

                name: 'po_ref',
                fieldLabel: NP.Translator.translate('P0 number')
            }
        ];
    },

    /***************************************************************************
     * Section: Invoice Dates
     **************************************************************************/
    /**
     * Prepare markup for Invoice Dates section.
     */
    markupInvoiceDates: function() {
        return [
            // Invoice date
            {
                itemId: 'field-invoice-date',
                xtype: 'datefield',

                name: 'Image_Index_Invoice_Date',
                fieldLabel: NP.Translator.translate('Invoice Date')
            },
            // Invoice due date
            {
                itemId: 'field-due-date',
                xtype: 'datefield',

                name: 'Image_Index_Due_Date',
                fieldLabel: NP.Translator.translate('Invoice Due Date')
            }
        ];
    },

    /***************************************************************************
     * Section: Amount
     **************************************************************************/
    /**
     * Prepare markup for Amount section.
     */
    markupAmount: function() {
        return [
            // Amount
            {
                itemId          : 'image-index-amount',
                name            : 'Image_Index_Amount',
                xtype           : 'numberfield',
                decimalPrecision: 2,
                fieldLabel      : NP.Translator.translate('Amount')
            }
        ]
    },

    /***************************************************************************
     * Section: Utility 2
     **************************************************************************/
    /**
     * Prepare markup for Utility 2 section.
     */
    markupUtility2: function() {
        return [
            {
                itemId: 'panel-utility-2',
                xtype: 'panel',

                border  : 0,
                layout  : 'form',
                defaults: { labelWidth: this.labelWidth },

                items: [
                    // Cycle From Date
                    {
                        name: 'cycle_from',
                        xtype: 'datefield',
                        fieldLabel: NP.Translator.translate('Cycle From Date')
                    },
                    // Cycle To Date
                    {
                        name: 'cycle_to',
                        xtype: 'datefield',
                        fieldLabel: NP.Translator.translate('Cycle To Date')
                    }
                ]
            }
        ];
    },

    /***************************************************************************
     * Section: Template
     **************************************************************************/
    markupTemplate: function() {
        var self = this;
        return [
            {
                itemId: 'field-use-template',
                xtype: 'button',

                text  : NP.Translator.translate('Use Template'),
                width : self.buttonWidth,
                margin: '0 0 0 ' + (self.labelWidth + 5),
                listeners: {
                    click: function() {
                        self.showUseTemplateWindow();
                    }
                }
            },{
                xtype: 'hiddenfield',
                name : 'image_index_draft_invoice_id'
            }
        ];
    },

    /***************************************************************************
     * Section: Remit advice
     **************************************************************************/
    /**
     * Prepare markup for Remit Advice section.
     */
    markupRemitAdvice: function() {
        return [
            // Remittance Advice
            {
                itemId: 'field-remittance-advice',
                xtype: 'checkbox',

                name: 'remit_advice',
                fieldLabel: NP.Translator.translate('Remittance Advice')
            }
        ];
    },

    /***************************************************************************
     * Section: Universal Fields
     **************************************************************************/
    markupUniversalFields: function() {
        return {
            itemId         : 'invoice-custom-panel',
            hidden         : true,
            xtype          : 'shared.customfieldcontainer',
            type           : 'invoice',
            useColumns     : false,
            labelAlign     : 'left',
            border         : false,
            defaults       : { labelWidth: this.labelWidth },
            fieldCfg       : { allowBlank: true }
        };
    },

    /***************************************************************************
     * Section: Priority and Needed By
     **************************************************************************/
    /**
     * Prepare markup for Priority and Needed By section.
     */
    markupPriorityAndNeededByPanel: function() {
        return [
            // Needed By
            {
                itemId    : 'field-needed-by-date',
                name      : 'image_index_NeededBy_datetm',
                xtype     : 'datefield',
                fieldLabel: NP.Translator.translate('Needed By')
            },
            // Priority
            {
                itemId           : 'field-priority-invoice',
                xtype            : 'customcombo',
                fieldLabel       : NP.Translator.translate('Priority'),
                name             : 'PriorityFlag_ID_Alt',
                displayField     : 'PriorityFlag_Display',
                valueField       : 'PriorityFlag_ID_Alt',
                store            : {
                    type: 'system.priorityflags'
                }
            }
        ];
    },

    /***************************************************************************
     * Section: Exception
     **************************************************************************/
    /**
     * Prepare markup for Exception section.
     */
    markupExceptionReason: function() {
        return [
            // Exception Reason
            {
                itemId    : 'field-exception-reason',
                xtype     : 'textarea',
                name      : 'Image_Index_Exception_reason',
                fieldLabel: NP.Translator.translate('Exception Reason')
            }
        ];
    },

    isValid: function(action) {
        var me = this,
            docTypeField   = me.findField('Image_Doctype_Id'),
            docTypeRec     = docTypeField.findRecordByValue(docTypeField.getValue()),
            propertyBlank  = false,
            vendorBlank    = false,
            utilityBlank   = true,
            exceptionBlank = true;


        if (docTypeRec !== null && docTypeRec.get('image_doctype_name') == 'Utility Invoice') {
            propertyBlank = true;
            vendorBlank   = true;
            utilityBlank  = false;
        }

        me.findField('Property_Id').allowBlank               = propertyBlank;
        me.findField('Image_Index_VendorSite_Id').allowBlank = vendorBlank;
        me.findField('utilityaccount_id').allowBlank         = utilityBlank;

        if (action == 'exception') {
            exceptionBlank = false;
        }
        me.findField('Image_Index_Exception_reason').allowBlank = exceptionBlank;

        // Call the standard validation function
        var isValid = me.callParent();

        return isValid;
    },

    /***************************************************************************
     * Common methods
     **************************************************************************/

    /**
     * Get Current Document Type.
     * 
     * @return int Document type identifier.
     */
    getCurrentDoctype: function() {
        return this.findField('Image_Doctype_Id').getValue();
    },

    /**
     * Get Current Integration Package.
     * 
     * @return int Integration Package identifier.
     */
    getCurrentIntegrationPackage: function() {
        var result = Ext.ComponentQuery.query('[itemId="field-integration-package"]');
        if (result) {
            result = result[0];
        }
        return result && result.getValue && result.getValue() || 1;
    },

    /**
     * Get Default Store parameters.
     * 
     * @return {} Set of parameters.
     */
    getStoreParams: function() {
        return {
            integration_package_id      : this.getCurrentIntegrationPackage(),
            userprofile_id              : NP.Security.getUser().get('userprofile_id'),
            delegation_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id')
        }
    },

    /**
     * Show Use Template window.
     */
    showUseTemplateWindow: function() {
        var me         = this,
            property   = me.findField('Property_Id'),
            vendor     = me.findField('Image_Index_VendorSite_Id'),
            image_index_draft_invoice_id = me.findField('image_index_draft_invoice_id').getValue();
        
        if (!property || !vendor) {
            Ext.MessageBox.alert('Use Template', 'You must select a property and vendor.');
            return;
        }

        var vendorsite_id = vendor.getValue();
        var property_id = property.getValue();
        if (!vendorsite_id || !property_id) {
            Ext.MessageBox.alert('Use Template', 'You must select a property and vendor.');
            return;
        }

        var utilityaccount_id = this.findField('utilityaccount_id').getValue();

        var win = Ext.create('NP.view.invoice.UseTemplateWindow', {
            itemId               : 'imageUseTemplateWin',
            hideTemplateRemoveBtn: false,
            property_id          : property_id,
            vendorsite_id        : vendorsite_id,
            utilityaccount_id    : utilityaccount_id,
            invoice_id           : image_index_draft_invoice_id
        });
        win.show();
    },

    /**
     * Show address window.
     * 
     * @param int id Vendorsite or property id.
     * @param string type Address type.
     * @param string table Vendorsite or property table name.
     * @param string title Window title.
     */
    showAddressWindow: function(id, table, title) {
        if (id) {
            var service,
                action,
                req = {},
                modelClass,
                html;

            if (table == 'vendorsite') {
                service    = 'VendorService';
                action     = 'getVendor';
                paramName  = 'vendor_id';
            } else if (table == 'property') {
                service    = 'PropertyService';
                action     = 'get';
                paramName  = 'property_id';
            }

            req[paramName] = id;

            NP.lib.core.Net.remoteCall({
                requests: Ext.apply(req, {
                    service: service,
                    action : action,

                    success: function(result) {
                        var address = Ext.create('NP.model.contact.Address', result),
                            phone   = Ext.create('NP.model.contact.Phone', result),
                            fax     = Ext.create('NP.model.contact.Phone'),
                            phoneNum,
                            faxNum;

                        if (table == 'vendorsite') {
                            phone.set({
                                phone_number: result.vendorsite_phone_number,
                                phone_ext   : result.vendorsite_phone_ext
                            });

                            fax.set({
                                phone_number: result.vendorsite_fax_phone_number
                            });

                            html = '<b>' + result.vendor_name + 
                                    ' (' + result.vendor_id_alt + ')</b>';
                        } else {
                            fax.set({
                                phone_number: result.fax_phone_number,
                                phone_ext   : result.fax_phone_ext
                            });

                            html = '<b>' + result.property_name + 
                                    ' (' + result.property_id_alt + ')</b>';
                        }

                        html += address.getHtml();

                        phoneNum = phone.getFullPhone();
                        if (phoneNum != '') {
                            html += '<div>' + phoneNum + '</div>';
                        }

                        faxNum = fax.getFullPhone();
                        if (faxNum != '') {
                            html += '<div>' + faxNum + '</div>';
                        }

                        Ext.create('Ext.window.Window', {
                            title : title,

                            width : 400,
                            height: 200,

                            modal : true,
                            layout: 'fit',

                            items : [{
                                xtype      : 'panel',
                                border     : false,
                                bodyPadding: 8,
                                html       : html
                            }]

                        }).show();
                    }
                })
            });
        }
    }
});