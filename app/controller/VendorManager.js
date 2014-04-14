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
		'NP.view.shared.button.Upload',
		'NP.view.shared.button.Approve',
		'NP.view.shared.button.Reject',
		'NP.lib.core.Translator'
    ],

    stores: ['vendor.Vendors','contact.Addresses','vendor.VendorTypes','system.TaxPayorTypes',
    		'system.PayeeTypes','vendor.InsuranceTypes'],

    views: ['vendor.VendorsManager','vendor.VendorForm','vendor.VendorImageUploadForm',
    		'vendor.InsuranceUploadForm','vendor.VendorRejectWindow','vendor.VendorSearch',
    		'vendor.AddImagesWindow', 'vendor.PropertyAssignerWindow'],

    refs: [
    	{ ref: 'vendorForm', selector: '[xtype="vendor.vendorform"]' }
    ],

	//	custom
	vendor_status		: false,
	vendor_id			: false,
    /**
     * Init
     */
    init: function(){
		var that = this;
        var app = this.application;

        // For localization
		NP.Translator.on('localeloaded', function() {
			that.saveSuccessText = NP.Translator.translate('Your changes were saved.');
		});

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
					var that = this;
					this.showFormTab(activeTab, false, false, false, this.renderTabBar);
				}
			},
//			add new vendor click button handler
			'[xtype="vendor.vendorsmanager"]  [xtype="shared.button.new"]': {
				click: function() {
					that.addHistory('VendorManager:showVendorForm');
				}
			},
