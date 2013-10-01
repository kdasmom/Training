/**
 * @author Baranov A.V.
 * @date 9/30/13
 */


Ext.define('NP.controller.MobileSetup', {
    extend: 'NP.lib.core.AbstractController',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
        'NP.lib.core.Net',
        'NP.lib.core.Util',
    ],

//  for localization
    saveSuccessText      : 'Your changes were saved.',
    deleteDialogTitleText: 'Delete mobile info?',
    deleteDialogText     : 'Are you sure you want to delete this mobile info?',
    deleteSuccessText    : 'Mobile info successfully deleted',
    deleteFailureText    : 'There was an error deleting the mobile info. Please try again.',
    errorDialogTitleText : 'Error',

    /**
     * Init
     */
    init: function(){

        var app = this.application;

        this.control({
            '[xtype="mobilesetup.mobilegrid"] [xtype="shared.button.new"]': {
                click: function() {
                    app.addHistory('MobileSetup:showMobileInfoForm');
                }
            },
            '[xtype="mobilesetup.mobileinfoform"] [xtype="shared.button.save"]': {
                click: function() {this.saveMobinfoForm(true);}
            }
        })

    },

    /**
     * show budget overage grid
     */
    showMobileInfoGrid: function() {
        // Create the view
        var grid = this.setView('NP.view.mobileSetup.MobileGrid');

        // Load the store
        grid.reloadFirstPage();
    },

    showMobileInfoForm: function() {
        var viewCfg = { bind: { models: ['user.MobInfo'] }};
        var form = this.setView('NP.view.mobileSetup.MobileInfoForm', viewCfg);
    },

    saveMobinfoForm: function(newDevice) {
        var that = this;
        var form = this.getCmp('mobilesetup.mobileinfoform');

        if (form.isValid()) {
            form.submitWithBindings({
                service: 'UserService',
                action: 'saveMobileInfo',
                extraParams: {
                    isNewDevice: newDevice ? newDevice : false
                },
                success: function(result, deferred) {
                    NP.Util.showFadingWindow({ html: that.saveSuccessText });
                    that.application.addHistory('MobileSetup:showMobileInfoGrid');
                }
            });
        }
    }
});
