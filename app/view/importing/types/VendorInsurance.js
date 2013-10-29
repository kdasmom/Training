/**
 * Vendor Insurance import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.importing.types.VendorInsurance', {
    extend  : 'NP.view.importing.types.AbstractImportType',
    
    fieldName  : 'file_upload_vendor_insurance',

    // For localization
    tabTitle : 'Vendor Insurance',
    entityName : 'Vendor Insurance',
    sectionName: 'Vendor Setup',
    
    intPkgColText           : 'Integration Package Name',
    vendorIdColText         : 'Vendor ID',
    insuranceTypeColText    : 'Insurance Type',
    companyColText          : 'Company',
    policyNumColText        : 'Policy Number',
    effectiveDateColText    : 'Effective Date',
    expirationDateColText   : 'Expiration Date',
    policyLimitColText      : 'Policy Limit',
    additionalInsuredColText: 'Additional Insured',
    propertyIdColText       : 'Property ID',

    getGrid: function() {
        return {
            columns: {
                items: [
                    {
                        text     : this.intPkgColText,
                        dataIndex: 'integration_package_name'
                    },{
                        text     : this.vendorIdColText,
                        dataIndex: 'vendor_id_alt'
                    },{
                        text     : this.insuranceTypeColText,
                        dataIndex: 'insurancetype_name'
                    },{
                        text     : this.companyColText,
                        dataIndex: 'insurance_company'
                    },{
                        text     : this.policyNumColText,
                        dataIndex: 'insurance_policynum'
                    },{
                        text     : this.effectiveDateColText,
                        dataIndex: 'insurance_policy_effective_datetm'
                    },{
                        text     : this.expirationDateColText,
                        dataIndex: 'insurance_expdatetm'
                    },{
                        text     : this.policyLimitColText,
                        dataIndex: 'insurance_policy_limit'
                    },{
                        text     : this.additionalInsuredColText,
                        dataIndex: 'insurance_additional_insured_listed'
                    },{
                        text     : this.propertyIdColText,
                        dataIndex: 'property_id_alt'
                    }
                ]
            }
        };
    }

});
