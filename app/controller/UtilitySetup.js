/**
 * Created by rnixx on 9/23/13.
 */

Ext.define('NP.controller.UtilitySetup', {
    extend: 'NP.lib.core.AbstractController',

    requires: [
        'NP.lib.core.Net',
        'NP.lib.core.Config',
        'NP.lib.core.Util',
        'NP.lib.core.Security'
    ],

    models: ['vendor.Utility','vendor.UtilityType','contact.Person','contact.Phone'],

    stores: ['vendor.UtilityTypes','property.Units','gl.GlAccounts','vendor.UtilityAccounts',
            'vendor.Vendors'],

    views: ['utilitySetup.UtilityGrid','utilitySetup.UtilitySetupForm','utilitySetup.AccountForm'],

    refs: [
        { ref: 'accountsGrid', selector: '[xtype="utilitysetup.utilityaccountlist"]' },
        { ref: 'utilityForm', selector: '[xtype="utilitysetup.utilitysetupform"]' },
        { ref: 'accountForm', selector: '[xtype="utilitysetup.accountform"]' }
    ],

    // for localization
    saveSuccessText         : 'Your changes were saved.',
    deleteDialogTitleText   : 'Delete utility account?',
    deleteDialogText        : 'Are you sure you want to delete this utility account?',
    deleteSuccessText       : 'Utility account successfully deleted',
    deleteFailureText       : 'There was an error deleting the utility account. Please try again.',
    errorDialogTitleText    : 'Error',
    removeUtilTypeTitleText : 'Remove Utility Type?',
    removeUtilTypeDialogText: 'You have removed a Utility Type. If you proceed with saving, any utility ' +
                                'account matching that type will also be removed. Are you sure you want ' +
                                'to proceed?',

    /**
     * Init
     */
    init: function(){
        Ext.log('Utility Setup Controller init');

        this.control(
            {
                '[xtype="utilitysetup.utilitygrid"] [xtype="shared.button.new"]': {
                    click: function() {
                        this.addHistory('UtilitySetup:showUtilForm');
                    }
                },
                '[xtype="utilitysetup.utilitysetupform"] [xtype="shared.button.save"]': {
                    click: this.saveUtility
                },
                '[xtype="utilitysetup.utilitysetupform"] [xtype="shared.button.cancel"]': {
                    click: function() {
                        this.addHistory('UtilitySetup:showUtilGrid');
                    }
                },
                '[xtype="utilitysetup.utilitygrid"]': {
                    itemclick: function(grid, rec) {
                        this.addHistory('UtilitySetup:showUtilForm:' + rec.get('vendor_id'));
                    }
                },
                '[xtype="utilitysetup.utilityaccountlist"] [xtype="shared.button.new"]': {
                    click: Ext.bind(this.onNewAccountClick, this)
                },
                '[xtype="utilitysetup.utilityaccountlist"] [xtype="shared.button.delete"]': {
                    click: this.deleteAccounts
                },
                '[xtype="utilitysetup.utilityaccountlist"]': {
                    itemclick: this.onUtilityAccountClick
                },
                '[xtype="utilitysetup.accountform"] [xtype="shared.button.cancel"]': {
                    click: function() {
                        this.addHistory('UtilitySetup:showUtilForm:' + this.activeVendorId);
                    }
                },
                '[xtype="utilitysetup.accountform"] [xtype="shared.propertycombo"]': {
                    select: Ext.bind(this.onSelectProperty, this)
                },
                '[xtype="utilitysetup.accountform"] [xtype="shared.button.save"]': {
                    click: function() {
                        this.saveAccount(this.activeVendorsiteId, false);
                    }
                },
                '[xtype="utilitysetup.accountform"] [xtype="shared.button.saveandadd"]': {
                    click: function() {
                        this.saveAccount(this.activeVendorsiteId, true);
                    }
                }
            }
        );
    },

    /**
     *  Vendors grid
     */
    showUtilGrid: function() {
        var grid = this.setView('NP.view.utilitySetup.UtilityGrid');
        grid.reloadFirstPage();
    },

    onNewAccountClick: function() {
        var me = this,
            vendorField = me.getUtilityForm().findField('Vendorsite_Id');

        me.addHistory('UtilitySetup:showAccountForm:' + vendorField.getValue());
    },

    /**
     * Show utility setup form
     * @param vendor_id
     */
    showUtilForm: function(vendor_id) {
        var that = this,
            forceView = (vendor_id && vendor_id != that.activeVendorId) ? true : false;

        that.activeVendorId = vendor_id;

        var viewCfg = { bind: { models: ['vendor.Utility','contact.Person','contact.Phone'] }};

        if (arguments.length) {
            Ext.apply(viewCfg.bind, {
                service    : 'UtilityService',
                action     : 'getByVendorId',
                extraParams: {
                    vendor_id: vendor_id
                },
                extraFields: ['utilitytypes']
            });
            Ext.apply(viewCfg, {
                listeners: {
                    dataloaded: function(boundForm, data) {
                        boundForm.setTitle('Edit ' + data['vendor_name']);

                        var vendorField = boundForm.findField('Vendorsite_Id');

                        vendorField.setDefaultRec(Ext.create('NP.model.vendor.Vendor', {
                            vendor_id    : data['vendor_id'],
                            vendor_id_alt: data['vendor_id_alt'],
                            vendor_name  : data['vendor_name'],
                            vendorsite_id: data['Vendorsite_Id']
                        }));

                        vendorField.disable();

                        that.getAccountsGrid().addExtraParams({ vendorsite_id: data['Vendorsite_Id'] });
                        that.getAccountsGrid().getStore().load();
                        that.getAccountsGrid().show();

                        boundForm.findField('glaccount_id').getStore().addExtraParams({
                            vendorsite_id: data['Vendorsite_Id']
                        });
                        that.getAccountsGrid().addExtraParams({ vendorsite_id: data['Vendorsite_Id'] });

                        that.utilitytypes = data['utilitytypes'];
                    }
                }
            });
        }

        var form = this.setView('NP.view.utilitySetup.UtilitySetupForm', viewCfg, '#contentPanel', forceView);
    },

    onUtilityAccountClick: function(gridView, rec, item, index, e) {
        if (e.getTarget().className != 'x-grid-row-checker') {
            this.addHistory('UtilitySetup:showAccountForm:' + rec.getUtility().get('Vendorsite_Id') + ':' + rec.get('UtilityAccount_Id'));
        }
    },

    onSelectProperty: function(combo, recs) {
        var me = this,
            glStore = me.getAccountForm().findField('glaccount_id').getStore();

        if (NP.Config.getSetting('CP.PROPERTYGLACCOUNT_USE', '0') == '1') {
            if (recs.length) {
                glStore.addExtraParams({ property_id: recs[0].get('property_id') });
                glStore.load();
            } else {
                glStore.removeAll();
            }
        }
    },

    saveUtility: function() {
        var that = this;

        var form = this.getUtilityForm();
        
        if (form.isValid()) {
            // Check if utility types were removed and warn the user
            var utilitytypes = form.findField('utilitytypes').getValue(),
                utilityRemoved = false;

            Ext.each(this.utilitytypes, function(utilitytype_id) {
                if (!Ext.Array.contains(utilitytypes, utilitytype_id)) {
                    utilityRemoved = true;
                    return false;
                }
            });

            function submitForm() {
                form.submitWithBindings({
                    service: 'UtilityService',
                    action: 'saveUtility',
                    extraParams: {
                        vendorsite_id: form.findField('Vendorsite_Id').getValue(),
                        utilitytypes : utilitytypes,
                        isNew        : (that.activeVendorId) ? 0 : 1
                    },
                    success: function(result) {
                        NP.Util.showFadingWindow({ html: that.saveSuccessText });
                        var util = form.getModel('vendor.Utility');
                        if (!that.activeVendorId) {
                            that.addHistory('UtilitySetup:showUtilForm:' + result['vendor_id']);
                        }
                    }
                });
            }

            if (utilityRemoved) {
                Ext.Msg.confirm(this.removeUtilTypeTitleText, this.removeUtilTypeDialogText, function(buttonText) {
                    if (buttonText == "yes") {
                        submitForm();
                    }
                });
            } else {
                submitForm();
            }
        }
    },

    /**
     * show account setup form
     *
     * @param account_id
     * @param utility_id
     */
    showAccountForm: function(vendorsite_id, account_id) {
        var that = this;
        that.activeVendorsiteId = vendorsite_id;

        var viewCfg = {
            bind: {
                models: ['vendor.UtilityAccount', 'vendor.Utility']
            }
        };

        if (account_id) {
            Ext.apply(viewCfg.bind, {
                service    : 'UtilityService',
                action     : 'getUtilityAccount',
                extraParams: {
                    id: account_id
                }
            });

            Ext.apply(viewCfg, {
                listeners: {
                    dataloaded: function(boundForm, data) {
                        var unitField = boundForm.findField('unit_id')
                            glField   = boundForm.findField('glaccount_id');
                        
                        unitField.getStore().addExtraParams({ property_id: data['property_id'] });
                        unitField.getStore().load(function() {
                            unitField.setValue(data['unit_id']);
                        });

                        if (NP.Config.getSetting('CP.PROPERTYGLACCOUNT_USE', 0) == '1') {
                            glField.getStore().addExtraParams({ property_id: data['property_id'] });
                        
                            glField.getStore().load(function() {
                                glField.setValue(data['glaccount_id']);
                            });
                        }

                        form.findField('vendor_name').setValue(data['vendor_name']);

                        that.activeVendorId = data['vendor_id'];
                    }
                }
            });
        }

        var form    = this.setView('NP.view.utilitySetup.AccountForm', viewCfg),
            glField = form.findField('glaccount_id');

        glField.getStore().addExtraParams({ vendorsite_id: vendorsite_id });

        that.findTypes(vendorsite_id, form);

        if (!account_id) {
            Ext.each(Ext.ComponentQuery.query('[xtype="shared.button.saveandadd"]'), function(button) {
                button.show();
            });

            NP.lib.core.Net.remoteCall({
                mask    : form,
                requests: {
                    service      : 'VendorService',
                    action       : 'getVendorBySiteId',
                    vendorsite_id: vendorsite_id,
                    success: function(result) {
                        form.findField('vendor_name').setValue(result['vendor_name']);
                        that.activeVendorId = result['vendor_id'];
                    }
                }
            });
        }
    },

    findTypes: function(vendorsite_id, form) {
        var store = form.findField('UtilityType_Id').getStore();
        store.addExtraParams({ vendorsite_id: vendorsite_id });

        store.load();
    },

    saveAccount: function(vendorsite_id, add) {
        var me   = this,
            form = this.getAccountForm();
        
        if (form.isValid()) {
            form.submitWithBindings({
                service: 'UtilityService',
                action: 'saveUtilityAccount',
                extraParams: {
                    vendorsite_id : vendorsite_id,
                    UtilityType_Id: form.findField('UtilityType_Id').getValue()
                },
                success: function(result) {
                    NP.Util.showFadingWindow({ html: me.saveSuccessText });
                    if (add) {
                        Ext.suspendLayouts();
                        form.getForm().getFields().each(function(field) {
                            if (field.getName() !== 'vendor_name') {
                                if (field.clearValue) {
                                    field.clearValue();
                                } else {
                                    field.setValue('');
                                }
                                if (field.clearInvalid) {
                                    field.clearInvalid();
                                }
                            }
                        });
                        Ext.resumeLayouts(true);
                    } else {
                        me.application.addHistory('UtilitySetup:showUtilForm:' + me.activeVendorId);
                    }
                }
            });
        }
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
                        success: function(success) {
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
