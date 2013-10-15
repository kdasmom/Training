/**
 * Created by rnixx on 10/7/13.
 */


Ext.define('NP.view.vendor.InsuranceForm', {
    extend: 'Ext.container.Container',
    alias: 'widget.vendor.insuranceform',

    requires: [
        'NP.lib.core.Security',
        'NP.lib.ui.ComboBox',
        'NP.lib.core.Config',
        'NP.view.shared.button.New',
        'NP.view.shared.button.Delete'
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
            labelWidth: 150,
            width: '100%'
        };

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
                        valueField: 'insurancetype_id',
                        store: Ext.create('NP.store.vendor.InsuranceTypes', {
                                service         : 'InsuranceService',
                                action          : 'getAllTypes',
                                autoLoad    : true
                        })
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: this.companyInputLabelText,
                        name: 'insurance_company',
                        padding: '0 0 0 5',
                        labelWidth: 80
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: this.policyNumberInputLabelText,
                        name: 'insurance_policynum',
                        padding: '0 0 0 5',
                        labelWidth: 80
                    },
                    {
                        xtype: 'datefield',
                        fieldLabel: this.effectiveDateInputLabelText,
                        name: 'insurance_policy_effective_datetm',
                        padding: '0 0 0 5',
                        labelWidth: 80
                    },
                    {
                        xtype: 'datefield',
                        fieldLabel: this.expDateInputLabelText,
                        name: 'insurance_expdatetm',
                        padding: '0 0 0 5',
                        labelWidth: 80
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: this.policyLimitInputLabelText,
                        name: 'insurance_policy_limit',
                        padding: '0 0 0 5',
                        labelWidth: 80
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: this.additionalInsuranceInputLabelText,
                        name: 'insurance_additional_insured_listed',
                        padding: '0 0 0 5',
                        labelWidth: 80
                    },
                    {
                        xtype: 'shared.button.delete',
                        hidden: that.startIndex > 0 ? false : true,
                        margin: '3 0 0 15',
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