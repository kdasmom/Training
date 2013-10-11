/**
 * @author Baranov A.V.
 * @date 10/2/13
 */


Ext.define('NP.controller.VendorManager', {
    extend: 'NP.lib.core.AbstractController',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
        'NP.lib.core.Net',
        'NP.lib.core.Util'
    ],
//  for localization

    saveSuccessText      : 'Your changes were saved.',
    /**
     * Init
     */
    init: function(){

        var app = this.application;

		this.control({
//			change tab
			'[xtype="vendor.vendorsmanager"] tabpanel': {
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					var activeTab = newCard.getItemId().replace('vendor_grid_', '').toLowerCase();
					this.addHistory('VendorManager:showVendorManager:' + activeTab);
				}
			},
//			add new vendor click button handler
			'[xtype="vendor.vendorsmanager"] [xtype="shared.button.new"]': {
				click: function() {
					this.showVendorForm();
				}
			},
//			cancel click button handler
			'[xtype="vendor.vendorform"] [xtype="shared.button.cancel"]': {
				click: function() {
					this.showVendorManager();
				}
			},
//			cancel click button handler
            '[xtype="vendor.vendorform"] [xtype="shared.button.save"]': {
                click: function() {
                    this.saveVendor();
                }
            }
		});

    },

	/**
	 * Show vendors
	 *
	 * @param activeTab
	 */
    showVendorManager: function(activeTab) {
        var that = this;

        var tabPanel = that.setView('NP.view.vendor.VendorsManager');

		if (!activeTab) var activeTab = 'approved';

		var tab = Ext.ComponentQuery.query('#vendor_grid_' + activeTab)[0];
		var tabPanel = Ext.ComponentQuery.query('tabpanel')[0];

		if (tab.getItemId() != tabPanel.getActiveTab().getItemId()) {
			tabPanel.setActiveTab(tab);
		}

		this.loadVendorsGrid(tab);
    },

	/**
	 * load vendors grid
	 *
	 * @param grid
	 */
	loadVendorsGrid: function(grid) {
		grid.reloadFirstPage();
	},

	/**
	 * Load vendor's form
	 * @param int vendor_id Vendor id to edit
	 */
	showVendorForm: function(vendor_id) {
		var viewCfg = {
            bind: {
                models: [
                    'vendor.Vendor',
                    'vendor.Vendorsite',
                    'contact.Person',
                    'contact.Address',
                    'contact.Email',
                    'vendor.Insurance'
                ]
            }
        };

		var form = this.setView('NP.view.vendor.VendorForm', viewCfg);
        this.findIntegrationPackage(form);
	},

    saveVendor: function() {
        var that  = this;

        var form = this.getCmp('vendor.vendorform');
        var values = form.getValues();

        if (form.isValid()) {
            form.submitWithBindings({
                service: 'VendorService',
                action: 'saveVendor',
                extraParams: {
                    userprofile_id: NP.Security.getUser().get('userprofile_id'),
                    role_id:        NP.Security.getRole().get('role_id')
                },
                success: function(result, deferred) {
                    if (result.success) {
                        NP.Util.showFadingWindow({ html: that.saveSuccessText });
                        that.application.addHistory('VendorManager:showVendorManager');
                    }
                }
            });
        }
    },

    /**
     * retrieve integration package info
     * @returns {{name: null, id: null}}
     */
    findIntegrationPackage: function(form) {
        NP.lib.core.Net.remoteCall({
            requests: {
                service: 'ConfigService',
                action : 'findByAspClientIdAndUserprofileId',
                userprofile_id: NP.lib.core.Security.getUser().get('userprofile_id'),
                success: function(result, deferred) {
                    form.findField('integration_package_name').setValue(result.integration_package_name);
                    form.findField('integration_package_id').setValue(result.integration_package_id);
                }
            }
        });
    }
});
