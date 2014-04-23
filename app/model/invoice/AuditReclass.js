/**
 * Model for a AuditReclass
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.invoice.AuditReclass', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'auditreclass_id',
	fields: [
		{ name: 'auditreclass_id', type: 'int' },
		{ name: 'userprofile_id', type: 'int' },
		{ name: 'delegation_to_userprofile_id', type: 'int' },
		{ name: 'invoice_id', type: 'int' },
		{ name: 'audit_note' },
		{ name: 'auditreclass_date', type: 'date' },
		{ name: 'invoiceitem_id', type: 'int' },
		{ name: 'field' },
		{ name: 'old_val' },
		{ name: 'new_val' },

		// These fields are not columns in the AUDITRECLASS table,
		{ name: 'field_display' },

		{ name: 'userprofile_username' },

		{ name: 'delegation_to_userprofile_username' }
	]
});