//			cancel click button handler
			'[xtype="vendor.vendorform"] vendortbar [xtype="shared.button.cancel"]': {
				click: function() {
					that.addHistory('VendorManager:showVendorManager');
				}
			},

            '[xtype="vendor.vendorsmanager"] [xtype="vendor.vendorgrid"]': {
                itemclick: function(grid, rec) {
					this.addHistory('VendorManager:showVendorForm:' + rec.internalId + ':' + rec.get('vendor_status'));
                }
            },

            '[xtype="vendor.vendorsearch"] customgrid': {
                viewvendor: this.viewVendor,
				itemclick: function (grid, rec, item, index, e, eOpts) {
					if (e.target.tagName == 'IMG') {
						var el = Ext.get(e.target);
						if (el.hasCls('view-vendor')) {
							this.addHistory('VendorManager:showVendorForm:' + rec.get('vendor_id') + ':' + rec.get('vendor_status') + ':' + true);
						} else{
							var op = 'add';
							if (el.hasCls('favorite-remove')) {
								op = 'remove';
							}
							NP.lib.core.Net.remoteCall({
								requests: {
									service: 'VendorService',
									action : 'updateFavorite',
									vendorsite_id    : rec.get('vendorsite_id'),
									property_id: NP.Security.getCurrentContext().property_id,
									op: op,
									success: function(result, deferred) {
										var page = grid.getStore().currentPage;
										grid.getStore().reload();
									}
								}
							})
						}
					}
				}
            },

			'[xtype="vendor.vendorrejectwindow"]  [xtype="shared.button.cancel"]': {
				click: function() {
					this.getCmp('vendor.vendorrejectwindow').destroy();
				}
			},

			'[xtype="vendor.vendorrejectwindow"]  [xtype="shared.button.save"]': {
				click: function() {
					this.rejectVendor();
				}
			},

			'[xtype="vendor.vendorgeneralinfoandsettings"] [name="default_glaccount_id"]': {
				select: this.onSelectDefaultGl
			},

			'[xtype="vendor.propertyassignerwindow"] [xtype="shared.button.cancel"]': {
				click: function() {
					this.getCmp('vendor.propertyassignerwindow').destroy();
				}
			},
			'[xtype="vendor.propertyassignerwindow"] [xtype="shared.button.save"]': {
				click: function() {
					var form = Ext.ComponentQuery.query('[xtype="vendor.propertyassignerwindow"] form')[0];
					var values = form.getValues();

//					this.getCmp('vendor.insuranceform').findField('insurance_properties_list_id').value = values.insuranceProperties;
					this.getCmp('vendor.propertyassignerwindow').destroy();
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
		that.vendor_status = false;
		that.vendor_id = false;

        var tabPanel = that.setView('NP.view.vendor.VendorsManager');

		if (!activeTab) var activeTab = 'pending';

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
	showVendorForm: function(vendor_id, status, search) {
		var insurances = [];
		this.vendor_id = !vendor_id ? false : vendor_id;
		this.vendor_status = !status ? false : status;

		var that = this;

		var insurancesForm = that.getCmp('vendor.vendorinsurancesetup');
		if (insurancesForm) {
			insurancesForm.down('container').removeAll();
		}

		var viewCfg = {
            bind: {
                models: [
                    'vendor.Vendor',
					{classPath: 'vendor.Vendorsite', prefix: 'vs_'},
                    'contact.Person',
                    'contact.Address',
                    'contact.Email',
                    {classPath: 'contact.Phone', prefix: 'vendorsite_'},
                    {classPath: 'contact.Phone', prefix: 'vendorsite_fax_'},
                    {classPath: 'contact.Phone', prefix: 'attention_'}
                ]
            },
			opened: this.vendor_id ? true : false,
			vendor_id: this.vendor_id
        };

		var form = null;
		var customFieldData = [];
		var insurances = [];

        if (arguments.length > 0) {
			Ext.apply(viewCfg.bind, {
				service    : 'VendorService',
				action     : 'getVendor',
				extraParams: {
					vendor_id: vendor_id
				},
				extraFields: ['glaccounts', 'insurances', 'custom_fields']
			});
			Ext.apply(viewCfg, {
				listeners: {
					dataloaded: function(formPanel, data) {
						// Save to recent records
						that.application.getController('Favorites').saveToRecentRecord(
							'Vendor - ' + data['vendor_name'] + ' (' + data['vendor_id_alt'] + ')'
						);

						that.vendor_status = data['vendor_status'];

						customFieldData = data['custom_fields'];
						Ext.apply(viewCfg, {
							customFieldData: data['custom_fields'],
							insurances: data['insurances']
						});
						formPanel.customFieldData = customFieldData;
						var formCustom = formPanel.down('[xtype="vendor.vendorgeneralinfoandsettings"]');
						var formInsurances = formPanel.down('[xtype="vendor.vendorinsurancesetup"]');
						Ext.Array.each(customFieldData, function(fieldData) {
							formCustom.add(
								{
									xtype     : 'shared.customfield',
									fieldLabel: fieldData['customfield_label'],
									entityType: fieldData['customfield_pn_type'],
									type      : fieldData['customfield_type'],
									name      : fieldData['customfield_name'],
									number    : fieldData['universal_field_number'],
									allowBlank: !fieldData['customfield_required'],
									fieldCfg  : {value: parseInt(fieldData['customfielddata_value'])},
									value: parseInt(fieldData['customfielddata_value'])
								});
						});
						Ext.Array.each(customFieldData, function(field) {
							form.findField(field['customfield_name']).setValue(parseInt(field['customfielddata_value']));
						});

						Ext.Array.each(data['insurances'], function(insurance) {
							formInsurances.addInsurance(insurance, true);
						});
					}
				}
			});
			var form = that.setVendorView(viewCfg, vendor_id, search);
        } else {
			NP.lib.core.Net.remoteCall({
				requests: {
					service                 : 'VendorService',
					action                  : 'getCustomFields',
					vendor_id     			: this.vendor_id,
					success                 : function(result, deferred) {
						customFieldData = result['custom_fields'];
						Ext.apply(viewCfg, {
							customFieldData: customFieldData
						});

						var form = that.setVendorView(viewCfg, vendor_id);
					},
					failure: function(response, options, deferred) {}
				}
			});
		}
	},

	/**
	 * Set form view
	 *
	 * @param config
	 * @param vendor_id
	 * @returns {*}
	 */
	setVendorView: function(config, vendor_id, search) {
		var that = this;
		var form = this.setView('NP.view.vendor.VendorForm', config, null, true);
		if (!vendor_id) {
			form.getForm().reset();
			form.resetModels();
			form.getForm().findField('vendor_customernum').hide();
			form.getForm().findField('vendor_active_startdate').hide();
			form.getForm().findField('vendor_active_enddate').hide();
			form.getForm().findField('default_glaccount_id').hide();
			form.getForm().findField('default_paymenttype_id').hide();
			form.getForm().findField('default_due_datetm').hide();
		}

		this.showFormTab('baseinformation', vendor_id ? true : false, false, search, this.renderTabBar);

		return form;
	},

	/**
	 * When selecting a default GL, we need to make sure it's part of the GL assignments
	 */
	onSelectDefaultGl: function(combo, recs) {
		var me      = this;

		if (recs.length) {
			var glaccount_id = recs[0].get('glaccount_id'),
				glField      = me.getVendorForm().findField('glaccounts'),
				toStore      = glField.getToStore();

			if (toStore.indexOfId(glaccount_id) == -1) {
				glField.addValues(glaccount_id);
			}
		}
	},

    /**
     * save vendor
     */
    saveVendor: function(action) {
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
                insurance_id: values.insurance_id,
				insurance_properties_list_id: values.insurance_properties_list_id,
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
                        insurance_id: values.insurance_id[index],
						insurance_properties_list_id: values.insurance_properties_list_id[index]
                    });
                }
            }
        }

		var customFields = {};
		Ext.Array.each(form.customFieldData, function(fieldData) {
			customFields[fieldData['customfield_name']] = form.findField(fieldData['customfield_name']).getValue();
		});

        if (form.isValid()) {
			var extraParams = {
				userprofile_id: NP.Security.getUser().get('userprofile_id'),
				role_id:        NP.Security.getRole().get('role_id'),
				property_id: NP.Security.getCurrentContext().property_id,
				glaccounts: values['glaccounts'],
				insurances: JSON.stringify(insurance),
				vendorsite_DaysNotice_InsuranceExpires: values['vendorsite_DaysNotice_InsuranceExpires'],
				customFields: customFields
			};

			if (action) {
				extraParams.action = action;
			} else {
				extraParams.action = null;
			}

            form.submitWithBindings({
                service: 'VendorService',
                action: 'saveVendor',
                extraParams: extraParams,
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
		this.addHistory('VendorManager:showVendorForm:' + rec.internalId + ':' + rec.get('vendor_status'));
    },

	showBarCallback: function(appcount, isReject, insurance) {
		var vendor_id = this.vendor_id;
		var form = this.getCmp('vendor.vendorform');
		var tbar = form.getDockedItems()[1];
		var opened = !opened ? form.opened : opened;

		if (!opened) {
			if (isReject) {
				bar.push({
					xtype: 'shared.button.delete'
				});
			}
			if (appCount && this.vendor_status !== 'forapproval' || this.vendor_status == '') {
				bar.push(
					{
						xtype: 'shared.button.save',
						text: NP.Translator.translate('Save'),
						handler: function() {
							that.saveVendor('save');
						}
					}
				);
			} else {
				if (!appCount && this.vendor_status !== 'forapproval') {
					bar.push(
						{
							xtype: 'shared.button.approve',
							text: this.submitForApprovalTextBtn
						},
						{
							xtype: 'shared.button.approve',
							text: this.submitForApprovalAndUploadTextBtn
						}
					);
				} else {
					if (this.vendor_status == 'forapproval') {
						bar.push(
							{
								xtype: 'shared.button.approve',
								text: NP.Translator.translate('Approve')
							},
							{
								xtype: 'shared.button.reject',
								text: NP.Translator.translate('Reject')
							}
						);
					}
				}
			}
		} else {
			if (NP.Security.getRole().get('role_name') == 'Auditor') {

			} else {
				if (insurance) {

				} else {
					var submit_userprofile_id = form.findField('submit_userprofile_id').getValue();
					bar = buttonForTab(appCount, this.vendor_status, itemId, bar, form, submit_userprofile_id, vendor_id);
				}
			}

		}

		tbar.removeAll();
		tbar.add(bar);

		function buttonForTab(app_count, vendor_status, tabName, bar, form, submit_userprofile_id, vendor_id) {
			if (tabName !== 'altaddresses') {

//				Non-Approver editing an active vendor with no pending edits
				if (!app_count && vendor_status == 'active') {
					if (tabName == 'glaccounts') {
						bar.push(
							{
								xtype: 'button',
								text: 'Update GL Assignment',
								handler: function() {
									that.refreshGlAccounts(vendor_id);
								}
							}
						);
					} else {
						if (tabName == 'insurances') {
							bar.push(
								{
									xtype: 'shared.button.approve',
									handler: function() {
										that.saveInsurances();
									}
								}
							);
						} else {
							if (tabName == 'baseinformation') {
								if (NP.Security.hasPermission(6092) && NP.Security.hasPermission(1025)) {
									bar.push(
										{
											xtype: 'shared.button.approve',
											handler: function() {
												that.saveVendor('approve');
											}
										}
									);
								} else {
									if (NP.Security.hasPermission(6092) && !NP.Security.hasPermission(1025)) {
										bar.push(
											{
												xtype: 'shared.button.approve',
												text: 'Submit Changes for Approval',
												handler: function() {
													that.saveVendor();
												}
											}
										);
									}
								}
							} else {
//								<!--- Privelage 2083 - Modify General Info / Settingscheck_ap --->
								if (tabName == 'settings' && NP.Security.hasPermission(2083)) {
									bar.push(
										{
											xtype: 'shared.button.save',
											handler: function() {
												that.saveVendor('active');
											}
										}
									);
								} else {
									if (tabName !== 'baseinformation' && tabName !== 'settings') {
										bar.push(
											{
												xtype: 'shared.button.approve',
												text: 'Submit Changes for Approval',
												handler: function() {
													that.saveVendor();
												}
											}
										);
									}
								}
							}
						}
					}
				}
//				Vendor-creator viewing rejected vendor
				if (vendor_status == 'rejected' && submit_userprofile_id && submit_userprofile_id == NP.Security.getUser().get('userprofile_id')) {
					bar.push(
						{
							xtype: 'shared.button.approve',
							text: 'Submit Changes for Approval',
							handler: function() {
								that.saveVendor();
							}
						}
					);
				}
//				Approver editing an active vendor that has no pending edits
				if (app_count && vendor_status == 'active') {
					if (tabName !== 'glaccounts' && tabName !== 'documents' && tabName !== 'baseinformation' && tabName !== 'settings') {
						bar.push(
							{
								xtype: 'shared.button.approve',
								handler: function() {
									that.saveVendor('approve');
								}
							}
						);
					} else {
						if (tabName == 'baseinformation') {
							if (NP.Security.hasPermission(6092) || NP.Security.hasPermission(1025)) {
								bar.push(
									{
										xtype: 'shared.button.approve',
										handler: function() {
											that.saveVendor('approve');
										}
									}
								);
							} else {
								if (NP.Security.hasPermission(6092) || !NP.Security.hasPermission(1025)) {
									bar.push(
										{
											xtype: 'shared.button.approve',
											text: 'Submit Changes for Approval',
											handler: function() {
												that.saveVendor();
											}
										}
									);
								}
							}
						} else {
							if (tabName == 'settings' && NP.Security.hasPermission(2083)) {
								bar.push(
									{
										xtype: 'shared.button.save',
										handler: function() {
											that.saveVendor('active');
										}
									}
								);
							} else {
								if (tabName == 'glaccounts') {
									bar.push(
										{
											xtype: 'button',
											text: 'Update GL Assignment',
											handler: function() {
												that.refreshGlAccounts(vendor_id);
											}
										}
									);
								}
							}
						}
					}
				}
				bar.push(
					{
						xtype: 'shared.button.new',
						text: 'Add image',
						handler: function() {
							that.showAddImageWindow(vendor_id);
						}
					}
				);
				if (tabName == 'documents') {
					bar.push(
						{
							xtype: 'shared.button.upload',
							text: 'Upload image'
						}
					);
				}

				if (tabName == 'insurances') {
					bar.push(
						{
							xtype: 'shared.button.upload',
							text: 'Upload insurance',
							handler: function() {
								that.addHistory('Import:showImport:');
							}
						}
					);
				}
			}

			if (vendor_status == 'forapproval' && tabName == 'glaccounts') {
				bar.push(
					{
						xtype: 'button',
						text: 'Update GL Assignment',
						handler: function() {
							that.refreshGlAccounts(vendor_id);
						}
					}
				);
			}
//			Settings page
// 			Approver editing vendor that is forapproval
			if (vendor_status == 'forapproval' && tabName == 'settings') {
				if (NP.Security.hasPermission(2083)) {
					bar.push(
						{
							xtype: 'shared.button.approve',
							handler: function() {
								that.saveVendor('forapproval');
							}
						}
					);
				} else {
					form.findField('vendor_action').setValue('');
					bar.push(
						{
							xtype: 'shared.button.approve',
							text: 'Submit Changes for Approval',
							handler: function() {
								that.saveVendor();
							}
						}
					);
				}
			}

			if (vendor_status == 'forapproval' && tabName == 'baseinformation') {
				bar.push(
					{
						xtype: 'shared.button.approve',
						handler: function() {
							that.saveVendor('approve');
						}
					}
				);
				bar.push(
					{
						xtype: 'shared.button.reject',
						handler: function() {
							that.showRejectForm(vendor_id);
						}
					}
				);
			}

			return bar;
		}
	},

	showFormTab: function(itemId, isReject, insurance, isSearch, callback) {
		callback = callback || Ext.emptyFn;

		var that = this,
			appCount = false;

		NP.lib.core.Net.remoteCall({
			requests: {
				service: 'VendorService',
				action : 'isApprovalRights',
				userprofile_id: NP.lib.core.Security.getUser().get('userprofile_id'),
				role_id: NP.lib.core.Security.getRole().get('role_id'),
				success: function(result, deferred) {
					appCount = result.ap_count ? result.ap_count : appCount;
					var form = that.getCmp('vendor.vendorform');
					var tbar = form.getDockedItems()[1];
					var submit_userprofile_id = form.findField('submit_userprofile_id').getValue();

					var bar = callback(appCount, itemId, isReject, insurance, that.vendor_status, that.vendor_id, !that.vendor_id ? false : true, submit_userprofile_id, isSearch, that);

					tbar.removeAll();
					tbar.add(bar);
				}
			}
		});

		if (itemId == 'altaddresses') {
			Ext.ComponentQuery.query('[xtype="vendor.alternativeaddresses"] customgrid')[0].getStore().load();
		}
	},

	/**
	 * Callback to build buttons toolbar
	 *
	 * @param appCount
	 * @param tabName
	 * @param isReject
	 * @param insurance
	 * @param vendor_status
	 * @param vendor_id
	 * @param opened
	 * @param submit_userprofile_id
	 * @param parent
	 * @returns {Array}
	 */
	renderTabBar: function(appCount, tabName, isReject, insurance, vendor_status, vendor_id, opened, submit_userprofile_id, search, parent) {
		var that = parent;

		var bar = [
			{
				xtype: 'shared.button.cancel',
				handler: function() {
					that.addHistory('VendorManager:showVendorManager');
				}
			}
		];
		if (search) {
			bar.push(
				{
					xtype: 'shared.button.back',
					text: NP.Translator.translate('Search results'),
					handler: function() {
						that.addHistory('VendorManager:showVendorSearchForm');
					}
				}
			);
		}

		if (!opened) {
			if (isReject){
				bar.push({
					xtype: 'shared.button.delete'
				})
			}
			if (appCount && (!vendor_status || vendor_status !== 'foapproval')) {
				bar.push(
					{
						xtype: 'shared.button.save',
						text: NP.Translator.translate('Save'),
						handler: function() {
							that.saveVendor('save');
						}
					}
				);
			} else {
				if (!appCount && this.vendor_status !== 'forapproval') {
					bar.push(
						{
							xtype: 'shared.button.approve',
							text: this.submitForApprovalTextBtn
						},
						{
							xtype: 'shared.button.approve',
							text: this.submitForApprovalAndUploadTextBtn
						}
					);
				} else {
					if (this.vendor_status == 'forapproval') {
						bar.push(
							{
								xtype: 'shared.button.approve',
								text: NP.Translator.translate('Approve')
							},
							{
								xtype: 'shared.button.reject',
								text: NP.Translator.translate('Reject')
							}
						);
					}
				}
			}
		} else {
			if (NP.Security.getRole().get('role_name') == 'Auditor') {

			} else {
				if (insurance) {

				} else {
					bar = buttonForTab(appCount, vendor_status, tabName, bar, submit_userprofile_id, vendor_id);
				}
			}
		}

		function buttonForTab(app_count, vendor_status, tabName, bar, submit_userprofile_id, vendor_id) {
			//todo delete
//			bar.push(
//				{
//					xtype: 'shared.button.save',
//					handler: function() {
//						that.saveVendor('active');
//					}
//				}
//			);
			if (tabName !== 'altaddresses') {

//				Non-Approver editing an active vendor with no pending edits
				if (!app_count && vendor_status == 'active') {
					if (tabName == 'glaccounts') {
						bar.push(
							{
								xtype: 'button',
								text: 'Update GL Assignment',
								handler: function() {
									that.refreshGlAccounts(vendor_id);
								}
							}
						);
					} else {
						if (tabName == 'insurances') {
							bar.push(
								{
									xtype: 'shared.button.save',
									handler: function() {
										that.saveInsurances();
									}
								}
							);
						} else {
							if (tabName == 'baseinformation') {
								if (NP.Security.hasPermission(6092) && NP.Security.hasPermission(1025)) {
									bar.push(
										{
											xtype: 'shared.button.approve',
											handler: function() {
												that.saveVendor('approve');
											}
										}
									);
								} else {
									if (NP.Security.hasPermission(6092) && !NP.Security.hasPermission(1025)) {
										bar.push(
											{
												xtype: 'shared.button.approve',
												text: 'Submit Changes for Approval',
												handler: function() {
													that.saveVendor();
												}
											}
										);
									}
								}
							} else {
//								<!--- Privelage 2083 - Modify General Info / Settingscheck_ap --->
								if (tabName == 'settings' && NP.Security.hasPermission(2083)) {
									bar.push(
										{
											xtype: 'shared.button.save',
											handler: function() {
												that.saveVendor('active');
											}
										}
									);
								} else {
									if (tabName !== 'baseinformation' && tabName !== 'settings') {
										bar.push(
											{
												xtype: 'shared.button.approve',
												text: 'Submit Changes for Approval',
												handler: function() {
													that.saveVendor();
												}
											}
										);
									}
								}
							}
						}
					}
				}
//				Vendor-creator viewing rejected vendor
				if (vendor_status == 'rejected' && submit_userprofile_id && submit_userprofile_id == NP.Security.getUser().get('userprofile_id')) {
					bar.push(
						{
							xtype: 'shared.button.approve',
							text: 'Submit Changes for Approval',
							handler: function() {
								that.saveVendor();
							}
						}
					);
				}
//				Approver editing an active vendor that has no pending edits
				if (app_count && vendor_status == 'active') {
					if (tabName !== 'glaccounts' && tabName !== 'documents' && tabName !== 'baseinformation' && tabName !== 'settings') {
						bar.push(
							{
								xtype: 'shared.button.approve',
								handler: function() {
									that.saveVendor('approve');
								}
							}
						);
					} else {
						if (tabName == 'baseinformation') {
							if (NP.Security.hasPermission(6092) || NP.Security.hasPermission(1025)) {
								bar.push(
									{
										xtype: 'shared.button.approve',
										handler: function() {
											that.saveVendor('approve');
										}
									}
								);
							} else {
								if (NP.Security.hasPermission(6092) || !NP.Security.hasPermission(1025)) {
									bar.push(
										{
											xtype: 'shared.button.approve',
											text: 'Submit Changes for Approval',
											handler: function() {
												that.saveVendor();
											}
										}
									);
								}
							}
						} else {
							if (tabName == 'settings' && NP.Security.hasPermission(2083)) {
								bar.push(
									{
										xtype: 'shared.button.save',
										handler: function() {
											that.saveVendor('active');
										}
									}
								);
							} else {
								if (tabName == 'glaccounts') {
									bar.push(
										{
											xtype: 'button',
											text: 'Update GL Assignment',
											handler: function() {
												that.refreshGlAccounts(vendor_id);
											}
										}
									);
								}
							}
						}
					}
				}
				bar.push(
					{
						xtype: 'shared.button.new',
						text: 'Add image',
						handler: function() {
							that.showAddImageWindow(vendor_id);
						}
					}
				);
				if (tabName == 'documents') {
					bar.push(
						{
							xtype: 'shared.button.upload',
							text: 'Upload image'
						}
					);
				}

				if (tabName == 'insurances') {
					bar.push(
						{
							xtype: 'shared.button.upload',
							text: 'Upload insurance',
							handler: function() {
								that.addHistory('Import:showImport:');
							}
						}
					);
				}
			}

			if (vendor_status == 'forapproval' && tabName == 'glaccounts') {
				bar.push(
					{
						xtype: 'button',
						text: 'Update GL Assignment',
						handler: function() {
							that.refreshGlAccounts(vendor_id);
						}
					}
				);
			}
//			Settings page
// 			Approver editing vendor that is forapproval
			if (vendor_status == 'forapproval' && tabName == 'settings') {
				if (NP.Security.hasPermission(2083)) {
					bar.push(
						{
							xtype: 'shared.button.approve',
							handler: function() {
								that.saveVendor('forapproval');
							}
						}
					);
				} else {
					form.findField('vendor_action').setValue('');
					bar.push(
						{
							xtype: 'shared.button.approve',
							text: 'Submit Changes for Approval',
							handler: function() {
								that.saveVendor();
							}
						}
					);
				}
			}

			if (vendor_status == 'forapproval' && tabName == 'baseinformation') {
				bar.push(
					{
						xtype: 'shared.button.approve',
						handler: function() {
							that.saveVendor('approve');
						}
					}
				);
				bar.push(
					{
						xtype: 'shared.button.reject',
						handler: function() {
							that.showRejectForm(vendor_id);
						}
					}
				);
			}

			return bar;
		}

		return bar;
	},

	showRejectForm: function(vendor_id) {
		var win = Ext.create('NP.view.vendor.VendorRejectWindow', {vendor_id: vendor_id}).show();
	},

	/**
	 * set reject status to vendor
	 */
	rejectVendor: function() {
		var that = this;

		var formSelector = '[xtype="vendor.vendorrejectwindow"] form';
		var form = Ext.ComponentQuery.query(formSelector)[0];
		var values = form.getValues();
		if (form.isValid()) {

			NP.lib.core.Net.remoteCall({
				requests: {
					service: 'VendorService',
					action : 'rejectVendor',
					vendor_id		: values.vendor_id,
					reject_note		: values.reject_note,
					userprofile_id	: NP.Security.getUser().get('userprofile_id'),
					success: function(result, deferred) {
						if (result.success) {
							that.getCmp('vendor.vendorrejectwindow').destroy();
							NP.Util.showFadingWindow({ html: that.saveSuccessText });
							that.application.addHistory('VendorManager:showVendorManager');
						}

					}
				}
			});
		}
	},

	/**
	 * Refresh glaccounts list
	 *
	 * @param vendor_id
	 */
	refreshGlAccounts: function (vendor_id) {
		var that = this;
		var form = this.getCmp('vendor.vendorform');
		var values = form.getValues();

		NP.lib.core.Net.remoteCall({
			requests: {
				service: 'VendorService',
				action : 'refreshGlAccounts',
				vendor_id		: vendor_id,
				glaccounts		: values['glaccounts'],
				success: function(result, deferred) {
					if (result) {
						NP.Util.showFadingWindow({ html: that.saveSuccessText });
						that.application.addHistory('VendorManager:showVendorManager');
					}

				}
			}
		});
	},

	showAddImageWindow: function(vendor_id) {
		var win = Ext.create('NP.view.vendor.AddImagesWindow', {vendor_id: vendor_id}).show();
	},

	saveInsurances: function() {

		var that = this;
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
				insurance_id: values.insurance_id,
				insurance_properties_list_id: values.insurance_properties_list_id
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
						insurance_id: values.insurance_id[index],
						insurance_properties_list_id: values.insurance_properties_list_id[index]
					});
				}
			}
		}

		NP.lib.core.Net.remoteCall({
			requests: {
				service: 'VendorService',
				action : 'saveInsurances',
				vendor_id: that.vendor_id,
				insurances: JSON.stringify(insurance),
				insuranceExpires: values['vendorsite_DaysNotice_InsuranceExpires'],
				success: function(result, deferred) {
					if (result.success) {
						NP.Util.showFadingWindow({ html: that.saveSuccessText });
						that.application.addHistory('VendorManager:showVendorManager');
					}
				}
			}
		});
	}
});