Ext.define('NP.view.images.Index', {
    extend: 'NP.lib.ui.BoundForm',
    alias:  'widget.images.index',

    title:  'Index Images',
    /*defaults: {
        labelWidth: 120
    },*/

    ids: {
        buttonReturn: 'buttonReturn',

        buttonNext: 'buttonNext',
        buttonPrev: 'buttonPrev',

        buttonSaveAndNext:     'buttonSaveAndNext',
        buttonSaveAndPrev:     'buttonSaveAndPrev',
        buttonSaveAsException: 'buttonSaveAsException',

        buttonDelete: 'buttonDeleteFromQueue',
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
        /*
        var fields = [
            // Remittance Advice
            {
                id: 'field-remittance-advice',
                name: 'remit_advice',
                xtype: 'checkbox',
                labelWidth: widthLabel,
                fieldLabel: 'Remittance Advice:'
            },
        ];*/


        this.id = 'panel-index';
        this.layout = 'border';

        this.locale.utilityAccountText = 
            NP.lib.core.Security.hasPermission(6095) ?
                'Enter a valid account number and/or meter number' :
                'Select a utility account'
        ;

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
                items: fields
            }
        ];

        if (this.section == 'exception') {
            this.tbar = [
                {xtype: 'button', itemId: this.ids.buttonReturn,  text: 'Cancel'},

                {xtype: 'tbspacer', width: 20},

                {xtype: 'button', itemId: this.ids.buttonPrev,  text: this.locale.buttonPrev},
                {xtype: 'button', itemId: this.ids.buttonNext,  text: this.locale.buttonNext},

                {xtype: 'tbspacer', width: 20},

                {xtype: 'button', itemId: this.ids.buttonSaveAndNext,      text: this.locale.buttonSaveAndNext},
                {xtype: 'button', itemId: 'buttonIndexingComplete',      text: 'Indexing Complete and Next'}
            ];
        } else {
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
                {xtype: 'button', itemId: this.ids.buttonInvoice, text: this.locale.buttonInvoice}
            ];
        }
        
        
        this.callParent(arguments);
        this.onDocumentTypeChange();
    },

    getCurrentDoctype: function() {
        return Ext.ComponentQuery.query('[name="Image_Doctype_Id"]')[0].getValue();
    },
    getCurrentIntegrationPackage: function() {
        return Ext.ComponentQuery.query('[itemId="field-integration-package"]')[0].getValue();
    },

    /***************************************************************************
     * Seciton: Base
     **************************************************************************/
    markupBase: function(storeDoctypes, storeIntegrationPackages) {
        var doctype = 
            storeDoctypes.totalCount && 
            storeDoctypes.data.keys[0]
        ;
        var integrationPackage = 
            storeIntegrationPackages.totalCount && 
            storeIntegrationPackages.data.keys[0]
        ;
        return [
            // Document type
            {
                name: 'Image_Doctype_Id',

                xtype: 'customcombo',
                fieldLabel: 'Document Type:',

                store: storeDoctypes,
                valueField:   'image_doctype_id',
                displayField: 'image_doctype_name',

                listeners: {
                    select: this.onDocumentTypeChange.bind(this)
                },
                value: doctype
            },
            // Image name
            {
                name: 'Image_Index_Name',

                xtype: 'textfield',
                fieldLabel: 'Image Name:'
            },
            // Integration Package
            {
                itemId: 'field-integration-package',

                xtype: 'customcombo',
                fieldLabel: 'Integration Package:',

                store: storeIntegrationPackages,
                valueField:   'integration_package_id',
                displayField: 'integration_package_name',

                listeners: {
                    select: this.onIntegrationPackageChange
                },
                value: integrationPackage
            },
        ] 
    },
    loadStoresBase: function(callback) {
        var storeDoctypes = 
            Ext.create('NP.store.images.ImageDocTypes',{
                service    : 'ImageService',
                action     : 'listDocTypes'
            }
        );
        var storeIntegrationPackages =
            Ext.create('NP.store.images.IntegrationPackages', {
                service    : 'ImageService',
                action     : 'listIntegrationPackages'
            }
        );

        storeDoctypes.load(function(records, operation, success) {
            storeIntegrationPackages.load(function(records, operation, success) {
                callback && callback(storeDoctypes, storeIntegrationPackages);
            });
        });
    },

    onDocumentTypeChange: function(combo, records) {
        //function changeIndexValues()
        //var form = this.up('boundform');

        var title = 
            (combo && records) ?
                records[0]['data'][combo['displayField']]:
                'Invoice'
        ;
        title = title.replace(' ', '');

        this['display' + title] && this['display' + title]();
    },

    onIntegrationPackageChange: function(combo, records) {
        /*
            RELOAD FORM WITH CORRECT DATA
            var integration_package_id = $(this).val();
            var $form = $('##intPkgForm');
            $('<input type="hidden" name="integration_package_id" value="'+integration_package_id+'" />').appendTo($form);

            $form.submit();
        */
    },

    display: function(fields) {
        for (var key in fields) {
            var field = Ext.ComponentQuery.query(
                '[itemId~="' + key + '"]'
            )[0];
            fields[key] ? field.show() : field.hide();
        }
        
    },
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
            'panel-property-and-neededby': true
        };

        this.display(fields);
    },
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
            'panel-property-and-neededby': false
        };
        this.display(fields);
    },
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
            'panel-property-and-neededby': false
        };
        this.display(fields);
    },
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
            'panel-property-and-neededby': false
        };
        this.display(fields);
    },

    //markup - методы для подготовки items
    //display - методы для отображения/скрывания items
    /***************************************************************************
     * SECTION: UTILITY
     **************************************************************************/
    markupUtility: function() {
        if (NP.lib.core.Security.hasPermission(6094)) {
            if (NP.lib.core.Security.hasPermission(6095)) {
                var options = {
                    xtype: 'panel',

                    border: 0,
                    layout: 'form',

                    items: [
                        // Account Number
                        {
                            name: 'utilityaccount_accountnumber',

                            xtype: 'textfield',
                            fieldLabel: 'Account Number:',

                            listeners: {
                                change: this.checkUtilityAccountNumber.bind(this)
                            }
                        },
                        // utilAccountValidPanel
                        {
                            name: 'panel-utility-account-valid',
                            border: 0
                        },
                        // Meter Number
                        {
                            name: 'utilityaccount_metersize',

                            xtype: 'textfield',
                            fieldLabel: 'Meter Number:',

                            listeners: {
                                change: this.checkMeterNumber.bind(this)
                                /*keyup: function() {
                                    //onKeyUp="changeMeterNumber(event);" 
                                }*/
                            }
                        },
                        // utilMeterValidPanel
                        {
                            name: 'panel-utility-metersize-valid',
                            border: 0
                        },
                    ]
                }
            } else {
                var storeAccountNumber =
                    Ext.create('NP.store.images.AccountNumbers', {
                        service    : 'ImageService',
                        action     : 'listAccountNumbers',
                        extraParams : {
                            'userprofile_id': NP.Security.getUser().get('userprofile_id'),
                            'delegation_to_userprofile_id': NP.Security.getUser().get('delegation_to_userprofile_id')
                        }
                    }
                );
                storeAccountNumber.load();

                var storeMeterSize =
                    Ext.create('NP.store.images.MeterSizes', {
                        service    : 'ImageService',
                        action     : 'listMeterSizes',
                        extraParams :{
                            account: 1
                            //account: 1
                        }
//                        fields: ['utilityaccount_metersize'],
//                        data: [{ "utilityaccount_metersize": "4"}]
                    }
                );
                storeMeterSize.load();

                options = {
                    xtype: 'panel',

                    border: 0,
                    layout: 'form',

                    items: [
                        // Account Number
                        {
                            name: 'utilityaccount_accountnumber',

                            xtype: 'customcombo',
                            fieldLabel: 'Account Number:',

                            store: storeAccountNumber,
                            //valueField:   'integration_package_id',
                            //displayField: 'integration_package_name',
                            //query = "qUtilAccounts"  value="#qUtilAccounts.utilityaccount_accountnumber#" 
                            //text=#qUtilAccounts.utilityAccount_accountNumber# <cfif qUtilAccounts.utilityaccount_accountnumber EQ get_current_image.utilityaccount_accountnumber> 
                            //selected="true"</cfif>

                            addBlankRecord: true,

                            listeners: {
                                select: this.onIntegrationPackageChange //checkAccountNumber();
                            }
                        },
                        // Meter Number
                        {
                            name: 'utilityaccount_metersize',

                            xtype: 'customcombo',
                            fieldLabel: 'Meter Number:',

                            store: storeMeterSize,
                            // LOOK TO THE STORE
                            //valueField:   'integration_package_id',
                            //displayField: 'integration_package_name',
                            //if get_current_image.utilityaccount_id then show select
                            //query="qMeterNumbers" value="#qMeterNumbers.utilityaccount_metersize#" 
                            //text=#qMeterNumbers.utilityaccount_metersize# <cfif qMeterNumbers.utilityaccount_metersize EQ get_current_image.utilityaccount_metersize> 
                            //selected="true"</cfif>

                            addBlankRecord: true,

                            listeners: {
                                select: this.onIntegrationPackageChange //reloadUtilityAccounts();
                            }
                        },
                    ]
                };
            }

            var items = [
                options,

                // Utility Account
                {
                    itemId: 'field-utility-account',
                    name:'panel-utility-account',  //'utilaccount_show_panel'
                    //xtype: 'textfield',
                    xtype: 'text',
                    html:'<b>Utility Account:</b> <em>' + this.locale.utilityAccountText + '</em>'
                    
/*
STORE FOR IT                var storeMeterSize =
                    Ext.create('NP.store.images.AccountNumbers', {
                        service    : 'ImageService',
                        action     : 'listAccountNumber2',
                        extraParams :{
                            'userprofile_id': NP.Security.getUser().get('userprofile_id'),
                            'delegation_to_userprofile_id': NP.Security.getUser().get('delegation_to_userprofile_id')
                        }
                    }
                );
                storeMeterSize.load();

/*
 
                    <cfif isNumeric(get_current_image.utilityaccount_id)>
                        <cfif qUtilityAccounts.recordcount GT 1>
                            <select id="utilityaccount_id" name="utilityaccount_id" onchange="changeUtilityAccountId(this);">
                                <cfloop query="qUtilityAccounts">
                                    <option value="#qUtilityAccounts.utilityaccount_id#,#qUtilityAccounts.property_id#,#qUtilityAccounts.vendorsite_id#"<cfif qUtilityAccounts.utilityaccount_id EQ get_current_image.utilityaccount_id> selected="true"</cfif>>#qUtilityAccounts.utilityaccount_name#</option>
                                </cfloop>
                            </select>
                        <cfelse>
                            #qUtilityAccounts.utilityaccount_name#
                            <input type="hidden" id="utilityaccount_id" name="utilityaccount_id" value="#qUtilityAccounts.utilityaccount_id#" />
                        </cfif>
                    <cfelse>
                        <em>#utilityAccountText#</em>
                    </cfif>
*/
                },

                // Utility Property Id
                {
                    name: 'utility_property_id',
                    xtype: 'hiddenfield'
                    //value="<cfif isNumeric(get_current_image.utilityaccount_id)>#get_current_image.property_id#</cfif>"
                },
                // Utility Vendorsite Id
                {
                    name: 'utility_vendorsite_id',
                    xtype: 'hiddenfield'
                    //<cfif isNumeric(get_current_image.utilityaccount_id)>#get_current_image.image_index_VendorSite_Id#</cfif>
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
        //hasUtilityInvoiceRights = 6094
        //hasManualUtilityAccountReq = 6095
        //NP.lib.core.Security.hasPermission(module_id)
        //this.checkUtilityAccountNumber();
    },

    checkAccountNumber: function(callback) {
        //if ( $('##utilityaccount_metersize option').length ) $('##utilityaccount_metersize').val('');
        var mask = new Ext.LoadMask(this);
        mask.show();

        this.reloadUtilityAccounts(function(data, isAccountValid, isMetersizeValid) {
            var account = Ext.ComponentQuery.query(
                '[name="utilityaccount_accountnumber"]'
            )[0];
            this.selectUtilityAccount(account.getValue(), isAccountValid, isMetersizeValid);

            mask.destroy();
            callback && callback(data);
        })
    },

//    checkUtilityAccountNumber: function(callback) {
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
        } else if (account.getXType() == 'textfield') {
            this.checkAccountNumber(callback);
        } else {
            callback && callback({
                accountNumberValid: true
            });
        }
    },

    checkMeterNumber: function(callback) {
        var metersize = Ext.ComponentQuery.query(
            '[name="utilityaccount_metersize"]'
        )[0];
        var metersizeValid = Ext.ComponentQuery.query(
            '[name="panel-utility-metersize-valid"]'
        )[0];

        if (metersize.getValue() == '') {
            metersizeValid.update('');
            if (metersize.getXType() == 'textfield') {
                this.checkAccountNumber(callback);
            } else {
                callback && callback({
                    meterValid: true
                });
            }
        } else if (metersize.getXType() == 'textfield') {
            this.checkAccountNumber(callback);
        } else {
            callback && callback({
                meterValid: true
            });
        }
    },

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

    changeUtilityAccountId: function(field) {
        //var val = $(field).val().split(',');
        //var property_id = val[1];
        //var vendorsite_id = val[2];
        //$('##utility_property_id').val(property_id);
        //$('##utility_vendorsite_id').val(vendorsite_id);
    },

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

        var utilityPropertyId = Ext.ComponentQuery.query(
            '[name="utility_property_id"]'
        )[0];
        var utilityVendorsiteId = Ext.ComponentQuery.query(
            '[name="utility_vendorsite_id"]'
        )[0];

        var panelUtilityAccount = Ext.ComponentQuery.query(
            '[name="panel-utility-account"]'
        )[0];

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
                        accountValid.update('<span style="color:#009900;">Valid account number</span>');

                        if (data.meterValid) {
                            if (data.accounts.length == 1) {
                                utilityPropertyId.setValue(
                                    data.accounts[0].property_id
                                );
                                utilityVendorsiteId.setValue(
                                    data.accounts[0].vendorsite_id
                                );
                                panelUtilityAccount.update(
                                    data.accounts[0].utilityaccount_name + 
                                    '<input type="hidden" id="utilityaccount_id" name="utilityaccount_id" value="' +
                                        data.accounts[0].utilityaccount_id + ',' +
                                        data.accounts[0].property_id + ',' +
                                        data.accounts[0].vendorsite_id +
                                    '">'
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
                                panelUtilityAccount.update('<b>Utility Account:</b> ' + html);
                            }
                        }
                    } else {
                        accountValid.update('<span style="color:#CC0000;">Invalid account number</span>');
                    }

                    if (metersize.getValue() == '') {
                        metersizeValid.update('');
                    } else {
                        data.meterValid ?
                            metersizeValid.update('<span style="color:#009900;">Valid meter number</span>') :
                            metersizeValid.update('<span style="color:#CC0000;">Invalid meter number</span>')
                    }

                    callback && callback.apply(
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

    /***************************************************************************
     * Section: Property Code
     **************************************************************************/
    markupPropertyCode: function() {
        var storePropertyCodes =
            Ext.create('NP.store.property.Properties', {
                service    : 'ImageService',
                action     : 'listPropertyCode',
                extraParams: {
                    'userprofile_id': NP.Security.getUser().get('userprofile_id'),
                    'delegation_to_userprofile_id': NP.Security.getUser().get('delegation_to_userprofile_id')
                }
            }
        );
        storePropertyCodes.load();

        return [
            // Property code
            {
                itemId: 'field-property-code',
                //name: '' $request['property_alt_id'] = $_REQUEST['field-property-code-inputEl'];

                name: 'property_id_alt',
                xtype: 'customcombo',
                fieldLabel: 'Property Code:',

                addBlankRecord: true,

                displayField: 'property_id_alt',
                valueField:   'property_id',

                store: storePropertyCodes,

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
     * SECTION: VENDOR CODE
     **************************************************************************/
    markupVendorCode: function() {
        var storeVendorCodes =
            Ext.create('NP.store.vendor.Vendors', {
                service    : 'ImageService',
                action     : 'listVendorCode',
                extraParams: {
                    'userprofile_id': NP.Security.getUser().get('userprofile_id'),
                    'delegation_to_userprofile_id': NP.Security.getUser().get('delegation_to_userprofile_id')
                }
            }
        );
        storeVendorCodes.load();

        return [
            //Vendor code
            {
                itemId: 'field-vendor-code',
                //name            $request['invoiceimage_vendorsite_alt_id'] = $_REQUEST['field-vendor-code-inputEl'];
                xtype: 'customcombo',
                fieldLabel: 'Vendor Code:',

                name: 'invoiceimage_vendorsite_alt_id',

                displayField: 'vendor_id_alt',
                valueField:   'vendorsite_id',
                addBlankRecord: true,

                store: storeVendorCodes,

                listeners: {
                    select: function(combo, records) {
                        var value = combo.getValue();
                        var element = Ext.ComponentQuery.query('[name="invoiceimage_vendorsite_id"]')[0];
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
     * SECTION: PROPERTY NAME
     **************************************************************************/
    markupPropertyName: function() {
        var storePropertyNames =
            Ext.create('NP.store.property.Properties', {
                service    : 'ImageService',
                action     : 'listProperty',
                extraParams: {
                    'userprofile_id': NP.Security.getUser().get('userprofile_id'),
                    'delegation_to_userprofile_id': NP.Security.getUser().get('delegation_to_userprofile_id')
                }
            }
        );
        storePropertyNames.load();

        return [
            // Property
            {
                itemId: 'field-property-name',

                name: 'Property_id',
                xtype: 'combobox',
                fieldLabel: 'Property:',

                addBlankRecord: true,

                displayField: 'property_name',
                valueField:   'property_id',

                store: storePropertyNames,

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
     * SECTION: VENDOR NAME
     **************************************************************************/
    markupVendorName: function() {
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

        return [
            // Vendor
            {
                itemId: 'field-vendor-name',
                //name: $request['invoiceimage_vendorsite_id'] = $_REQUEST['field-vendor-inputEl'];
                xtype: 'customcombo',
                fieldLabel: 'Vendor:',
                addBlankRecord: true,

                name: 'invoiceimage_vendorsite_id',

                displayField: 'vendor_name',
                valueField:   'vendorsite_id',

                store: storeVendorNames,

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
     * SECTION: VENDOR NAME
     **************************************************************************/
    markupAddresses: function() {
        var self = this;
        return [
            {
                xtype: 'button',
                text: 'Property Address',
                listeners: {
                    click: function() {
                        var id = Ext.ComponentQuery.query(
                            '[itemId="field-property-name"]'
                        )[0].getValue();

                        self.showAddressWindow.apply(self, [id, 'home', 'property', 'Property Address']);
                    }
                }
            },
            {
                xtype: 'button',
                text: 'Vendor Address',
                listeners: {
                    click: function() {
                        var id = Ext.ComponentQuery.query(
                            '[itemId="field-vendor-name"]'
                        )[0].getValue();

                        self.showAddressWindow.apply(self, [id, 'mailing', 'vendorsite', 'Vendor Address'])
                    }
                }
            }
        ];
    },
    
    /***************************************************************************
     * Section: Invoice number
     **************************************************************************/
    markupInvoiceNumber: function() {
        return [
            // Invoice number
            {
                itemId: 'field-invoice-number',
                //name $request['invoiceimage_ref']
                name: 'invoiceimage_ref',

                xtype: 'textfield',
                value: '97560',//value="#get_current_image.image_index_ref#" 
                fieldLabel: 'Invoice Number:'
            }
        ];
    },

    /***************************************************************************
     * Section: P0 number
     **************************************************************************/
    markupP0Number: function() {
        return [
            // P0 number
            {
                itemId: 'field-p0-number',
                name: 'po_ref',

                xtype: 'textfield',
                fieldLabel: 'P0 number:'
                //value="#get_current_image.image_index_ref#" 
            }
        ];
    },

    /***************************************************************************
     * Section: Invoice dates
     **************************************************************************/
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
                        name: 'Image_Index_Invoice_Date',
                        //name: 'image_index_invoice_date',
                        //name             $request['invoiceimage_invoice_date'] = $_REQUEST['field-invoice-date-inputEl'];
                        xtype: 'datefield',
                        fieldLabel: 'Invoice Date:'
                        //maxValue: new Date()
                        //onchange="changed_vendor($('##vendorname'))"
                        //field_name="invoiceimage_invoice_date" 
                        //form_name="quickform" 
                        //date_select="#get_current_image.image_index_invoice_date#">
                        //onchange="changed_vendor($('##vendorname'))" required
                        //id="invoice_date_index_value"
                    },
                    // Invoice due date
                    {
                        id: 'field-due-date',
                        name: 'Image_Index_Due_Date',
                        //name $request['invoiceimage_invoice_duedate'] = $_REQUEST['field-due-date-inputEl'];
                        xtype: 'datefield',
                        //labelWidth: widthLabel,
                        fieldLabel: 'Invoice Due Date:'
                        //id="invoice_duedate_index_value"
                        //field_name="invoiceimage_invoice_duedate" 
                        //form_name="quickform" 
                        //size="10" 
                        //date_select="#get_current_image.image_index_due_date#">
                    }
                ]
            }
        ];
    },

    /***************************************************************************
     * Section: Amount
     **************************************************************************/
    markupAmount: function() {
        return [
            // Amount
            {
                name: 'Image_Index_Amount',
                xtype: 'textfield',
                //value="#get_current_image.image_index_amount#"
                fieldLabel: 'Amount:'
            },
        ]
    },

    /***************************************************************************
     * Section: Utility 2
     **************************************************************************/
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
                        //labelWidth: widthLabel,
                        fieldLabel: 'Cycle From Date:'
//						required="false" 
//						title="" 
//						field_name="cycle_from" 
//						form_name="quickform" 
//						size="10" 
//						date_select="#get_current_image.cycle_from#">
                        
                    },
                    // Cycle To Date
                    {
                        name: 'cycle_to',
                        xtype: 'datefield',
                        //labelWidth: widthLabel,
                        fieldLabel: 'Cycle To Date:'
//						field_name="cycle_to"
//						required="false" 
//						title="" 
//						form_name="quickform" 
//						size="10" 
//						date_select="#get_current_image.cycle_to#">
                    },
                ]
            }
        ];
    },

    /***************************************************************************
     * Section: Template
     **************************************************************************/
    markupTemplate: function() {
        return [
            
        ];
    },

    /***************************************************************************
     * Section: Remit advice
     **************************************************************************/
    markupRemitAdvice: function() {
        return [
            
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
     * Section: Priority and Needed By Panel
     **************************************************************************/
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
                        //id: 'field-needed-by',
                        name: 'image_index_NeededBy_datetm',
                        xtype: 'datefield',
                        fieldLabel: 'Needed By:'
//				required="no" 
//				title="" 
//				field_name="neededby_datetm" 
//				form_name="quickform" 
//				size="10" 
//				date_select="#get_current_image.neededby_datetm#"
                        
                    },
                    // Priority
                    {
                        //id: 'field-priority-invoice',
                        xtype: 'combobox',
                        fieldLabel: 'Priority:',

                        name: 'PriorityFlag_ID_Alt_invoice',

                        displayField: 'title',
                        valueField:   'value'
/*
				<cfif not ListFind(client.module_id,6007)><!--- invoice priority flag module rights dictate who can edit  --->
                                    <input type="Hidden" name="PriorityFlag_ID_Alt_invoice" value="#variables.PriorityFlag_ID_Alt_invoice#">
                                    <select name="" disabled>
                                        <option>#variables.PriorityFlag_Display_invoice#
                                    </select>
				<cfelse>
                                    <select name="PriorityFlag_ID_Alt_invoice">
                                        <cfloop query="GetPriorityFlag">
                                            <option value="#PriorityFlag_ID_Alt#"<cfif GetPriorityFlag.PriorityFlag_ID_Alt EQ variables.PriorityFlag_ID_Alt_invoice> selected</cfif>>#PriorityFlag_Display#
					</cfloop>
                                    </select>
				</cfif>

 */
/*
                        store: {
                            fields: ['title', 'value'],
                            data : [
                                {"title":"High", "value":"Invoice"},
                                {"title":"Low", "value":"Yardi"},
                            ]                            
                        }
*/
                    }/*,
                    {
                        xtype: 'customcombo',
                        fieldLabel: 'Priority:',
                        
                        name: 'PriorityFlag_ID_Alt_po'
                    },
                    {
                        xtype: 'customcombo',
                        fieldLabel: 'Priority:',
                        
                        name: 'PriorityFlag_ID_Alt_vef'
                    }*/
                ]
            }
        ];
    },

    /***************************************************************************
     * Section: Action Buttons Panel
     **************************************************************************/
    markupActionButtonsCommon: function() {
        return [
            {
                xtype: 'button',
                text: 'Save and Next',
                itemId: 'buttonSaveAndNextAction',
                //<a href="javascript:submit_form('next')">
                listeners: {
                    //click: this.showAddressWindow.bind(this, 1, 'home', 'property', 'Property Address')
                }
            },
        ];
    },

    /***************************************************************************
     * Section: Action Buttons Panel
     **************************************************************************/
    markupActionButtonsSpecific: function() {
        // Эта панель появляется только, если top_tab равен Scanned и не равен Exception
        // ВЕРХНЯЯ ПАНЕЛЬ КНОПОК ТОЖЕ ОТЛИЧАЕТСЯ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        if (this.section == 'exception') {
            return [];
        }
        return [
            {
                itemId: 'panel-action-buttons-specific', 
//
                xtype: 'panel',

                border: 0,
                layout: 'form',

                items: [
                    {
                        xtype: 'button',
                        text: 'Save as Exception',
                        itemId: 'buttonSaveAsExceptionAction',
                        //<a href="javascript:submit_form('mark_as_exception')">
                        listeners: {
                            //click: this.showAddressWindow.bind(this, 1, 'home', 'property', 'Property Address')
                        }
                    },
                    {
//Эта кнопка показывается когда <cfif variables.optional_img_convert_on EQ 0 AND StructKeyExists(request, "selected_image_ids")>
                        //itemId: 'buttonCreateInvoice',
                        xtype: 'button',
                        text: 'Create Invoice',
                        itemId: 'buttonInvoiceAction',
                        //<a href="javascript:submit_form('invoice')">
                        listeners: {
                            //click: this.showAddressWindow.bind(this, 1, 'home', 'property', 'Property Address')
                        }
                    }
                ]
            }
        ];
    },

    /***************************************************************************
     * Section: Exception
     **************************************************************************/
    markupExceptionReason: function() {
        return [
            // Exception Reason
            {
                id: 'field-exception-reason',
                name: 'Image_Index_Exception_reason',
                xtype: 'textarea',
                //labelWidth: widthLabel,
                fieldLabel: 'Exception Reason:'
                //value   #get_current_image.Image_Index_Exception_reason#
            }
        ];
    },

    /***************************************************************************
     * Common methods
     **************************************************************************/
    setIntegrationPackage: function() {
        var select = Ext.ComponentQuery.query(
            '[itemId="field-integration-package"]'
        )[0];

        // Reload stores
        var params = {
            integration_package: select.getValue(),

            userprofile_id: NP.Security.getUser().get('userprofile_id'),
            delegation_to_userprofile_id: NP.Security.getUser().get('delegation_to_userprofile_id')
        };

        Ext.ComponentQuery.query(
            '[name="Property_Alt_Id"]'
        )[0]
            .getStore()
            .load({params: params})
        ;

        Ext.ComponentQuery.query(
            '[name="invoiceimage_vendorsite_alt_id"]'
        )[0]
            .getStore()
            .load({params: params})
        ;

        Ext.ComponentQuery.query(
            '[itemId="field-property-name"]'
        )[0]
            .getStore()
            .load({params: params})
        ;

        Ext.ComponentQuery.query(
            '[name="invoiceimage_vendorsite_id"]'
        )[0]
            .getStore()
            .load({params: params})
        ;
    },

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