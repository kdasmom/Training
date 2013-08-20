/**
 * Model for a Vendor
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.import.VendorFavorites', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'VendorCode' },
                { name: 'PropertyCode' },
		{ name: 'IntegrationPackage' },
		{ name: 'validation_status' }
	]
});