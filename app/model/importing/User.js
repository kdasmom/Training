/**
 * Model for a User
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.importing.User', {
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: 'person_firstname' },
		{ name: 'person_middlename' },
		{ name: 'person_lastname' },
		{ name: 'userprofile_username' },
		{ name: 'role_name' },
		{ name: 'address_line1' },
		{ name: 'address_line2' },
		{ name: 'address_city' },
		{ name: 'address_state' },
		{ name: 'address_zip' },
		{ name: 'email_address' },
		{ name: 'home_phone_number' },
        { name: 'work_phone_number' },
        { name: 'validation_status' },
        { name: 'validation_errors' }
	]
});