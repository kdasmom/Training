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
        'NP.lib.core.Util',
		'NP.view.shared.button.Upload'
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
//			change tab
			'[xtype="vendor.vendorform"] tabpanel': {
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					var activeTab = newCard.getItemId();
					this.showFormTab(activeTab);
				}
			},
//			add new vendor click button handler
			'[xtype="vendor.vendorsmanager"]  [xtype="shared.button.new"]': {
				click: function() {
					this.showVendorForm();
				}
			},
//			cancel click button handler
			'[xtype="vendor.vendorform"] vendortbar [xtype="shared.button.cancel"]': {
				click: function() {
					this.showVendorManager();
				}
			},

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
		var insurances = [];

		var that = this;

		var viewCfg = {
            bind: {
                models: [
                    'vendor.Vendor',
					{class: 'vendor.Vendorsite', prefix: 'vs_'},
                    'contact.Person',
                    'contact.Address',
                    'contact.Email',
                    {class: 'contact.Phone', prefix: 'vendorsite_'},
                    {class: 'contact.Phone', prefix: 'vendorsite_fax_'},
                    {class: 'contact.Phone', prefix: 'attention_'}
                ]
            },
			opened: vendor_id ? true : false
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
						insurances = data['insurances'];

						var insuranceForm = that.getCmp('vendor.vendorinsurancesetup');

						for (var index in insurances) {
							var model = Ext.create('NP.model.vendor.Insurance', insurances[index]);
							insuranceForm.addInsurance(model);
						}
                    }
                }
            });
        }


		var form = this.setView('NP.view.vendor.VendorForm', viewCfg);
        this.findIntegrationPackage(form);
		this.showFormTab('baseinformation', vendor_id ? true : false);
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
					console.log('success');
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
    },

	showFormTab: function(itemId, opened, isReject, insurance) {
		var that = this;
		var opened = !opened ? false :true;
		var appCount = 1;
		var vendorStatus = '';

		var bar = [
			{
				xtype: 'shared.button.cancel',
				handler: function() {
					that.showVendorManager();
				}
			}
		];
		var form = this.getCmp('vendor.vendorform');
		var opened = !opened ? form.opened : opened;
		if (!opened) {
			if (isReject) {
				bar.push({
					xtype: 'shared.button.delete'
				});
			}
			if (appCount > 0 && vendorStatus !== 'forapproval') {
				bar.push(
					{
						xtype: 'shared.button.save'
					}
				);
			}
			if (appCount == 0 && vendorStatus !== 'forapproval') {
				bar.push(
					{
						xtype: 'button',
						text: this.submitForApprovalTextBtn
					},
					{
						xtype: 'button',
						text: this.submitForApprovalAndUploadTextBtn
					}
				);
			}
			if (vendorStatus == 'forapproval') {
				bar.push(
					{
						xtype: 'button',
						text: this.approveTextBtn
					},
					{
						xtype: 'button',
						text: this.rejectTextBtn
					}
				);
			}
		} else {
			if (NP.Security.getRole().get('role_name') == 'Auditor') {

			} else {
				if (insurance) {

				} else {
					console.log('not opened');
					bar.push(
						{
							xtype: 'shared.button.save',
							handler: function() {
								that.saveVendor();
							}
						}
					);

					bar.push(
						{
							xtype: 'shared.button.new',
							text: 'Add image'
						}
					);
				}
			}

		}

		if (!itemId) {
			itemId = 'baseinformation';
		}


		switch (itemId) {
			case ('baseinformation'):
			default:
				break;
			case ('settings'):
				break;
			case ('glaccounts'):
				bar.push(
					{
						xtype: 'button',
						text: 'Update GL Assignment'
					}
				);
				break;
			case ('insurances'):
				bar.push(
					{
						xtype: 'shared.button.upload',
						text: 'Insurance upload'
					}
				);
				break;
			case ('documents'):
				bar.push(
					{
						xtype: 'shared.button.upload',
						text: 'Image upload'
					}
				);
				break;
		}


		var docketItems = form.getDockedItems();
		form.addDocked({
			xtype: 'toolbar',
			itemId: 'vendortbar',
			dock: 'top',
			items:bar
		});
		form.addDocked({
			xtype: 'toolbar',
			itemId: 'vendorbbar',
			dock: 'bottom',
			items:bar
		});
	}
});
