/**
 * Created by rnixx on 9/23/13.
 */

Ext.define('NP.controller.UtilitySetup', {
    extend: 'NP.lib.core.AbstractController',

    requires: [
        'NP.lib.core.Net',
        'NP.lib.core.Config',
        'NP.lib.core.Util',
        'NP.lib.core.Security',
        'NP.model.utility.Utility'
    ],

    refs: [
        { ref: 'accountsGrid', selector: '[xtype="utilitysetup.vendoraccountslist"] customgrid' }
    ],

//  for localization
    saveSuccessText      : 'Your changes were saved.',
    deleteDialogTitleText: 'Delete utility account?',
    deleteDialogText     : 'Are you sure you want to delete this utility account?',
    deleteSuccessText    : 'Utility account successfully deleted',
    deleteFailureText    : 'There was an error deleting the utility account. Please try again.',
    errorDialogTitleText : 'Error',

    /**
     * Init
     */
    init: function(){
        Ext.log('Utility Setup Controller init');

        var app = this.application;

        this.control(
            {
                '[xtype="utilitysetup.vendorsgrid"] [xtype="shared.button.new"]': {
                    click: function() {
                        app.addHistory('UtilitySetup:showVendorForm');
                    }
                },
                '[xtype="utilitysetup.utilitysetupform"] [xtype="shared.button.save"]': {
                    click: this.saveUtility
                },
                '[xtype="utilitysetup.utilitysetupform"] [xtype="shared.button.cancel"]': {
                    click: function() {
                        app.addHistory('UtilitySetup:showVendorsGrid');
                    }
                },
                '[xtype="utilitysetup.vendorsgrid"]': {
                    itemclick: function(grid, rec) {
                        app.addHistory('UtilitySetup:showVendorForm:' + rec.get('vendor_id'));
                    }
                },
                '[xtype="utilitysetup.vendoraccountslist"] [xtype="shared.button.cancel"]': {
                    click: function() {
                        app.addHistory('UtilitySetup:showVendorsGrid');
                    }
                },
                '[xtype="utilitysetup.vendoraccountslist"] [xtype="shared.button.delete"]': {
                    click: this.deleteAccounts
                },
                '[xtype="utilitysetup.vendoraccountslist"] [xtype="customgrid"]': {
                    editrow: this.editRowGrid
                },
                '[xtype="utilitysetup.accountform"]': {
                    selectproperty: this.selectProperty
                }
            }
        );
    },

    /**
     *  Vendors grid
     */
    showVendorsGrid: function() {
        var grid = this.setView('NP.view.utilitySetup.VendorsGrid');
        grid.reloadFirstPage();
    },

    /**
     * Show utility setup form
     * @param vendor_id
     */
    showVendorForm: function(vendor_id) {
        var that = this;

        var viewCfg = { bind: { models: ['utility.Utility'] }};

        if (arguments.length) {
            Ext.apply(viewCfg.bind, {
                service    : 'UtilityService',
                action     : 'findByVendorId',
                extraParams: {
                    vendor_id: vendor_id
                },
                extraFields: ['utilitytypes', 'phone_number', 'phone_ext', 'person_firstname', 'person_middlename', 'person_lastname', 'vendor_id']
            });
        }

        var form = this.setView('NP.view.utilitySetup.UtilitySetupForm', viewCfg);

        if (arguments.length) {
            form.on('dataloaded', function(boundForm, data) {
                var data = data;
                form.down('[xtype="shared.button.view"]').show();
                form.down('[xtype="shared.button.view"]').on('click', function(){
                    that.application.addHistory('UtilitySetup:showAccountsGrid:' + data['Vendorsite_Id']);
                });

                var field = boundForm.findField('Vendorsite_Id');

                field.setDefaultRec(Ext.create('NP.model.vendor.Vendor', {
                    vendor_id    : data['vendor']['vendor_id'],
                    vendor_id_alt: data['vendor']['vendor_id_alt'],
                    vendor_name  : data['vendor']['vendor_name'],
                    vendorsite_id: data['vendor']['vendorsite_id']
                }));
                field.disable();
            });
        }
    },

    /**
     *  show utility accounts grid
     * @param utility_id
     */
    showAccountsGrid: function(vendorsite_Id) {
        var that = this;

        var view = this.setView('NP.view.utilitySetup.VendorAccountsList');

        var grid = view.query('customgrid')[0];
        grid.reloadFirstPage();

        view.down('[xtype="shared.button.new"]').on('click', function() {
            that.application.addHistory('UtilitySetup:showAccountForm::' + vendorsite_Id);
        });
    },

    /**
     * show account setup form
     *
     * @param account_id
     * @param utility_id
     */
    showAccountForm: function(account_id, vendorsite_Id) {
        var that = this;

        console.log('vendorsite: ', vendorsite_Id);


        var viewCfg = {
            bind: {
                models: ['utility.UtilityAccount']
            }
        };

        if (account_id) {
            Ext.apply(viewCfg.bind, {
                service    : 'UtilityAccountService',
                action     : 'get',
                extraParams: {
                    id: account_id
                }
            });
        }

        var form = this.setView('NP.view.utilitySetup.AccountForm', viewCfg);


        form.down('[xtype="shared.button.cancel"]').on('click', function() {
            that.application.addHistory('UtilitySetup:showAccountsGrid:' + vendorsite_Id);
        });
        form.down('[xtype="shared.button.save"]').on('click', function() {
            that.saveAccount(vendorsite_Id, false);
        });
        form.down('[xtype="shared.button.saveandadd"]').on('click', function() {
            that.saveAccount(vendorsite_Id, true);
        });

        if (vendorsite_Id != undefined) {
            NP.lib.core.Net.remoteCall({
                requests: {
                    service         : 'UtilityService',
                    action          : 'findByVendorsiteId',
                    vendorsite_id   : vendorsite_Id,
                    success: function(result, deferred) {
                        form.findField('vendor_name').setValue(result['vendor_name']);
                        that.findTypes(result.vendorsite_id, form);
                    }
                }
            });
        } else {
            NP.lib.core.Net.remoteCall({
                requests: {
                    service         : 'UtilityService',
                    action          : 'findByAccountId',
                    account_id      : account_id,
                    success: function(result, deferred) {
                        form.findField('vendor_name').setValue(result['vendor_name']);
                        that.findTypes(result.Vendorsite_Id, form);
                        form.findField('UtilityType_Id').setValue(result['UtilityType_Id']);
                        form.findField('vendorsite_id').setValue(result['Vendorsite_Id']);
                    }
                }
            });
        }
    },

    findTypes: function(vendorsite_id, form) {
        var store = Ext.create('NP.store.utility.UtilityTypes', {
            service: 'UtilityTypeService',
            action: 'findByVendorsiteId',
            extraParams: {
                vendorsite_id: vendorsite_id
            },
            extraFields:['Utility_Id']
        });

        store.load();
        form.findField('UtilityType_Id').bindStore(store);
    },

    saveUtility: function() {
        var that = this;

        var form = this.getCmp('utilitysetup.utilitysetupform');
        var formValues = form.getValues();
        if (form.isValid()) {
            form.submitWithBindings({
                service: 'UtilityService',
                action: 'saveUtility',
                extraParams: {
                    utilitytypes        : formValues['utilitytypes'],
                    person_firstname    : formValues['person_firstname'],
                    person_middlename   : formValues['person_middlename'],
                    person_lastname     : formValues['person_lastname'],
                    phone_number    : formValues['phone_number'],
                    phone_ext    : formValues['phone_ext']
                },
                success: function(result, deferred) {
                    NP.Util.showFadingWindow({ html: that.saveSuccessText });
                    that.application.addHistory('UtilitySetup:showVendorsGrid');
                }
            });
        }
    },

    selectProperty: function(combo, records, eOpts) {

        var property_id = combo.getValue();

        var unitStore = Ext.create('NP.store.property.Units', {
            service: 'UtilityAccountService',
            action: 'getUnits',
            extraParams: {
                property_id: property_id
            }
        });
        var glaccountStore = Ext.create('NP.store.gl.GlAccounts', {
            service: 'GLService',
            action: 'getByProperty',
            extraParams: {
                property_id: property_id
            }
        });

        unitStore.load();
        glaccountStore.load();

        var form = this.getCmp('utilitysetup.accountform');
        form.findField('unit_id').bindStore(unitStore);
        form.findField('glaccount_id').bindStore(glaccountStore);
    },

    saveAccount: function(vendorsite_Id, add) {
        var that = this;

        var form = this.getCmp('utilitysetup.accountform');
        var formValues = form.getValues();
        if (form.isValid()) {
            form.submitWithBindings({
                service: 'UtilityAccountService',
                action: 'save',
                extraParams: {
                    vendorsite_id: vendorsite_Id ? vendorsite_Id : formValues['vendorsite_id'],
                    type: formValues['UtilityType_Id']
                },
                success: function(result, deferred) {
                    NP.Util.showFadingWindow({ html: that.saveSuccessText });
                    if (add) {
                        form.findField('UtilityType_Id').clearValue();
                        form.findField('UtilityAccount_AccountNumber').setValue('');
                        form.findField('property_id').clearValue();
                        form.findField('unit_id').clearValue();
                        form.findField('UtilityAccount_MeterSize').setValue('');
                        form.findField('glaccount_id').clearValue();
                    } else {
                        that.application.addHistory('UtilitySetup:showAccountsGrid:' + vendorsite_Id);
                    }
                }
            });

        }
    },

    editRowGrid: function(grid, rec, rowIndex) {
        var that = this;

        var id = rec.internalId;

        that.application.addHistory('UtilitySetup:showAccountForm:' + id);
    },

    deleteAccounts: function() {
        var that = this;
        Ext.Msg.confirm(this.deleteDialogTitleText, this.deleteDialogText, function(buttonText) {
            if (buttonText == "yes") {
                var grid = that.getAccountsGrid();
                var accounts = grid.getSelectionModel().getSelection();

                var accounts_id = [];
                Ext.each(accounts, function(account) {
                    accounts_id.push(account.get('UtilityAccount_Id'));
                });

                NP.lib.core.Net.remoteCall({
                    requests: {
                        service         : 'UtilityAccountService',
                        action          : 'deleteUtilityAccount',
                        accounts        : accounts_id.join(','),
                        success: function(success, deferred) {
                            if (success) {
                                NP.Util.showFadingWindow({ html: that.deleteSuccessText });
                                Ext.each(accounts, function(account) {
                                    grid.getStore().remove(account);
                                });
                                grid.getView().refresh();
                            } else {
                                Ext.MessageBox.alert(that.errorDialogTitleText, that.deleteFailureText);
                            }
                        }
                    }
                });
            }
        });
    }
});
