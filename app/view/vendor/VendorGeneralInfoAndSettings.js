/**
 * @author Baranov A.V.
 * @date 10/4/13
 */

Ext.define('NP.view.vendor.VendorGeneralInfoAndSettings', {
	extend: 'Ext.container.Container',
	alias: 'widget.vendor.vendorgeneralinfoandsettings',

	requires: [
		'NP.lib.core.Security',
		'NP.lib.ui.ComboBox',
        'NP.view.shared.YesNoField',
		'NP.view.shared.CustomField',
		'NP.lib.core.Translator'
	],

	padding: 8,

	// For localization
	title: 'General Info and Settings',
    vendorTypeInputLabel: 'Vendor Type',
    taxPayorTypeInputLabel: 'Tax Payor Type',
    payeeTypeInputLabel: 'Payee Type',
    emailAddressInputLabel: 'Email Address',
    phoneInputLabel: 'Phone',
    phoneExtInputLabel: 'Ext',
    faxInputLabel: 'Fax',
    contactInputLabel: 'Contact',
    contactFirstnameInputLabel: 'Firstname',
    contactLastnameInputLabel: 'Lastname',
    phoneContactInputLabel: 'Phone',
    phoneContactExtInputLabel: 'Ext',
    accountNumberInputLabel: 'Account Number',
    printViewInputLabel: 'Display on Purchase Order Print View',
    taxReportableInputLabel: '1099 Tax Reportable',

	activeStartDateInputLabel: 'Active Start Date',
	activeEndDateInputLabel: 'Active End Date',
	customerNumberInputLabel: 'Customer number',
	defaultGlAccountInputLabel: 'Default GL Account',
	defaultPaymentTypeInputLabel: 'Default Payment Type',
	defaultDateSettingsInputLabel: 'Default Due Date Setting (# of days)',
	financeVendorInputLabel: 'Finance Vendor',
	remittanceAdviceInputLabel: 'Requires a Remittance Advice',
	requiresVendorInputLabel: 'Requires Vendor Insurance',
	requiresServiceCustomFieldsInputLabel: 'Requires Service Custom Fields on Purchase Order',
	submitPosToVendorInputLabel: 'Electronically Submit Pos to Vendor',
	autoEmailInputLabel: 'Auto email approved PO to vendor',



	// Custom options
	opened: false,

	initComponent: function() {
		var that = this;

		that.title = NP.Translator.translate(that.title);

		var days = [];

		for (var index = 1; index <=60; index++) {
			days.push([index]);
		}
		var daysStore = new Ext.data.ArrayStore({
			data   : days,
			fields : ['day']
		});

        this.defaults = {
            labelWidth: 150,
            width: 500,
			autoHeight: true
        };

		this.items = [];

        this.items = [
			{
				xtype: 'textfield',
				name: 'vendor_customernum',
				fieldLabel: this.customerNumberInputLabel,
				hidden: !this.opened
			},
            {
                xtype: 'customcombo',
                fieldLabel: this.vendorTypeInputLabel,
                name: 'vendortype_id',
                displayField: 'vendortype_code',
                valueField: 'vendortype_id',
                store: Ext.create('NP.store.vendor.VendorTypes', {
                    service: 'VendorService',
                    action: 'findVendorTypes',
                    autoLoad: true,
					extraParams: {
						userprofile_id:NP.Security.getUser().get('userprofile_id')
					}
                }),
				allowBlank: false,
				queryMode: 'local',
				editable: false,
				typeAhead: false,
				listeners: {
                    change: function(combo, value) {
                        var form = that.up('form');
                        form.findField('vendor_type_code').setValue(combo.getRawValue());
                    }
                }
            },
            {
                xtype: 'hidden',
                name: 'vendor_type_code'
            },
            {
                xtype: 'customcombo',
                fieldLabel: this.taxPayorTypeInputLabel,
                name: 'taxpayor_type',
                displayField: 'lookupcode_code',
                valueField: 'lookupcode_id',
                store: Ext.create('NP.store.system.TaxPayorTypes', {
                    autoLoad: true
                }),
				queryMode: 'local',
				editable: false,
				typeAhead: false
            },
            {
                xtype: 'customcombo',
                fieldLabel: this.payeeTypeInputLabel,
                name: 'payee_type',
                displayField: 'lookupcode_code',
                valueField: 'lookupcode_id',
                store: Ext.create('NP.store.system.PayeeTypes', {
                    autoLoad: true
                }),
				queryMode: 'local',
				editable: false,
				typeAhead: false
            },
			{
				xtype: 'datefield',
				name: 'vendor_active_startdate',
				fieldLabel: this.activeStartDateInputLabel,
				hidden: !this.opened
			},
			{
				xtype: 'datefield',
				name: 'vendor_active_enddate',
				fieldLabel: this.activeEndDateInputLabel,
				hidden: !this.opened
			},
			{
				xtype: 'customcombo',
				name: 'default_glaccount_id',
				displayField: 'glaccount_name',
				valueField: 'glaccount_id',
				store: Ext.create('NP.store.gl.GlAccounts', {
					service           : 'GLService',
					action            : 'getAll',
					autoLoad          : true,
					extraParams: {
						pageSize: null
					}
				}),
				fieldLabel: this.defaultGlAccountInputLabel,
				hidden: !this.opened,
				queryMode: 'local',
				editable: false,
				typeAhead: false
			},
			{
				xtype: 'customcombo',
				name: 'default_paymenttype_id',
				valueField: 'invoicepayment_type_id',
				displayField: 'invoicepayment_type',
				fieldLabel: this.defaultPaymentTypeInputLabel,
				store: Ext.create('NP.store.invoice.InvoicePaymentTypes', {
					service           : 'InvoiceService',
					action            : 'getPaymentTypes',
					autoLoad          : true,
					extraParams: {
						pageSize: null,
						paymentType_id: null
					}
				}),
				hidden: !this.opened,
				queryMode: 'local',
				editable: false,
				typeAhead: false
			},
			{
				xtype: 'customcombo',
				name: 'default_due_datetm',
				displayField: 'day',
				fieldLabel: this.defaultDateSettingsInputLabel,
				store: daysStore,
				hidden: !this.opened,
				queryMode: 'local',
				editable: false,
				typeAhead: false
			},
			{
				xtype: 'shared.yesnofield',
				name: 'Finance_Vendor',
				fieldLabel: this.financeVendorInputLabel,
				hidden: !this.opened
			},
            {
                xtype: 'textfield',
                fieldLabel: this.emailAddressInputLabel,
                name: 'email_address'
            },
            {
                xtype: 'hidden',
                name: 'email_id'
            },
            {
                xtype: 'fieldcontainer',
                fieldLabel: this.phoneInputLabel,
                layout: 'hbox',
//				width: 800,
                items: [
					{
						xtype: 'shared.phone',
						hideCountry: false,
						hideExt: false,
						prefix: 'vendorsite_',
						hideLabel: true
					},
                    {
                        xtype: 'hidden',
                        name: 'vendorsite_phone_id'
                    }
                ]
            },
            {
                xtype: 'textfield',
                fieldLabel: this.faxInputLabel,
                name: 'vendorsite_fax_phone_number'
            },
            {
                xtype: 'hidden',
                name: 'vendorsite_fax_id'
            },
            {
                xtype: 'fieldcontainer',
                fieldLabel: this.contactInputLabel,
                layout: 'vbox',
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: this.contactFirstnameInputLabel,
                        width: 345,
                        name: 'person_firstname'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: this.contactLastnameInputLabel,
                        width: 345,
                        name: 'person_lastname'
                    }
                ]
            },
            {
                xtype: 'fieldcontainer',
                fieldLabel: this.phoneContactInputLabel,
                name: 'contact_phone',
                layout: 'hbox',
                items: [
					{
						xtype: 'shared.phone',
						hideCountry: false,
						hideExt: false,
						prefix: 'attention_',
						hideLabel: true
					},
                    {
                        xtype: 'hidden',
                        name: 'attention_phone_id'
                    }
                ]
            },
            {
                xtype: 'textfield',
                fieldLabel: this.accountNumberInputLabel,
                name: 'vendorsite_account_number'
            },
            {
                xtype: 'checkbox',
                fieldLabel:this.printViewInputLabel,
                name: 'vendorsite_display_account_number_po'
            },
            {
                xtype: 'shared.yesnofield',
                fieldLabel: this.taxReportableInputLabel,
                name: 'vendor_type1099'
            },
            {
                xtype: 'hidden',
                name: 'term_id',
                value: ''
            },
            {
                xtype: 'hidden',
                name: 'paydatebasis_code',
                value: ''
            },
            {
                xtype: 'hidden',
                name: 'paymentmethod_code',
                value: ''
            },
            {
                xtype: 'hidden',
                name: 'paygroup_code',
                value: 'DEFAULT'
            },
            {
                xtype: 'hidden',
                name: 'vendor_termsdatebasis',
                value: ''
            },
            {
                xtype: 'hidden',
                name: 'vendor_paypriority',
                value: ''
            },
            {
                xtype: 'hidden',
                name: 'approval_tracking_id',
                value: ''
            },
            {
                xtype: 'hidden',
                name: 'vendor_status',
                value: ''
            },
            {
                xtype: 'hidden',
                name: 'vendorsite_favorite',
                value: 'Y'
            }

        ];


		if (this.opened) {
			this.items.push({
				xtype: 'checkbox',
				name: 'remit_req',
				fieldLabel: this.remittanceAdviceInputLabel
			});
			this.items.push({
				xtype: 'checkbox',
				name: 'insurance_req',
				fieldLabel: this.requiresVendorInputLabel
			});
		} else {
			this.items.push(
				{
					xtype: 'hidden',
					name: 'default_paymenttype_id',
					value: '0'
				},
				{
					xtype: 'hidden',
					name: 'default_due_datetm',
					value: '30'
				}
			);
		}

		this.addCustomFields(this.customFields);
		this.callParent(arguments);
	},

	addCustomFields: function(fields) {
		var that = this;

		Ext.Array.each(fields, function(fieldData) {
			that.items.push(
				{
					xtype     : 'shared.customfield',
					fieldLabel: fieldData['customfield_label'],
					entityType: fieldData['customfield_pn_type'],
					type      : fieldData['customfield_type'],
					name      : fieldData['customfield_name'],
					number    : fieldData['universal_field_number'],
					allowBlank: !fieldData['customfield_required'],
					fieldCfg  : {value: fieldData['customfield_name']},
					value: "checked"
				});
		});
	}
});