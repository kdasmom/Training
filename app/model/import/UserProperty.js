/**
 * Model for a User Property
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.import.UserProperty', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'userprofile_username' },
		{ name: 'property_id_alt' },
        { name: 'validation_status' },
        { name: 'validation_errors' }
	]
});