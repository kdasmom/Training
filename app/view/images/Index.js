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
        /*
        var fields = [
            //Property code
            {
                id: 'field-property-code',
                //name: '' $request['property_alt_id'] = $_REQUEST['field-property-code-inputEl'];
                name: 'Property_Alt_Id',
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
                //name: 'Image_Index_Invoice_Date',
                name: 'image_index_invoice_date',
                //name             $request['invoiceimage_invoice_date'] = $_REQUEST['field-invoice-date-inputEl'];
                xtype: 'datefield',
                fieldLabel: 'Invoice Date:',
                maxValue: new Date()
            },
            // Invoice due date
            {
                id: 'field-due-date',
                name: 'Image_Index_Due_Date',
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
                //id: 'field-amount',
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
        ];

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

        this.id = 'panel-index';
        this.layout = 'border';
        var fields = [];
        fields = fields.concat(
            this.markupBase(), 
            this.markupUtility(),
            this.markupPropertyIndex(),
            this.markupVendorCode(),
            this.markupPropertyName(),
            this.markupVendorName()
        )



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

        //this.onDocumentTypeChange();
        // invoiceimage_name: validation =  alphaNumericFilter(this.value, #variables.AlphaNumericPattern#)
        // integration_package_id
    },



    /***************************************************************************
     * SECTION: BASE
     **************************************************************************/
    markupBase: function() {
        var storeDoctypes = 
            Ext.create('NP.store.images.ImageDocTypes',{
                service    : 'ImageService',
                action     : 'listDocTypes'
            }
        );
        storeDoctypes.load();

        var storeIntegrationPackages =
            Ext.create('NP.store.images.IntegrationPackages', {
                service    : 'ImageService',
                action     : 'listIntegrationPackages'
            }
        );
        storeIntegrationPackages.load();

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
                    select: this.onDocumentTypeChange
                }
            },
            // Image name
            {
                name: 'Image_Index_Name',

                xtype: 'textfield',
                fieldLabel: 'Image Name:'
                //this.value=alphaNumericFilter(this.value, #variables.AlphaNumericPattern#)
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
                }
            },
        ] 
    },

    onDocumentTypeChange: function(combo, records) {
        //function changeIndexValues()
        var form = this.up('boundform');

        var title = 
            (combo && records) ?
                records[0]['data'][combo['displayField']]:
                'Invoice'
        ;
        title = title.replace(' ', '');

        form['display' + title] && form['display' + title]();
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
            'panel-utility'             : false
        };

        this.display(fields);
    },
    displayUtilityInvoice: function() {
        var fields = {
            'field-integration-package' : false,
            'panel-utility'             : true
        };
        this.display(fields);
    },
    displayPurchaseOrder: function() {
        var fields = {
            'field-integration-package' : true,
            'panel-utility'             : false
        };
        this.display(fields);
    },
    displayReceipt: function() {
        var fields = {
            'field-integration-package' : true,
            'panel-utility'             : false
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
                                keyup: function() {
                                    // _tmp05.js
                                }
                            }
                            //value="#htmlEditFormat(get_current_image.utilityaccount_accountnumber)#" 
                        },
                        // utilAccountValidPanel
                        {
                            name: 'panel-utility-account-valid',
                            html: 'isvalid' //<cfif isNumeric(get_current_image.utilityaccount_id)> <span style="color:##009900;">Valid account number</span> </cfif>
                        },
                        // Meter Number
                        {
                            name: 'utilityaccount_metersize',

                            xtype: 'textfield',
                            fieldLabel: 'Meter Number:',

                            listeners: {
                                keyup: function() {
                                    //onKeyUp="changeMeterNumber(event);" 
                                }
                            }
                            //value="#htmlEditFormat(get_current_image.utilityaccount_metersize)#" 
                        },
                        // utilMeterValidPanel
                        {
                            name: 'panel-utility-metersize-valid',
                            html: 'isvalid' //<cfif len(get_current_image.utilityaccount_metersize)><span style="color:##009900;">Valid meter number</span></cfif>
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
                    xtype: 'textfield',
                    fieldLabel: 'Utility Account:'
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
        this.checkUtilityAccountNumber();
    },

    checkAccountNumber: function(callback) {
        //if ( $('##utilityaccount_metersize option').length ) $('##utilityaccount_metersize').val('');
        this.reloadUtilityAccounts(function(data, isAccountValid, isMetersizeValid) {
            var account = Ext.ComponentQuery.query(
                '[name="utilityaccount_accountnumber"]'
            )[0];
            this.selectUtilityAccount(account.getValue(), isAccountValid, isMetersizeValid);

            callback && callback(data);
        })
    },

    checkUtilityAccountNumber: function(callback) {
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

    selectUtilityAccount: function(account, isAccountValid, isMetersizeValid) {
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

        //var utilityaccount_accountnumber = (arguments.length == 1) ? arguments[0] : $('##utilityaccount_accountnumber').val();
        if (!isAccountValid || !isMetersizeValid && true || false) { // true = $('##utilityaccount_metersize option').length == 0
            //false = utilityaccount_accountnumber == ''
            utilityPropertyId.setValue('');
            utilityVendorsiteId.setValue('');
            panelUtilityAccount.update('<em>#utilityAccountText#</em>')

            if (isAccountValid && true) {//true = $('##utilityaccount_metersize option').length
                metersize.update('<option value=""></option>');
            }
        } else if (true) {//$('##utilityaccount_metersize option').length
            NP.lib.core.Net.remoteCall({
                requests: {
                    service: 'ImageService',
                    action : 'getUtilityAccountVendorPropMeter',

                    utilityaccount_accountnumber: metersize.getValue(),

                    success: function(data) {
                        metersize.update('<option value=""></option>');
                        for (var i = 0, l = data.meters; i < l; i++) {
                            // Remove the string we added at the end of the meter to force string conversion
                            var fixedval = data.meters[i].replace('|@|', '');
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

        NP.lib.core.Net.remoteCall({
            requests: {
                service: 'ImageService',
                action : 'matchUtilityAccount',

                userprofile_id: NP.Security.getUser().get('userprofile_id'),
                delegation_to_userprofile_id: NP.Security.getUser().get('delegation_to_userprofile_id'),

                utilityaccount_metersize: account.getValue(),
                utilityaccount_accountnumber: metersize.getValue(),

                success: function(data) {
                    if (data.accountNumberValid) {
                        accountValid.update('<span style="color:##009900;">Valid account number</span>');

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
                                panelUtilityAccount.update(html);
                            }
                        }
                    } else {
                        accountValid.update('<span style="color:##CC0000;">Invalid account number</span>');
                    }

                    if (metersize.getValue() == '') {
                        metersizeValid.update('');
                    } else {
                        data.meterValid ?
                            metersizeValid.update('<span style="color:##009900;">Valid meter number</span>') :
                            metersizeValid.update('<span style="color:##CC0000;">Invalid meter number</span>')
                    }

                    callback && callback(
                        data, 
                        data.accountNumberValid, 
                        data.meterValid
                    );
                }
            }
        });
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

    /***************************************************************************
     * SECTION: PROPERTY INDEX
     **************************************************************************/
    markupPropertyIndex: function() {
        return [
        ];
    },
    
    /***************************************************************************
     * SECTION: VENDOR CODE
     **************************************************************************/
    markupVendorCode: function() {
        return [
        ];
    },
    
    /***************************************************************************
     * SECTION: PROPERTY NAME
     **************************************************************************/
    markupPropertyName: function() {
        return [
        ];
    },
    
    /***************************************************************************
     * SECTION: VENDOR NAME
     **************************************************************************/
    markupVendorName: function() {
        return [
        ];
    },
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
/*    onDocumentTypeChange: function(combo, records) {
        //id = doctype
        var visibility = {
            'Invoice': {

                'field-property-code': true,
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
                'field-property-code': false,
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
                'field-property-code': true,
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
                'field-property-code': true,
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
*/    
});

 	//change indexing values based on doctype chosen
/*	function changeIndexValues() {
		var myform = document.forms.quickform;
		priority_po.style.display = "none";
		priority_vef.style.display = "none";	
		priority_invoice.style.display = "none";
		neededby.style.display = "none";
		selectedDisplayText = document.getElementById('doctype').options[document.getElementById('doctype').selectedIndex].text;
		
		$('#createInvBtn').hide();
		if (myform.doctype.selectedIndex == 0)
			$('#createInvBtn').show();
		
		$('.utility_panel').hide();
		$('#int_pkg_panel').show();
		$('#vendor_code_panel').show();
		$('#vendor_name_panel').show();
		$('#property_index_value').show();
		$('#property_name_value').show();
		
		if (myform.doctype.selectedIndex == -1) {
		} else {
			if (myform.doctype.options[myform.doctype.selectedIndex].value == 1 || myform.doctype.options[myform.doctype.selectedIndex].value == 2 || myform.doctype.options[myform.doctype.selectedIndex].value == 3 || selectedDisplayText == 'Utility Invoice') {
				property_index_value.style.display = "block";
				property_name_value.style.display = "block";
				property_address_value.style.display = "block";
			} else {
				property_index_value.style.display = "none";
				property_name_value.style.display = "none";
				property_address_value.style.display = "none";
			}
			if (myform.doctype.options[myform.doctype.selectedIndex].value == 1 || myform.doctype.options[myform.doctype.selectedIndex].value == 2 || selectedDisplayText == 'Utility Invoice') {
				amount_index_value.style.display = "block";
			} else {
				amount_index_value.style.display = "none";
			}
			if (myform.doctype.options[myform.doctype.selectedIndex].value == 1) {
				invoice_ref_index_value.style.display = "block";
				invoice_date_index_value.style.display = "block";
				invoice_duedate_index_value.style.display = "block";
				use_template.style.display = "block";
				remit_advice_index_value.style.display = "block";
				custom_field_1.style.display = "block";
				custom_field_2.style.display = "block";
				custom_field_3.style.display = "block";		
				custom_field_4.style.display = "block";		
				custom_field_5.style.display = "block";		
				custom_field_6.style.display = "block";		
				custom_field_7.style.display = "block";		
				custom_field_8.style.display = "block";		
				priority_invoice.style.display = "block";
				neededby.style.display = "block";	
			} else {
				invoice_ref_index_value.style.display = "none";
				invoice_date_index_value.style.display = "none";
				invoice_duedate_index_value.style.display = "none";
				use_template.style.display = "none";
				remit_advice_index_value.style.display = "none";
				custom_field_1.style.display = "none";
				custom_field_2.style.display = "none";
				custom_field_3.style.display = "none";
				custom_field_4.style.display = "none";
				custom_field_5.style.display = "none";
				custom_field_6.style.display = "none";
				custom_field_7.style.display = "none";
				custom_field_8.style.display = "none";
			}
			
			if (myform.doctype.options[myform.doctype.selectedIndex].value == 2) {
				po_ref_index_value.style.display = "block";
			} else {
				po_ref_index_value.style.display = "none";
			}
			if (myform.doctype.options[myform.doctype.selectedIndex].value == 1 || myform.doctype.options[myform.doctype.selectedIndex].value == 2 || myform.doctype.options[myform.doctype.selectedIndex].value == 3 || myform.doctype.selectedIndex == -1 || selectedDisplayText == 'Utility Invoice') {
				myform.property_id.className = "required"; 
			} else {
				myform.property_id.className = "";
			}
			
			if (selectedDisplayText == 'Receipt'){
				amount_index_value.style.display = "block";
				property_index_value.style.display = "block";
				property_name_value.style.display = "block";
				property_address_value.style.display = "block";
			} else if (selectedDisplayText == 'Utility Invoice') {
				invoice_ref_index_value.style.display = "block";
				invoice_date_index_value.style.display = "block";
				invoice_duedate_index_value.style.display = "block";
				use_template.style.display = "block";
				remit_advice_index_value.style.display = "block";
				$('.utility_panel').show();
				$('#int_pkg_panel').hide();
				$('#vendor_code_panel').hide();
				$('#vendor_name_panel').hide();
				$('#property_index_value').hide();
				$('#property_name_value').hide();
			}
		}
	}*/