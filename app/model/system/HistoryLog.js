/**
 * Model for a AuditLog
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.system.HistoryLog', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'auditlog_id',
	fields: [
		{ name: 'approve_id', type: 'int' },
		{ name: 'approve_datetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'approvetype_name' },
		{ name: 'message' },
		{ name: 'userprofile_username' },
		{ name: 'forwardto_tablename' },
		{ name: 'forwardto_tablekeyid', type: 'int' },
		{ name: 'glaccount_number' },
		{ name: 'approver' },
		{ name: 'transaction_id', type: 'int' }
	]
});