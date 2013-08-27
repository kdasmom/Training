/**
 * Model for a VendorUtility
 *
 * @author Yura Rodchyn
 */
Ext.define('NP.model.import.VendorInsurance', {
	extend: 'Ext.data.Model',
	
	fields: [
        { name: "Integration Package Name"},
        { name: "Vendor ID"},
        { name: "Insurance Type"},
        { name: "Company"},
        { name: "Policy Number"},
        { name: "Effective Date"},
        { name: "Expiration Date"},
        { name: "Policy Limit"},
        { name: "Additional Insured"},
        { name: "Property ID"}
	]
});
