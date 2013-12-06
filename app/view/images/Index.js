Ext.define('NP.view.images.Index', {
    extend: 'NP.lib.ui.BoundForm',
    alias:  'widget.images.index',

    title:  'Index Images',
    requires: [
        'NP.view.shared.button.Return',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Delete',
        'NP.view.shared.button.Previous',
        'NP.view.shared.button.Next',
        'NP.view.shared.button.SaveAndNext',
        'NP.view.shared.button.SaveAndPrevious'
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
        this.id = 'panel-index';
        this.layout = 'border';

        this.locale.utilityAccountText = 
            NP.lib.core.Security.hasPermission(6095) ?
                'Enter a valid account number and/or meter number' :
                'Select a utility account'
        ;

        // Prepare stores for comboboxes.
        this['postload-store'] = {
            'vendor-codes': Ext.create('NP.store.vendor.Vendors', {
                service : 'ImageService',
                action  : 'listVendorCode',
                autoLoad: false,
                extraParams: this.getStoreParams()
            }),
            'vendor-names': Ext.create('NP.store.vendor.Vendors', {
                service : 'ImageService',
                action  : 'listVendor',
                autoLoad: false,
                extraParams: this.getStoreParams()
            }),
            'property-codes': Ext.create('NP.store.property.Properties', {
                service : 'ImageService',
                action  : 'listPropertyCode',
                autoLoad: false,
                extraParams: this.getStoreParams()
            }),
            'property-names': Ext.create('NP.store.property.Properties', {
                service : 'ImageService',
                action  : 'listProperty',
                autoLoad: false,
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
            this.markupPropertyCode(),
            this.markupVendorCode(),
            this.markupPropertyName(),
            this.markupVendorName(),
            this.markupAddresses(),
            this.markupInvoiceNumber(),
            this.markupP0Number(),
            this.markupInvoiceDates(),
            this.markupAmount(),
            this.markupUtility2(),
            this.markupTemplate(),
            this.markupRemitAdvice(),
            this.markupUniversalFields(),
            this.markupPriorityAndNeededByPanel(),
            this.markupActionButtonsCommon(),
            this.markupActionButtonsSpecific(),
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
                id: 'index-form',
                xtype: 'panel', 
                border: 0,
                layout: 'form',
                region: 'center',
                bodyPadding: 10,
                overflowY: 'scroll',
                items: fields
            }
        ];

        // Prepare top toolbar elements.
        if (this.section == 'exception') {
            this.tbar = [
                {xtype: 'shared.button.cancel', itemId: 'buttonReturn',  text: 'Cancel'},

                {xtype: 'tbspacer', width: 20},

                {xtype: 'shared.button.previous', itemId: 'buttonPrev',  text: this.locale.buttonPrev},
                {xtype: 'shared.button.next', itemId: 'buttonNext',  text: this.locale.buttonNext},

                {xtype: 'tbspacer', width: 20},

                {xtype: 'shared.button.saveandnext', itemId: 'buttonSaveAndNext',      text: this.locale.buttonSaveAndNext},
                {xtype: 'shared.button.saveandnext', itemId: 'buttonIndexingComplete',      text: 'Indexing Complete and Next'}
            ];
        } else {
            this.tbar = [
                {xtype: 'shared.button.previous', itemId: 'buttonPrev',  text: this.locale.buttonPrev},
                {xtype: 'shared.button.saveandprevious', itemId: 'buttonSaveAndPrev',      text: this.locale.buttonSaveAndPrev},
                {xtype: 'shared.button.saveandnext', itemId: 'buttonSaveAsException',  text: this.locale.buttonSaveAsException},
                {xtype: 'shared.button.return', itemId: 'buttonReturn',  text: this.locale.buttonReturn},
                {xtype: 'shared.button.delete', itemId: 'buttonDeleteFromQueue',  text: this.locale.buttonDelete},
                {xtype: 'shared.button.saveandnext', itemId: 'buttonSaveAndNext',      text: this.locale.buttonSaveAndNext},
                {xtype: 'shared.button.next', itemId: 'buttonNext',  text: this.locale.buttonNext},
                {xtype: 'shared.button.next', itemId: 'buttonInvoice', text: this.locale.buttonInvoice}
            ];
        }

        this.callParent(arguments);
        this.onDocumentTypeChange();

        this.bindEvents();
    },

    /**
     * Bind events.
     */
    bindEvents: function() {
        // These comboboxes have similar data but also have different sort orders.
        // In this case it will be better to make sorts on server-side and get prepared results 
        // on the client-side without any manipulations.

        // Property code and property name comboboxes should be prepared at one time.
        var propertyCode = 
            Ext.ComponentQuery.query('[name="Property_Alt_Id"]')[0]
        ;
        var propertyName = 
            Ext.ComponentQuery.query('[name="Property_Id"]')[0]
        ;
        propertyCode.on(
            'beforequery', 
            this.loadProperties.bind(this, propertyCode, propertyName), 
            propertyCode, 
            {single: true}
        );
        propertyName.on(
            'beforequery', 
            this.loadProperties.bind(this, propertyCode, propertyName), 
            propertyName, 
            {single: true}
        );

        // Vendor code and vendor name comboboxes should be prepared at one time.
        var vendorCode = 
            Ext.ComponentQuery.query('[name="invoiceimage_vendorsite_alt_id"]')[0]
        ;
        var vendorName = 
            Ext.ComponentQuery.query('[name="Image_Index_VendorSite_Id"]')[0]
        ;
        vendorCode.on(
            'beforequery', 
            this.loadProperties.bind(this, vendorCode, vendorName), 
            vendorCode, 
            {single: true}
        );
        vendorName.on(
            'beforequery', 
            this.loadProperties.bind(this, vendorCode, vendorName), 
            vendorName, 
            {single: true}
        );
    },

    /**
     * Load Vendors stores for comboboxes.
     */
    loadVendors: function(vendorCode, vendorName) {
        vendorCode.getStore().load();
        vendorName.getStore().load();
    },

    /**
     * Load Vendors stores for comboboxes.
     */
    loadProperties: function(propertyCode, propertyName) {
        propertyCode.getStore().load();
        propertyName.getStore().load();
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
        return [
            // Field: Document type
            {
                name: 'Image_Doctype_Id',

                xtype: 'customcombo',
                fieldLabel: 'Document Type:',

                editable: false,
                typeAhead: false,
                forceSelection: true,
                selectFirstRecord: true,

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
                fieldLabel: 'Image Name:'
            },
            // Field: Integration Package
            {
                itemId: 'field-integration-package',

                xtype: 'customcombo',
                fieldLabel: 'Integration Package:',

                editable: false,
                typeAhead: false,
                selectFirstRecord: true,

                store: storeIntegrationPackages,
                valueField:   'integration_package_id',
                displayField: 'integration_package_name',

                listeners: {
                    select: this.onIntegrationPackageChange.bind(this)
                }
            },
        ]
    },

    /**
     * Show appropriate fields if Document Type is changed.
     * 
     * @param combo Document type combo box.
     * @param records Combobox data.
     */
    onDocumentTypeChange: function(combo, records) {
        var title = 
            (combo && records) ?
                records[0]['data'][combo['displayField']]:
                'Invoice'
        ;
        title = title.replace(' ', '');

        this['display' + title] && this['display' + title]();
    },

    /**
     * Reload property and vendor comboboxes data if integration package is changed.
     * 
     * @param combo Document type combo box.
     * @param records Combobox data.
     */
    onIntegrationPackageChange: function(combo, records) {
        this.reloadStores();
    },

    /**
     * Show/hide form fields depending on passed configuration.
     * 
     * @param fields Key-value pairs where key is fields itemId and value is visibility flag.
     */
    display: function(fields) {
        for (var key in fields) {
            var field = Ext.ComponentQuery.query(
                '[itemId~="' + key + '"]'
            )[0];
            fields[key] ? field.show() : field.hide();
        }
        
    },

    /**
     * Display fields for Invoice document type.
     */
    displayInvoice: function() {
        var fields = {
            'field-integration-package' : true,
            'panel-utility'             : false,
            'field-property-code'       : true,
            'field-property-name'       : true,
            'field-vendor-code'         : true,
            'field-vendor-name'         : true,
            'field-invoice-number'      : true,
            'field-p0-number'           : false,
            'panel-invoice-dates'       : true,
            'panel-utility-2'           : false,
            'field-use-template'        : true,
            'field-remittance-advice'   : true,
            'panel-property-and-neededby': true
        };

        this.display(fields);
    },

    /**
     * Display fields for Utility Invoice document type.
     */
    displayUtilityInvoice: function() {
        var fields = {
            'field-integration-package' : false,
            'panel-utility'             : true,
            'field-property-code'       : false,
            'field-property-name'       : false,
            'field-vendor-code'         : false,
            'field-vendor-name'         : false,
            'field-invoice-number'      : true,
            'field-p0-number'           : false,
            'panel-invoice-dates'       : true,
            'panel-utility-2'           : true,
            'field-use-template'        : true,
            'field-remittance-advice'   : true,
            'panel-property-and-neededby': false
        };
        this.display(fields);
    },

    /**
     * Display fields for Purchase Order document type.
     */
    displayPurchaseOrder: function() {
        var fields = {
            'field-integration-package' : true,
            'panel-utility'             : false,
            'field-property-code'       : true,
            'field-property-name'       : true,
            'field-vendor-code'         : true,
            'field-vendor-name'         : true,
            'field-invoice-number'      : false,
            'field-p0-number'           : true,
            'panel-invoice-dates'       : false,
            'panel-utility-2'           : false,
            'field-use-template'        : false,
            'field-remittance-advice'   : false,
            'panel-property-and-neededby': false
        };
        this.display(fields);
    },

    /**
     * Display fields for Receipt document type.
     */
    displayReceipt: function() {
        var fields = {
            'field-integration-package' : true,
            'panel-utility'             : false,
            'field-property-code'       : true,
            'field-property-name'       : true,
            'field-vendor-code'         : true,
            'field-vendor-name'         : true,
            'field-invoice-number'      : false,
            'field-p0-number'           : false,
            'panel-invoice-dates'       : false,
            'panel-utility-2'           : false,
            'field-use-template'        : false,
            'field-remittance-advice'   : false,
            'panel-property-and-neededby': false
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
        if (NP.lib.core.Security.hasPermission(6094)) {
            if (NP.lib.core.Security.hasPermission(6095)) {
                var options = {
                    xtype: 'panel',

                    border: 0,
                    layout: 'form',

                    items: [
                        // Field: Account Number
                        {
                            name: 'utilityaccount_accountnumber',

                            xtype: 'textfield',
                            fieldLabel: 'Account Number:',

                            listeners: {
                                change: this.checkUtilityAccountNumber.bind(this)
                            }
                        },
                        // Panel: Is Utility Account Valid
                        {
                            name: 'panel-utility-account-valid',
                            border: 0
                        },
                        // Field: Meter Number
                        {
                            name: 'utilityaccount_metersize',

                            xtype: 'textfield',
                            fieldLabel: 'Meter Number:',

                            listeners: {
                                change: this.checkMeterNumber.bind(this)
                            }
                        },
                        // Panel: Is Meter Number Valid
                        {
                            name: 'panel-utility-metersize-valid',
                            border: 0
                        }
                    ]
                }
            } else {
                var storeAccountNumber =
                    Ext.create('NP.store.images.AccountNumbers', {
                        service    : 'ImageService',
                        action     : 'listAccountNumbers',
                        autoLoad   : false,
                        extraParams : {
                            'userprofile_id': NP.Security.getUser().get('userprofile_id'),
                            'delegation_to_userprofile_id': NP.Security.getUser().get('delegation_to_userprofile_id')
                        }
                    }
                );

                var storeMeterSize =
                    Ext.create('NP.store.images.MeterSizes', {
                        service    : 'ImageService',
                        action     : 'listMeterSizes',
                        autoLoad   : false,
                        extraParams: {
                            account: 0
                        }
                    }
                );

                var self = this;
                options = {
                    xtype: 'panel',

                    border: 0,
                    layout: 'form',

                    items: [
                        // Field: Account Number
                        {
                            name: 'utilityaccount_accountnumber',

                            xtype: 'customcombo',
                            fieldLabel: 'Account Number:',

                            store: storeAccountNumber,
                            displayField: 'utilityaccount_accountnumber',
                            valueField:   'utilityaccount_accountnumber',
                            loadStoreOnFirstQuery: true,

                            listeners: {
                                change: this.checkUtilityAccountNumber.bind(this),
                                select: function(combo, records) {
                                    self.checkAccountNumber.apply(self);

                                    var metersizes = Ext.ComponentQuery.query(
                                        '[name="utilityaccount_metersize"]'
                                    )[0];

                                    var proxy = metersizes.getStore().getProxy();
                                    Ext.apply(proxy.extraParams, {
                                        account: records[0].data['utilityaccount_accountnumber']
                                    });
                                    metersizes.getStore().load();
                                }
                            }
                        },
                        // Field: Meter Number
                        {
                            name: 'utilityaccount_metersize',

                            xtype: 'customcombo',
                            fieldLabel: 'Meter Number:',

                            store: storeMeterSize,
                            displayField: 'utilityaccount_metersize',
                            valueField:   'utilityaccount_metersize',
                            loadStoreOnFirstQuery: false,

                            listeners: {
                                change: this.checkMeterNumber.bind(this),
                                select: this.reloadUtilityAccounts.bind(this)
                            }
                        },
                    ]
                };
            };

            var items = [
                options,

                // Field: Utility Account
                {
                    itemId: 'field-utility-account',
                    name:'panel-utility-account',
                    
                    xtype: 'text',
                    html:'<b>Utility Account:</b> <em>' + this.locale.utilityAccountText + '</em>'
                },

                // Field: Utility Account Id
                {
                    name: 'utilityaccount_id',
                    xtype: 'hiddenfield'
                },
                // Field: Utility Property Id
                {
                    name: 'utility_property_id',
                    xtype: 'hiddenfield'
                },
                // Field: Utility Vendorsite Id
                {
                    name: 'utility_vendorsite_id',
                    xtype: 'hiddenfield'
                }
            ];
        }

        return [
            {
                itemId: 'panel-utility',

                xtype: 'panel',

                border: 0,
                layout: 'form',

                items: items
            }
        ];
    },

    /**
     * Load data for utility account check and choose appropriate utility account.
     * This method is used by Check Utility Account Number and Meter Number functionality.
     * 
     * @param callback After utility account data is loaded and selected callback will be called.
     */
    checkAccountNumber: function(callback) {
        this.reloadUtilityAccounts(function(data, isAccountValid, isMetersizeValid) {
            var account = Ext.ComponentQuery.query(
                '[name="utilityaccount_accountnumber"]'
            )[0];
            this.selectUtilityAccount(account.getValue(), isAccountValid, isMetersizeValid);

            callback && callback(data);
        })
    },

    /**
     * Check if Utility Account Number is correct.
     */
    checkUtilityAccountNumber: function() {
        var callback = function(){};
        var account = Ext.ComponentQuery.query(
            '[name="utilityaccount_accountnumber"]'
        )[0];
        var accountValid = Ext.ComponentQuery.query(
            '[name="panel-utility-account-valid"]'
        )[0];

        if (account.getValue() == '') {
            accountValid.update('');

            callback && callback({
                accountNumberValid: false
            });
        } else {
            this.checkAccountNumber(callback);
        }
    },

    /**
     * Check if Meter Number is correct.
     */
    checkMeterNumber: function() {
        var metersize = Ext.ComponentQuery.query(
            '[name="utilityaccount_metersize"]'
        )[0];
        var metersizeValid = Ext.ComponentQuery.query(
            '[name="panel-utility-metersize-valid"]'
        )[0];

        var callback = callback || function() {};

        if (metersize.getValue() == '') {
            metersizeValid.update('');
            if (metersize.getXType() == 'textfield') {
                this.checkAccountNumber(callback);
            } else {
                callback && callback({
                    meterValid: true
                });
            }
        } else {
            this.checkAccountNumber(callback);
        }
    },

    /**
     * Load and check utility account data.
     * 
     * @param Function callback Callback will be called after all necessary data is loaded and
     *      appropriate fields are set.
     */
    reloadUtilityAccounts: function(callback) {
        var account = Ext.ComponentQuery.query(
            '[name="utilityaccount_accountnumber"]'
        )[0];
        var metersize = Ext.ComponentQuery.query(
            '[name="utilityaccount_metersize"]'
        )[0];

        var accountValid = Ext.ComponentQuery.query(
            '[name="panel-utility-account-valid"]'
        )[0];
        var metersizeValid = Ext.ComponentQuery.query(
            '[name="panel-utility-metersize-valid"]'
        )[0];

        var utilityAccountId = Ext.ComponentQuery.query(
            '[name="utilityaccount_id"]'
        )[0];
        var utilityPropertyId = Ext.ComponentQuery.query(
            '[name="utility_property_id"]'
        )[0];
        var utilityVendorsiteId = Ext.ComponentQuery.query(
            '[name="utility_vendorsite_id"]'
        )[0];

        var panelUtilityAccount = Ext.ComponentQuery.query(
            '[name="panel-utility-account"]'
        )[0];
        callback = callback || function() {};

        var self = this;
        NP.lib.core.Net.remoteCall({
            requests: {
                service: 'ImageService',
                action : 'matchUtilityAccount',

                userprofile_id: NP.Security.getUser().get('userprofile_id'),
                delegation_to_userprofile_id: NP.Security.getUser().get('delegation_to_userprofile_id'),

                utilityaccount_metersize: metersize.getValue(),
                utilityaccount_accountnumber: account.getValue(),

                success: function(data) {
                    if (data.accountNumberValid) {
                        accountValid && 
                            accountValid.update('<span style="color:#009900;">Valid account number</span>')
                        ;

                        if (data.meterValid) {
                            if (data.accounts.length == 1) {
                                utilityAccountId.setValue(
                                    data.accounts[0].utilityaccount_id + ',' +
                                    data.accounts[0].property_id + ',' +
                                    data.accounts[0].vendorsite_id                                
                                )
                                utilityPropertyId.setValue(
                                    data.accounts[0].property_id
                                );
                                utilityVendorsiteId.setValue(
                                    data.accounts[0].vendorsite_id
                                );
                                panelUtilityAccount && panelUtilityAccount.update(
                                    '<b>Utility Account:</b> ' +
                                    data.accounts[0].utilityaccount_name
                                );
                            } else {
                                utilityPropertyId.setValue(
                                    data.accounts[0].property_id
                                );
                                utilityVendorsiteId.setValue(
                                    data.accounts[0].vendorsite_id
                                );

                                var html = '<select id="utilityaccount_id" name="utilityaccount_id" onchange="changeUtilityAccountId(this);">';
                                for (var i = 0; i < data.accounts.length; i++) {
                                    html +=
                                        '<option value="' +
                                            data.accounts[0].utilityaccount_id + ',' +
                                            data.accounts[0].property_id + ',' +
                                            data.accounts[0].vendorsite_id +
                                        '">' + data.accounts[0].utilityaccount_name + '</option>'
                                    ;
                                }
                                html += '</select>';
                                panelUtilityAccount && 
                                    panelUtilityAccount.update('<b>Utility Account:</b> ' + html)
                                ;
                            }
                        } else {
                            utilityAccountId.setValue('');
                        }
                    } else {
                        utilityAccountId.setValue('');
                        accountValid && 
                            accountValid.update('<span style="color:#CC0000;">Invalid account number</span>')
                        ;
                    }

                    if (metersize.getValue() == '') {
                        metersizeValid && 
                            metersizeValid.update('')
                        ;
                    } else {
                        metersizeValid && (
                            data.meterValid ?
                                metersizeValid.update('<span style="color:#009900;">Valid meter number</span>') :
                                metersizeValid.update('<span style="color:#CC0000;">Invalid meter number</span>')
                        );
                    }

                    callback && callback.apply && callback.apply(
                        self,
                        [
                            data, 
                            data.accountNumberValid, 
                            data.meterValid
                        ]
                    );
                }
            }
        });
    },

    /**
     * Set hidden fields values for the utility account after appropriate data is 
     * reloaded.
     * 
     * @param number accountNumber Account number.
     * @param boolean isAccountValid Was account number passed check or not.
     * @param boolean isMetersizeValid Was meter number passed check or not.
     */
    selectUtilityAccount: function(accountNumber, isAccountValid, isMetersizeValid) {
        var account = Ext.ComponentQuery.query(
            '[name="utilityaccount_accountnumber"]'
        )[0];
        var metersize = Ext.ComponentQuery.query(
            '[name="utilityaccount_metersize"]'
        )[0];

        var utilityPropertyId = Ext.ComponentQuery.query(
            '[name="utility_property_id"]'
        )[0];
        var utilityVendorsiteId = Ext.ComponentQuery.query(
            '[name="utility_vendorsite_id"]'
        )[0];

        var panelUtilityAccount = Ext.ComponentQuery.query(
            '[name="panel-utility-account"]'
        )[0];

        if (!isAccountValid || !isMetersizeValid && $('#utilityaccount_metersize option').length == 0 || account.getValue() == '') {
            utilityPropertyId.setValue('');
            utilityVendorsiteId.setValue('');
            panelUtilityAccount.update('<b>Utility Account:</b> <em>' + this.locale.utilityAccountText + '</em>')

            if (isAccountValid && $('#utilityaccount_metersize option').length) {
                metersize.update('<option value=""></option>');
            }
        } else if ($('#utilityaccount_metersize option').length) {
            NP.lib.core.Net.remoteCall({
                requests: {
                    service: 'ImageService',
                    action : 'getUtilityAccountVendorPropMeter',

                    utilityaccount_accountnumber: metersize.getValue(),

                    success: function(data) {
                        metersize.update('<option value=""></option>');
                        for (var i = 0, l = data.meters; i < l; i++) {
                            // Remove the string we added at the end of the meter to force string conversion
                            //var fixedval = data.meters[i].replace('|@|', '');
                            //meterSelect.append($('<option></option>').val(fixedval).html(fixedval));
                        }
                    }
                }
            });
        }
    },

    /**
     * Alternative way to set utility account values.
     * 
     * If comboboxes are used for account number selection, different select account
     * mechanism is used.
     * 
     * @param {} field Utility account selector's option.
     */
    changeUtilityAccountId: function(field) {
        var val = $(field).val().split(',');
        var property_id = val[1];
        var vendorsite_id = val[2];
        $('##utility_property_id').val(property_id);
        $('##utility_vendorsite_id').val(vendorsite_id);
    },

    /***************************************************************************
     * Section: Property Code
     **************************************************************************/
    /**
     * Prepare markup for Property Code section.
     */
    markupPropertyCode: function() {
        return [
            // Property code
            {
                itemId: 'field-property-code',

                name: 'Property_Alt_Id',
                xtype: 'customcombo',
                fieldLabel: 'Property Code:',

                displayField: 'property_id_alt',
                valueField:   'property_id',

                store: this['postload-store']['property-codes'],

                listeners: {
                    select: function(combo, records) {
                        var value = combo.getValue();
                        var element = Ext.ComponentQuery.query('[name="Property_Id"]')[0];
                        if (value) {
                            element.disable();
                            element.setValue(value);
                        } else {
                            element.enable();
                            element.setValue(value);
                        }
                    }
                }
            }
        ];
    },

    /***************************************************************************
     * Section: Vendor Code
     **************************************************************************/
    /**
     * Prepare markup for Vendor Code section.
     */
    markupVendorCode: function() {
        return [
            //Vendor code
            {
                itemId: 'field-vendor-code',
                xtype: 'customcombo',
                fieldLabel: 'Vendor Code:',

                name: 'invoiceimage_vendorsite_alt_id',

                displayField: 'vendor_id_alt',
                valueField:   'vendorsite_id',
                addBlankRecord: true,

                store: this['postload-store']['vendor-codes'],

                listeners: {
                    select: function(combo, records) {
                        var value = combo.getValue();
                        var element = Ext.ComponentQuery.query('[name="Image_Index_VendorSite_Id"]')[0];
                        if (value) {
                            element.disable();
                            element.setValue(value);
                        } else {
                            element.enable();
                            element.setValue(value);
                        }
                    }
                }
            }
        ];
    },

    /***************************************************************************
     * Section: Propery Name
     **************************************************************************/
    /**
     * Prepare markup for Propery Name section.
     */
    markupPropertyName: function() {
        return [
            // Property
            {
                itemId: 'field-property-name',

                name: 'Property_Id',
                xtype: 'customcombo',
                fieldLabel: 'Property:',

                displayField: 'property_name',
                valueField:   'property_id',

                store: this['postload-store']['property-names'],

                listeners: {
                    select: function(combo, records) {
                        var value = combo.getValue();
                        var element = Ext.ComponentQuery.query('[name="Property_Alt_Id"]')[0];
                        if (value) {
                            element.disable();
                            element.setValue(value);
                        } else {
                            element.enable();
                            element.setValue(value);
                        }
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
        return [
            // Vendor
            {
                itemId: 'field-vendor-name',
                xtype: 'customcombo',

                fieldLabel: 'Vendor:',
                addBlankRecord: true,

                name: 'Image_Index_VendorSite_Id',

                displayField: 'vendor_name',
                valueField:   'vendorsite_id',

                store: this['postload-store']['vendor-names'],

                listeners: {
                    select: function(combo, records) {
                        var value = combo.getValue();
                        var element = Ext.ComponentQuery.query('[name="invoiceimage_vendorsite_alt_id"]')[0];
                        if (value) {
                            element.disable();
                            element.setValue(value);
                        } else {
                            element.enable();
                            element.setValue(value);
                        }
                    }
                }
            }
        ];
    },

    /***************************************************************************
     * Section: Addresses
     **************************************************************************/
    /**
     * Prepare markup for Addresses section.
     */
    markupAddresses: function() {
        var self = this;

        return [
            {
                xtype: 'button',
                text: 'Property Address',
                listeners: {
                    click: function() {
                        var doctype = Ext.ComponentQuery.query(
                            '[name="Image_Doctype_Id"]'
                        )[0].getDisplayValue();

                        if (doctype.toUpperCase() == 'Utility Invoice'.toUpperCase()) {
                            var id = Ext.ComponentQuery.query(
                                '[name="utility_property_id"]'
                            )[0].getValue();
                        } else {
                            id = Ext.ComponentQuery.query(
                                '[itemId="field-property-name"]'
                            )[0].getValue();
                        }

                        self.showAddressWindow.apply(self, [id, 'home', 'property', 'Property Address']);
                    }
                }
            },
            {
                xtype: 'button',
                text: 'Vendor Address',
                listeners: {
                    click: function() {
                        var doctype = Ext.ComponentQuery.query(
                            '[name="Image_Doctype_Id"]'
                        )[0].getDisplayValue();

                        if (doctype.toUpperCase() == 'Utility Invoice'.toUpperCase()) {
                            var id = Ext.ComponentQuery.query(
                                '[name="utility_vendorsite_id"]'
                            )[0].getValue();
                        } else {
                            id = Ext.ComponentQuery.query(
                                '[itemId="field-vendor-name"]'
                            )[0].getValue();
                        }

                        self.showAddressWindow.apply(self, [id, 'mailing', 'vendorsite', 'Vendor Address'])
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
                fieldLabel: 'Invoice Number:'
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
                fieldLabel: 'P0 number:'
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
            {
                itemId: 'panel-invoice-dates',

                xtype: 'panel',

                border: 0,
                layout: 'form',

                items: [
                    // Invoice date
                    {
                        id: 'field-invoice-date',
                        xtype: 'datefield',

                        name: 'Image_Index_Invoice_Date',
                        fieldLabel: 'Invoice Date:'
                    },
                    // Invoice due date
                    {
                        id: 'field-due-date',
                        xtype: 'datefield',

                        name: 'Image_Index_Due_Date',
                        fieldLabel: 'Invoice Due Date:'
                    }
                ]
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
                name: 'Image_Index_Amount',
                xtype: 'textfield',
                fieldLabel: 'Amount:'
            },
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

                border: 0,
                layout: 'form',

                items: [
                    // Cycle From Date
                    {
                        name: 'cycle_from',
                        xtype: 'datefield',
                        fieldLabel: 'Cycle From Date:'
                    },
                    // Cycle To Date
                    {
                        name: 'cycle_to',
                        xtype: 'datefield',
                        fieldLabel: 'Cycle To Date:'
                    },
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

                text: 'Use Template',
                listeners: {
                    click: function() {
                        self.showUseTemplateWindow();
                    }
                }
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
                fieldLabel: 'Remittance Advice:'
            },
        ];
    },

    /***************************************************************************
     * Section: Universal Fields
     **************************************************************************/
    markupUniversalFields: function() {
        return [
            
        ];
    },

    /***************************************************************************
     * Section: Priority and Needed By
     **************************************************************************/
    /**
     * Prepare markup for Priority and Needed By section.
     */
    markupPriorityAndNeededByPanel: function() {
        return [
            {
                itemId: 'panel-property-and-neededby',

                xtype: 'panel',

                border: 0,
                layout: 'form',

                items: [
                    // Needed By
                    {
                        name: 'Image_Index_neededby_datetm',
                        xtype: 'datefield',
                        fieldLabel: 'Needed By:'
                    },
                    // Priority
                    {
                        //id: 'field-priority-invoice',
                        xtype: 'combobox',
                        fieldLabel: 'Priority:',

                        //name: 'PriorityFlag_ID_Alt_invoice',
                        name: 'PriorityFlag_ID_Alt',

                        displayField: 'title',
                        valueField:   'value',
                        store: {
                            fields: ['title', 'value'],
                            data : [
                                {"title":"Regular", "value": 1},
                                {"title":"High",    "value": 2},
                                {"title":"Urgent",  "value": 3}
                            ]                            
                        }
                    }
                ]
            }
        ];
    },

    /***************************************************************************
     * Section: Action Buttons Panel
     **************************************************************************/
    /**
     * Prepare markup for Action Buttons Panel section.
     */
    markupActionButtonsCommon: function() {
        return [
            {
                xtype: 'button',
                itemId: 'buttonSaveAndNextAction',

                text: 'Save and Next'
            },
        ];
    },

    /***************************************************************************
     * Section: Action Buttons Specific Panel
     **************************************************************************/
    /**
     * Prepare markup for Action Buttons Specific Panel section.
     * These buttons should be displayed depending on current section/tab ('index' or 'exception')
     */
    markupActionButtonsSpecific: function() {
        if (this.section == 'exception') {
            return [];
        }

        return [
            {
                itemId: 'panel-action-buttons-specific', 
                xtype: 'panel',

                border: 0,
                layout: 'form',

                items: [
                    {
                        xtype: 'button',
                        itemId: 'buttonSaveAsExceptionAction',

                        text: 'Save as Exception'
                    },
                    {
                        xtype: 'button',
                        itemId: 'buttonInvoiceAction',
                        
                        text: 'Create Invoice'
                    }
                ]
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
                id: 'field-exception-reason',
                xtype: 'textarea',

                name: 'Image_Index_Exception_reason',
                fieldLabel: 'Exception Reason:'
            }
        ];
    },

    /***************************************************************************
     * Common methods
     **************************************************************************/
    /**
     * Reload property and vendor stores when integration package is changed.
     */
    reloadStores: function() {
        var params = this.getStoreParams();
        var fields = [
            'field-property-code',
            'field-property-name',
            'field-vendor-code',
            'field-vendor-name'
        ]

        for (var i = 0, l = fields.length; i < l; i++) {
            var component = Ext.ComponentQuery.query('[itemId="' + fields[i] + '"]');
            if (component && component[0]) {
                var store = component[0].getStore && component[0].getStore();

                store.extraParams = params;
                store.reload();
            }
        }
    },

    /**
     * Get Current Document Type.
     * 
     * @return int Document type identifier.
     */
    getCurrentDoctype: function() {
        return Ext.ComponentQuery.query('[name="Image_Doctype_Id"]')[0].getValue();
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
            integration_package: this.getCurrentIntegrationPackage(),
            userprofile_id: NP.Security.getUser().get('userprofile_id'),
            delegation_to_userprofile_id: NP.Security.getUser().get('delegation_to_userprofile_id')
        }
    },

    /**
     * Show Use Template window.
     */
    showUseTemplateWindow: function() {
        var property = Ext.ComponentQuery.query(
            '[name="Property_Id"]'
        )[0];
        var vendor = Ext.ComponentQuery.query(
            '[name="Image_Index_VendorSite_Id"]'
        )[0];
        if (!property || !vendor) {
            Ext.MessageBox.alert('Use Template', 'You must select a property and vendor.');
            return;
        }

        var vendor_id = vendor.getValue();
        var property_id = property.getValue();
        if (!vendor_id || !property_id) {
            Ext.MessageBox.alert('Use Template', 'You must select a property and vendor.');
            return;
        }

        var account = Ext.ComponentQuery.query(
            '[name="utilityaccount_accountnumber"]'
        )[0];

        var storeTemplates = 
            Ext.create('NP.lib.data.Store', {
                service    : 'ImageService',
                action     : 'getTemplateForImageIndex',
                extraParams : {
                    'property_id': property_id,
                    'vendorsite_id': vendor_id,
                    'utilityaccount_accountnumber': account.getValue()
                }
            });
        storeTemplates.load();

        var window = Ext.create('Ext.window.Window', {
            title: 'Add Template',

            width: 400,
            height: 200,
            bodyPadding: 10,

            modal: true,
            layout: 'form',

            tbar: [
                {
                    xtype: 'shared.button.cancel',
                    text: 'Cancel',
                    listeners: {
                        click: function() {
                            window.close();
                        }
                    }
                }
            ],
            items: [
                {
                    //name: 'Image_Doctype_Id',

                    xtype: 'customcombo',
                    fieldLabel: 'Choose a template:',

                    editable: false,
                    typeAhead: false,
                    forceSelection: true,
                    selectFirstRecord: true,

                    store: storeTemplates,
                    valueField:   'invoice_id',
                    displayField: 'template_name'
                }
            ]
        });
        window.show();
    },

    /**
     * Show address window.
     * 
     * @param int id Vendorsite or property id.
     * @param string type Address type.
     * @param string table Vendorsite or property table name.
     * @param string title Window title.
     */
    showAddressWindow: function(id, type, table, title) {
        if (id) {
            NP.lib.core.Net.remoteCall({
                requests: {
                    service: 'ImageService',
                    action : 'getAddress',

                    id: id,
                    table_name: table,
                    address_type: type,

                    success: function(result) {
                        if (result.success) {
                            var html = [
                                '<span style=\'font-weight: bold\'>',
                                result.data.entity_name + '<br>',
                            ];
                            result.data.entity_code && 
                                html.push(result.data.entity_code + '<br>')
                            ;
                            html.push('</span><br>');

                            result.data.address_line1 && 
                                html.push(result.data.address_line1 + '<br>')
                            ;
                            result.data.address_line2 && 
                                html.push(result.data.address_line2 + '<br>')
                            ;
                            result.data.address_line3 && 
                                html.push(result.data.address_line3 + '<br>')
                            ;

                            result.data.address_city && 
                                html.push(result.data.address_city)
                            ;
                            result.data.address_state && 
                                html.push(result.data.address_state)
                            ;
                            result.data.address_zip && 
                                html.push(result.data.zip)
                            ;
                            html.push('<br>');

                            result.data.phone && 
                                html.push('Phone: ' + result.data.phone)
                            ;
                            result.data.fax && 
                                html.push('Fax: ' + result.data.fax)
                            ;

                            Ext.create('Ext.window.Window', {
                                title: title,

                                width: 400,
                                height: 200,
                                bodyPadding: 10,

                                modal: true,
                                layout: 'fit',

                                html: html

                            }).show();
                        }
                    }
                }
            });
        }
    }
});