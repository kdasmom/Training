/**
 * Model for a VendorUtility
 *
 * @author Yura Rodchyn
 */
Ext.define('NP.model.importing.VendorUtility', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'vendor_id_alt' },
        { name: 'UtilityType' },
		{ name: 'UtilityAccount_AccountNumber' },
		{ name: 'property_id_alt' },
        { name: 'unit_id_alt' },
        { name: 'UtilityAccount_MeterSize' },
        { name: 'glaccount_number' },
        { name: 'validation_status' },
        { name: 'validation_errors' }
	]
});
