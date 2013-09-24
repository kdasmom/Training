/**
 * Created by rnixx on 9/23/13.
 */

Ext.define('NP.controller.UtilitySetup', {
    extend: 'NP.lib.core.AbstractController',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
        'NP.lib.core.Net',
        'NP.lib.core.Util',
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
                }
            }
        );
    },

    showVendorsGrid: function() {
        var grid = this.setView('NP.view.utilitySetup.VendorsGrid');
        grid.reloadFirstPage();
    },

    showVendorForm: function(id) {
        var viewCfg = { bind: { models: ['utility.Utility'] }};

        var form = this.setView('NP.view.utilitySetup.UtilitySetupForm', viewCfg);
    },

    saveUtility: function() {
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
//                    NP.Util.showFadingWindow({ html: that.saveSuccessText });
//                    that.application.addHistory('BudgetOverage:showBudgetOverage');
                }
            });
        }
    },

    getSelectedUtilityTypes: function() {

    }
});
