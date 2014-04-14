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
		'NP.lib.core.Util',
		'NP.lib.core.Translator'
    ],

    padding: 8,

    initComponent: function() {
        var that = this;

		// For localization
		this.typeInputLabelText                = NP.Translator.translate('Type');
		this.companyInputLabelText             = NP.Translator.translate('Company');
		this.policyNumberInputLabelText        = NP.Translator.translate('Policy Number');
		this.effectiveDateInputLabelText       = NP.Translator.translate('Effective Date');
		this.expDateInputLabelText             = NP.Translator.translate('Exp. Date');
		this.policyLimitInputLabelText         = NP.Translator.translate('Policy Limit');
		this.additionalInsuranceInputLabelText = NP.Translator.translate('Additional Insured');
		this.propertyAssignmentInputLabelText  = NP.Translator.translate('Property Assignment');
		this.propertyAssignmentLinkName        = NP.Translator.translate('Assign/View Properties');

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
						xtype: 'displayfield',
                        fieldLabel: this.propertyAssignmentInputLabelText,
                        padding: '0 0 0 5',
                        labelWidth: 80,
						labelAlign: 'top',
						style : 'cursor: pointer',
						value: this.propertyAssignmentLinkName,
						listeners: {
							afterrender: function(component) {
								component.getEl().on('click', function() {
									Ext.create('NP.view.vendor.PropertyAssignerWindow', {
										data : that.queryById('insurance_properties_list_id' + that.startIndex).value,
										startIndex : that.startIndex
									}).show();
								});
							}
						}
                    },
                    {
                        xtype: 'hidden',
                        name: 'insurance_properties_list_id',
                        itemId: 'insurance_properties_list_id' + this.startIndex,
						value: this.modelData ? this.modelData['insurance_properties_list_id'] : []
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