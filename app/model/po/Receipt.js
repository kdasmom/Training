/**
 * Model for a Receipt
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.po.Receipt', {
	extend: 'Ext.data.Model',
	
	requires: [
		'NP.lib.core.Config',
		'NP.model.vendor.Vendor',
		'NP.model.property.Property',
		'NP.model.system.PriorityFlag'
	],

	idProperty: 'receipt_id',
	fields: [
		{ name: 'receipt_id', type: 'int' },
		{ name: 'purchaseorder_id', type: 'int' },
		{ name: 'property_id', type: 'int' },
		{ name: 'vendor_id', type: 'int' },
		{ name: 'userprofile_id', type: 'int' },
		{ name: 'receipt_createdt', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'receipt_approvedt', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'receipt_lastupdatedt', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'receipt_ref' },
		{ name: 'receipt_reject_note' },
		{ name: 'receipt_note' },
		{ name: 'receipt_status' },
		{ name: 'receipt_vendorref' },
		{ name: 'sysdatetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'receipt_period', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'receipt_receivedondt', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'receipt_customnote' },
		{ name: 'gl_transfer', type: 'int' },
		{ name: 'transfer_dt', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'receipt_revert_note' },
		{ name: 'delegation_to_userprofile_id', type: 'int' },

		// These fields are not database columns
		{ name: 'entity_amount', type: 'float' },
		{ name: 'created_by' },
		{ name: 'pending_days', type: 'int' },
		{ name: 'pending_approval_days', type: 'int' },
		{ name: 'last_approved_datetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'last_approved_by' },
		{ name: 'rejected_datetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'rejected_by' }
	],

    belongsTo: [
        {
			model     : 'NP.model.vendor.Vendor',
			name      : 'vendor',
			getterName: 'getVendor',
			foreignKey: 'vendor_id',
			primaryKey: 'vendor_id',
			reader    : 'jsonflat'
        },{
			model     : 'NP.model.property.Property',
			name      : 'property',
			getterName: 'getProperty',
			foreignKey: 'property_id',
			primaryKey: 'property_id',
			reader    : 'jsonflat'
        },{
			model     : 'NP.model.system.PriorityFlag',
			name      : 'priorityFlag',
			getterName: 'getPriorityFlag',
			foreignKey: 'PriorityFlag_ID_Alt',
			primaryKey: 'PriorityFlag_ID_Alt',
			reader    : 'jsonflat'
        }
    ],
});