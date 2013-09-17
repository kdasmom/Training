/**
 * Model for a InvoicePoForward
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.shared.InvoicePoForward', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'invoicepo_forward_id',
	fields: [
		{ name: 'invoicepo_forward_id', type: 'int' },
		{ name: 'table_name' },
		{ name: 'tablekey_id', type: 'int' },
		{ name: 'forward_datetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'forward_to_email' },
		{ name: 'forward_to_userprofile_id', type: 'int' },
		{ name: 'forward_from_userprofile_id', type: 'int' },
		{ name: 'forward_message' },
		{ name: 'print_template_id', type: 'int' },
		{ name: 'from_delegation_to_userprofile_id', type: 'int' },

		// These fields are not DB columns
		{ name: 'from_userprofile_username' },
		{ name: 'from_person_firstname' },
		{ name: 'from_person_lastname' },
		{ name: 'to_userprofile_username' },
		{ name: 'to_person_firstname' },
		{ name: 'to_person_lastname' },
		{ name: 'delegation_userprofile_username' }
	]
});