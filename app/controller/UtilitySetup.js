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
                }/*,
                '[xtype="utilitysetup.vendoraccountslist"] [xtype="shared.button.new"]': {
                    click: function() {
                        var list = Ext.widget('utilitysetup.vendoraccountslist');
                        app.addHistory('UtilitySetup:showAccountForm');
                    }
                }*/
            }
        );
    },

    changeGridTab: function(tabPanel, newCard, oldCard, eOpts) {
        Ext.log('Catalog onTabChange() running');

        this.addHistory('UtilitySetup:show:' + newCard.type);
    },

    showVendorsGrid: function() {
        var grid = this.setView('NP.view.utilitySetup.VendorsGrid');
        grid.reloadFirstPage();
    },



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

    showAccountsGrid: function(utility_id) {
        var that = this;

        var view = this.setView('NP.view.utilitySetup.VendorAccountsList');
        view.down('[xtype="shared.button.new"]').on('click', function() {
            console.log('utilityId: ', utility_id);
            that.application.addHistory('UtilitySetup:showAccountForm::' + utility_id);
        });
    },

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
    }
});
