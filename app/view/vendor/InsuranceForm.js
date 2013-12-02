/**
 * Created by rnixx on 10/7/13.
 */


Ext.define('NP.view.vendor.InsuranceForm', {
    extend: 'NP.lib.ui.BoundForm',
    alias: 'widget.vendor.insuranceform',

    requires: [
        'NP.lib.core.Security',
        'NP.lib.ui.ComboBox',
        'NP.lib.core.Config',
        'NP.view.shared.button.New',
        'NP.view.shared.button.Delete',
		'NP.lib.core.Util'
    ],

    padding: 8,

    startIndex: 0,

    // For localization
    typeInputLabelText: 'Type',
    companyInputLabelText: 'Company',
    policyNumberInputLabelText: 'Policy Number',
    effectiveDateInputLabelText: 'Effective Date',
    expDateInputLabelText: 'Exp. Date',
    policyLimitInputLabelText: 'Policy Limit',
    additionalInsuranceInputLabelText: 'Additional Insured',

    // Custom options
    startIndex: 0,

    initComponent: function() {
        var that = this;

        this.defaults = {
            labelWidth: 150
        };

		this.border = 0;

        this.items = [
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                margin: '0 0 0 0',
                items: [
                    {
                        xtype: 'combo',
                        fieldLabel: this.typeInputLabelText,
                        name: 'insurancetype_id',
                        padding: '0 0 0 5',
                        labelWidth: 80,
                        displayField: 'insurancetype_name',
						labelAlign: 'top',
                        valueField: 'insurancetype_id',
                        store: Ext.create('NP.store.vendor.InsuranceTypes', {
                                service         : 'InsuranceService',
                                action          : 'getAllTypes',
                                autoLoad    : true
                        }),
						value: this.modelData ? this.modelData['insurancetype_id'] : ''
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: this.companyInputLabelText,
                        name: 'insurance_company',
                        padding: '0 0 0 5',
						labelAlign: 'top',
                        labelWidth: 80,
						value: this.modelData ? this.modelData['insurance_company'] : ''
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: this.policyNumberInputLabelText,
                        name: 'insurance_policynum',
                        padding: '0 0 0 5',
						labelAlign: 'top',
                        labelWidth: 80,
						value: this.modelData ? this.modelData['insurance_policynum'] : ''
                    },
                    {
                        xtype: 'datefield',
                        fieldLabel: this.effectiveDateInputLabelText,
                        name: 'insurance_policy_effective_datetm',
                        padding: '0 0 0 5',
                        labelWidth: 80,
						labelAlign: 'top',
						value: this.modelData ? Ext.Date.format(new Date(this.modelData['insurance_policy_effective_datetm']), 'm/d/Y') : ''
                    },
                    {
                        xtype: 'datefield',
                        fieldLabel: this.expDateInputLabelText,
                        name: 'insurance_expdatetm',
                        padding: '0 0 0 5',
                        labelWidth: 80,
						labelAlign: 'top',
						value: this.modelData ? Ext.Date.format(new Date(this.modelData['insurance_expdatetm']), 'm/d/Y') : ''
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: this.policyLimitInputLabelText,
                        name: 'insurance_policy_limit',
                        padding: '0 0 0 5',
                        labelWidth: 80,
						labelAlign: 'top',
						value: this.modelData ? this.modelData['insurance_policy_limit'] : ''
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: this.additionalInsuranceInputLabelText,
                        name: 'insurance_additional_insured_listed',
                        padding: '0 0 0 5',
                        labelWidth: 80,
						labelAlign: 'top',
						value: this.modelData ? this.modelData['insurance_additional_insured_listed'] : ''
                    },
                    {
                        xtype: 'hidden',
                        name: 'insurance_id',
						value: this.modelData ? this.modelData['insurance_id'] : ''
                    },
                    {
                        xtype: 'shared.button.delete',
                        margin: '17 0 0 15',
                        handler: function() {
                            that.destroy();
                        }
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});