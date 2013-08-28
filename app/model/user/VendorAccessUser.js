/**
 * Model for a VendorAccessUser
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.user.VendorAccessUser', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'vendor_user_id',
	fields: [
		{ name: 'vendor_user_id', type: 'int' },
		{ name: 'access_username' },
		{ name: 'access_password' },
		{ name: 'active_flag', type: 'int' },
		{ name: 'po_access', type: 'int' },
		{ name: 'last_update_datetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'default_property_id', type: 'int' },
		{ name: 'default_vendor_id', type: 'int' },
		{ name: 'vendor_name' },
		{ name: 'vendor_fedid' },
		{ name: 'address_line1' },
		{ name: 'address_line2' },
		{ name: 'address_city' },
		{ name: 'address_state' },
		{ name: 'address_zip' },
		{ name: 'phone' },
		{ name: 'email' },
		{ name: 'first_name' },
		{ name: 'last_name' },
		{ name: 'title' },
		{ name: 'pc_vendor_user_id', type: 'int' },
		{ name: 'default_integration_package_id', type: 'int' }
	]
});