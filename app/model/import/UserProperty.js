/**
 * Model for a User Property
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.import.UserProperty', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'Username' },
		{ name: 'PropertyCode' },
                { name: 'validation_status' },
	]
});