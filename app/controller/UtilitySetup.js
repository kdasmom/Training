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
        { ref: 'utilitySetupTab', selector: '[xtype="utilitysetup.utilitysetupform"]' },
        { ref: 'utilityAccountsTab', selector: '[xtype="utilitysetup.accountsgrid"]' }
    ],

//  for localization
    saveSuccessText      : 'Your changes were saved.',
    deleteDialogTitleText: 'Delete budget overage?',
    deleteDialogText     : 'Are you sure you want to delete this budget overage?',
    deleteSuccessText    : 'Budget overage successfully deleted',
    deleteFailureText    : 'There was an error deleting the budget overage. Please try again.',
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
                    that.application.addHistory('UtilitySetup:showAccountsGrid:' + data['Utility_Id']);
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
    showAccountsGrid: function(utility_id) {
        var that = this;

        var view = this.setView('NP.view.utilitySetup.VendorAccountsList');

        view.down('[xtype="shared.button.new"]').on('click', function() {
            that.application.addHistory('UtilitySetup:showAccountForm::' + utility_id);
        });

        var grid = view.query('customgrid')[0];
//
//
        var accountStore = Ext.create('NP.store.utility.UtilityAccounts', {
            service    : 'UtilityAccountService',
            action     : 'getAll',
            paging     : true,
            extraParams: {
                vendor_id       : null,
                property_id     : null,
                utilitytype_id  : null,
                glaccount_id    : null
            }
        });
//
        accountStore.load();
        grid.bindStore(accountStore);
    },

    /**
     * show account setup form
     *
     * @param account_id
     * @param utility_id
     */
    showAccountForm: function(account_id, utility_id) {
        var that = this;

        var viewCfg = {
            bind: {
                models: ['utility.UtilityAccount']
            },
            utility_id: utility_id
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
        if (!account_id) {
            form.getForm().reset();
            console.log('reset');
        }


        form.down('[xtype="shared.button.cancel"]').on('click', function() {
            that.application.addHistory('UtilitySetup:showAccountsGrid:' + utility_id);
        });
        form.down('[xtype="shared.button.save"]').on('click', function() {
            that.saveAccount(utility_id, false);
        });
        form.down('[xtype="shared.button.saveandadd"]').on('click', function() {
            that.saveAccount(utility_id, true);
        });

        if (utility_id) {

            var store = Ext.create('NP.store.utility.UtilityTypes', {
                service: 'UtilityTypeService',
                action: 'findByUtilityId',
                extraParams: {
                    utility_id: utility_id
                }
            });

            store.load();
            NP.lib.core.Net.remoteCall({
                requests: {
                    service    : 'UtilityService',
                    action     : 'get',
                    id      : utility_id,
                    success: function(result, deferred) {
                        form.findField('vendor_name').setValue(result['vendor_name']);
                    }
                }
            });
            form.findField('UtilityType_Id').bindStore(store);
        }
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

    saveAccount: function(utility_id, add) {
        var that = this;

        var form = this.getCmp('utilitysetup.accountform');
        var formValues = form.getValues();
        if (form.isValid()) {
            form.submitWithBindings({
                service: 'UtilityAccountService',
                action: 'save',
                extraParams: {
                    utility_id: utility_id
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
                        that.application.addHistory('UtilitySetup:showAccountsGrid:' + utility_id);
                    }
                }
            });

        }
    }
});
