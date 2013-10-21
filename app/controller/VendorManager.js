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
            },

            '[xtype="vendor.vendorsmanager"] [xtype="vendor.vendorgrid"]': {
                itemclick: function(grid, rec) {
                    this.showVendorForm(rec.internalId);
                }
            },

            '[xtype="vendor.vendorsearch"] customgrid': {
                viewvendor: this.viewVendor
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
                    {class: 'contact.Phone', prefix: 'vendorsite_'},
                    {class: 'contact.Phone', prefix: 'vendorsite_fax_'},
                    {class: 'contact.Phone', prefix: 'attention_'}
                ]
            }
        };
        if (arguments.length > 0) {
            Ext.apply(viewCfg.bind, {
                service    : 'VendorService',
                action     : 'getVendor',
                extraParams: {
                    vendor_id: vendor_id
                },
                extraFields: ['glaccounts', 'insurances']
            });
            Ext.apply(viewCfg, {
                listeners: {
                    dataloaded: function(formPanel, data) {
                        formPanel.findField('address_state').setValue(parseInt(data['address_state']));

                        var insConf = null;
                        var insForm = null;
                        var insurances = data['insurances'];
                        for (var index in insurances) {
                            insConf ={
                                bind: {
                                    models: ['vendor.Insurance']
                                }
                            };
                            insForm = Ext.create('NP.view.vendor.InsuranceForm', insConf);
                        }
                    }
                }
            });
        }

		var form = this.setView('NP.view.vendor.VendorForm', viewCfg);
        this.findIntegrationPackage(form);
	},

    /**
     * save vendor
     */
    saveVendor: function() {
        var that  = this;

        var form = this.getCmp('vendor.vendorform');
        var values = form.getValues();
        var insurance = [];

        if (values.insurancetype_id && typeof (values.insurancetype_id) !== 'Array') {
            insurance.push({
                insurancetype_id: values.insurancetype_id,
                insurance_company: values.insurance_company,
                insurance_policynum: values.insurance_policynum,
                insurance_policy_effective_datetm: values.insurance_policy_effective_datetm,
                insurance_expdatetm: values.insurance_expdatetm,
                insurance_policy_limit: values.insurance_policy_limit,
                insurance_additional_insured_listed: values.insurance_additional_insured_listed,
                insurance_id: values.insurance_id
            });
        } else {
            if (values.insurancetype_id && values.insurancetype_id.length > 1) {
                for (var index = 0; index < values.insurancetype_id.length; index++) {
                    insurance.push({
                        insurancetype_id: values.insurancetype_id[index],
                        insurance_company: values.insurance_company[index],
                        insurance_policynum: values.insurance_policynum[index],
                        insurance_policy_effective_datetm: values.insurance_policy_effective_datetm[index],
                        insurance_expdatetm: values.insurance_expdatetm[index],
                        insurance_policy_limit: values.insurance_policy_limit[index],
                        insurance_additional_insured_listed: values.insurance_additional_insured_listed[index],
                        insurance_id: values.insurance_id[index]
                    });
                }
            }
        }

        if (form.isValid()) {
            form.submitWithBindings({
                service: 'VendorService',
                action: 'saveVendor',
                extraParams: {
                    userprofile_id: NP.Security.getUser().get('userprofile_id'),
                    role_id:        NP.Security.getRole().get('role_id'),
                    property_id: NP.Security.getCurrentContext().property_id,
                    glaccounts: values['glaccounts'],
                    insurances: JSON.stringify(insurance),
                    vendorsite_DaysNotice_InsuranceExpires: values['vendorsite_DaysNotice_InsuranceExpires']
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
    },

    /**
     *  show search form
     */
    showVendorSearchForm: function() {
        this.setView('NP.view.vendor.VendorSearch');
    },

    /**
     *  view vendor from search form
     * @param grid
     * @param rec
     * @param rowIndex
     */
    viewVendor: function(grid, rec, rowIndex) {
        this.showVendorForm(rec.internalId);
    }
});
