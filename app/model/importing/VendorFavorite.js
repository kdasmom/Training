/**
 * Model for a Vendor Favorite
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.importing.VendorFavorite', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'vendor_id_alt' },
        { name: 'property_id_alt' },
		{ name: 'integration_package_name' },
		{ name: 'validation_status' },
		{ name: 'validation_errors' }
	]
});
