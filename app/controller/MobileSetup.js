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

    // for localization
    saveSuccessText      : 'Your changes were saved.',
    // delete action messages
    deleteDialogTitleText: 'Delete device?',
    deleteDialogText     : 'Are you sure you want to delete this device?',
    deleteSuccessText    : 'Device info successfully deleted',
    deleteFailureText    : 'There was an error deleting the device. Please try again.',
    // activate action messages
    activateDialogTitleText : 'Activate?',
    activateDialogText      : 'Are you sure you want to activate the selected devices?',
    activateSuccessText     : 'Devices were activated',
    activateFailureText     : 'There was an error activating devices',
    // deactivate
    deactivateDialogTitleText : 'Inactivate?',
    deactivateDialogText      : 'Are you sure you want to deactivate the selected devices?',
    deactivateSuccessText     : 'Devices were deactivated',
    deactivateFailureText     : 'There was an error deactivating devices',
    // common
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
                click: function() {this.saveMobinfoForm();}
            },
            '[xtype="mobilesetup.mobileinfoform"] [xtype="shared.button.cancel"]': {
                click: function() {
                    app.addHistory('MobileSetup:showMobileInfoGrid');
                }
            },
            '[xtype="mobilesetup.mobilegrid"]': {
                selectionchange: this.checkMobinfo
            },
            '[xtype="mobilesetup.mobilegrid"] [xtype="shared.button.activate"]': {
                click: function() {
                    this.actionHandler('activate');
                }
            },
            '[xtype="mobilesetup.mobilegrid"] [xtype="shared.button.inactivate"]': {
                click: function() {
                    this.actionHandler('deactivate');
                }
            },
            '[xtype="mobilesetup.mobilegrid"] [xtype="shared.button.delete"]': {
                click: function() {
                    this.actionHandler('delete');
                }
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
        this.setView('NP.view.mobileSetup.MobileInfoForm');
    },

    saveMobinfoForm: function() {
        var that = this;
        var form = this.getCmp('mobilesetup.mobileinfoform');

        if (form.isValid()) {
            form.submitWithBindings({
                service: 'UserService',
                action: 'saveMobileInfo',
                extraParams: {
                    isNewDevice: true
                },
                success: function(result, deferred) {
                    NP.Util.showFadingWindow({ html: that.saveSuccessText });
                    that.application.addHistory('MobileSetup:showMobileInfoGrid');
                }
            });
        }
    },

    actionHandler: function(action) {
        var that           = this,
            title          = that[action+'DialogTitleText'],
            successMessage = that[action+'SuccessText'],
            failMessage    = that[action+'FailureText'],
            dialogtext     = that[action+'DialogText'];

        // Show a confirmation dialog
        Ext.MessageBox.confirm(title, dialogtext, function(btn) {
            // If user clicks Yes, perform action
            if (btn == 'yes') {
                var grid = that.getCmp('mobilesetup.mobilegrid');
                var devices = grid.getSelectionModel().getSelection();

                var devices_id = [];
                Ext.each(devices, function(device) {
                    devices_id.push(device.get('mobinfo_id'));
                });

                NP.lib.core.Net.remoteCall({
                    mask: grid,
                    requests: {
                        service: 'UserService',
                        action : action + 'Device',
                        device_list: devices_id.join(','),
                        success: function(result, deferred) {
                            if (result.success) {
                                if (action == 'delete') {
                                    grid.getStore().remove(devices);
                                } else {
                                    grid.getSelectionModel().deselectAll();
                                    
                                    Ext.each(devices, function(device) {
                                        var status = (action == 'activate') ? 'active' : 'inactive';
                                        device.set('mobinfo_status', status);
                                        device.set('mobinfo_'+action+'d_datetm', new Date());
                                    });
                                }

                                NP.Util.showFadingWindow({ html: successMessage });
                            } else {
                                Ext.MessageBox.alert(that.errorDialogTitleText, failMessage);
                            }
                        },
                        failure: function(response, options, deferred) {
                            Ext.MessageBox.alert(that.errorDialogTitleText, failMessage);
                        }
                    }
                });
            }
        });
    },

    checkMobinfo: function(grid, recs) {
        var grid = this.getCmp('mobilesetup.mobilegrid');

        var removeBtn = grid.query('[xtype="shared.button.delete"]')[0];
        var activateBtn = grid.query('[xtype="shared.button.activate"]')[0];
        var inactivateBtn = grid.query('[xtype="shared.button.inactivate"]')[0];

        if (recs.length) {
            removeBtn.enable();
            activateBtn.enable();
            inactivateBtn.enable();
        } else {
            removeBtn.disable();
            activateBtn.disable();
            inactivateBtn.disable();
        }
    }
});
