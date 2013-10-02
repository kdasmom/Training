/**
 * Model for a VendorUtility
 *
 * @author Yura Rodchyn
 */
Ext.define('NP.model.import.VendorGL', {
	extend: 'Ext.data.Model',
	
	fields: [
        { name: "vendor_id_alt" },
        { name: "glaccount_number" },
        { name: "integration_package_name" },
        { name: 'validation_status' },
        { name: 'validation_errors' }
	]
});
