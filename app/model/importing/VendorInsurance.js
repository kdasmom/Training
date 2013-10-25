/**
 * Model for a VendorUtility
 *
 * @author Yura Rodchyn
 */
Ext.define('NP.model.importing.VendorInsurance', {
    extend: 'Ext.data.Model',
    
    fields: [
        { name: "integration_package_name" },
        { name: "vendor_id_alt" },
        { name: "insurancetype_name" },
        { name: "insurance_company" },
        { name: "insurance_policynum" },
        { name: "insurance_policy_effective_datetm" },
        { name: "insurance_expdatetm" },
        { name: "insurance_policy_limit" },
        { name: "insurance_additional_insured_listed" },
        { name: "property_id_alt" },
        { name: "validation_status" },
        { name: "validation_errors" }
    ]
});
