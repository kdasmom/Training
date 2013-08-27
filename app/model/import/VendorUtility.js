/**
 * Model for a VendorUtility
 *
 * @author Yura Rodchyn
 */
Ext.define('NP.model.import.VendorUtility', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'Vendor_ID' },
        { name: 'Utility_Type' },
		{ name: 'Account_Number' },
		{ name: 'Property_ID' },
        { name: 'Unit_Id' },
        { name: 'Meter_Number' },
        { name: 'GL_Account' },
        { name: 'validation_status' }
	]
});
