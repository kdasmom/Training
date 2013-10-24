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
        'NP.view.shared.YesNoField'
	],

	padding: 8,

	// For localization
	title                     : 'General info and settings',
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


        this.items = [
            {
                xtype: 'combo',
                fieldLabel: this.vendorTypeInputLabel,
                name: 'vendortype_id',
                displayField: 'vendortype_code',
                valueField: 'vendortype_id',
                store: Ext.create('NP.store.vendor.VendorTypes', {
                    service: 'VendorService',
                    action: 'findVendorTypes',
                    autoLoad: true
                }),
                allowBlank: false,
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
                xtype: 'combo',
                fieldLabel: this.taxPayorTypeInputLabel,
                name: 'taxpayor_type',
                displayField: 'lookupcode_code',
                valueField: 'lookupcode_id',
                store: Ext.create('NP.store.system.TaxPayorTypes', {
                    autoLoad: true
                })
            },
            {
                xtype: 'combo',
                fieldLabel: this.payeeTypeInputLabel,
                name: 'payee_type',
                displayField: 'lookupcode_code',
                valueField: 'lookupcode_id',
                store: Ext.create('NP.store.system.PayeeTypes', {
                    autoLoad: true
                })
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
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: '',
                        width: 200,
                        name: 'vendorsite_phone_number'
                    },
                    {
                        labelWidth: 50,
                        padding: '0 0 0 10',
                        xtype: 'textfield',
                        fieldLabel: this.phoneExtInputLabel,
                        width: 135,
                        name: 'vendorsite_phone_ext'
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
                        xtype: 'textfield',
                        fieldLabel: '',
                        width: 200,
                        name: 'attention_phone_number'
                    },
                    {
                        labelWidth: 50,
                        padding: '0 0 0 10',
                        xtype: 'textfield',
                        fieldLabel: this.phoneContactExtInputLabel,
                        width: 135,
                        name: 'attention_phone_ext'
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
				xtype: 'textfield',
				name: 'vendor_customernum',
				fieldLabel: this.customerNumberInputLabel
			});
			this.items.push({
				xtype: 'datefield',
				name: 'vendor_active_startdate',
				fieldLabel: this.activeStartDateInputLabel
			});
			this.items.push({
				xtype: 'datefield',
				name: 'vendor_active_enddate',
				fieldLabel: this.activeEndDateInputLabel
			});
			this.items.push({
				xtype: 'combobox',
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
				fieldLabel: this.defaultGlAccountInputLabel
			});
			this.items.push({
				xtype: 'combobox',
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
				})
			});
			this.items.push({
				xtype: 'combobox',
				name: 'default_due_datetm',
				displayField: 'day',
				fieldLabel: this.defaultDateSettingsInputLabel,
				store: daysStore
			});
			this.items.push({
				xtype: 'shared.yesnofield',
				name: 'Finance_Vendor',
				fieldLabel: this.financeVendorInputLabel
			});
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
			this.items.push({
				xtype: 'checkbox',
				name: '0_1_is_service_vendor',
				fieldLabel: this.requiresServiceCustomFieldsInputLabel
			});
			this.items.push({
				xtype: 'checkbox',
				name: '0_10_po_electronic_submit',
				fieldLabel: this.submitPosToVendorInputLabel
			});
			this.items.push({
				xtype: 'checkbox',
				name: '0_15_auto_email_po',
				fieldLabel: this.autoEmailInputLabel
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

		this.callParent(arguments);
	}
});