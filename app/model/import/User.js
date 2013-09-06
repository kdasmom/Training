/**
 * Model for a User
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.import.User', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'FirstName' },
		{ name: 'MiddleName' },
		{ name: 'LastName' },
		{ name: 'Username' },
		{ name: 'UserGroup' },
		{ name: 'Address1' },
		{ name: 'Address2' },
		{ name: 'City' },
		{ name: 'State' },
		{ name: 'Zip' },
		{ name: 'EmailAddress' },
		{ name: 'HomePhone' },
                { name: 'WorkPhone' },
                { name: 'validation_status' }
	]
});