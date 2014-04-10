/**
 * Model for a Receipt
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.po.Receipt', {
	extend: 'Ext.data.Model',
	
	requires: [
		'NP.lib.core.Config'
	],

	idProperty: 'receipt_id',
	fields: [
		{ name: 'receipt_id', type: 'int' },
		{ name: 'purchaseorder_id', type: 'int' },
		{ name: 'property_id', type: 'int' },
		{ name: 'vendor_id', type: 'int' },
		{ name: 'userprofile_id', type: 'int' },
		{ name: 'receipt_createdt', type: 'date' },
		{ name: 'receipt_approvedt', type: 'date' },
		{ name: 'receipt_lastupdatedt', type: 'date' },
		{ name: 'receipt_ref' },
		{ name: 'receipt_reject_note' },
		{ name: 'receipt_note' },
		{ name: 'receipt_status' },
		{ name: 'receipt_vendorref' },
		{ name: 'sysdatetm', type: 'date' },
		{ name: 'receipt_period', type: 'date' },
		{ name: 'receipt_receivedondt', type: 'date' },
		{ name: 'receipt_customnote' },
		{ name: 'gl_transfer', type: 'int' },
		{ name: 'transfer_dt', type: 'date' },
		{ name: 'receipt_revert_note' },
		{ name: 'delegation_to_userprofile_id', type: 'int' },

		// These fields are not database columns
		{ name: 'vendor_id', type: 'int' },
		{ name: 'vendor_id_alt' },
		{ name: 'vendor_name' },
		{ name: 'vendorsite_id', type: 'int' },

		{ name: 'property_id', type: 'int' },
		{ name: 'property_id_alt' },
		{ name: 'property_name' },

		{ name: 'PriorityFlag_Display' },

		{ name: 'entity_amount', type: 'float' },
		{ name: 'created_by' },
		{ name: 'pending_days', type: 'int' },
		{ name: 'pending_approval_days', type: 'int' },
		{ name: 'last_approved_datetm', type: 'date' },
		{ name: 'last_approved_by' },
		{ name: 'rejected_datetm', type: 'date' },
		{ name: 'rejected_by' },
		{ name: 'rejected_reason' }
	]
});