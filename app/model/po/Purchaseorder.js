/**
 * Model for a Purchaseorder
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.po.Purchaseorder', {
	extend: 'Ext.data.Model',
	
	requires: [
		'NP.lib.core.Config',
		'NP.model.vendor.Vendorsite',
		'NP.model.property.Property',
		'NP.model.system.PriorityFlag'
	],

	idProperty: 'purchaseorder_id',
	fields: [
		{ name: 'purchaseorder_id', type: 'int' },
		{ name: 'sent_vendor_portal_flag', type: 'int' },
		{ name: 'purchaseorder_quote' },
		{ name: 'purchaseorder_quoteamount' },
		{ name: 'vendorsite_id', type: 'int' },
		{ name: 'purchaseorder_status' },
		{ name: 'purchaseorder_datetm', type: 'date' },
		{ name: 'purchaseorder_created', type: 'date' },
		{ name: 'property_id', type: 'int' },
		{ name: 'purchaseorder_note' },
		{ name: 'purchaseorder_closeddatetm', type: 'date' },
		{ name: 'project_id' },
		{ name: 'task_id' },
		{ name: 'purchaseorder_reject_note' },
		{ name: 'purchaseorder_period', type: 'date' },
		{ name: 'purchaseorder_multiproperty', type: 'int' },
		{ name: 'purchaseorder_taxallflag', type: 'int' },
		{ name: 'purchaseorder_ref' },
		{ name: 'purchaseorder_budgetoverage_note' },
		{ name: 'lock_id', type: 'int' },
		{ name: 'PriorityFlag_ID_Alt', type: 'int' },
		{ name: 'purchaseorder_NeededBy_datetm', type: 'date' },
		{ name: 'Purchaseorder_billaddress' },
		{ name: 'Purchaseorder_shipaddress' },
		{ name: 'Purchaseorder_bill_propertyID', type: 'int' },
		{ name: 'Purchaseorder_ship_propertyID', type: 'int' },
		{ name: 'purchaseorder_rct_req', type: 'int' },
		{ name: 'purchaseorder_rct_canReceive', type: 'int' },
		{ name: 'sysdatetm', type: 'date' },
		{ name: 'purchaseorder_rct_canReceive_userprofileID', type: 'int' },
		{ name: 'purchaseorder_rct_canReceive_dt', type: 'date' },
		{ name: 'address_id', type: 'int' },
		{ name: 'print_template_id', type: 'int' },
		{ name: 'universal_field1' },
		{ name: 'universal_field2' },
		{ name: 'universal_field3' },
		{ name: 'universal_field4' },
		{ name: 'universal_field5' },
		{ name: 'universal_field6' },
		{ name: 'universal_field7' },
		{ name: 'universal_field8' },

		// These fields are not database columns
		{ name: 'entity_amount', type: 'float' },
		{ name: 'created_by' },
		{ name: 'pending_days', type: 'int' },
		{ name: 'pending_approval_days', type: 'int' },
		{ name: 'last_approved_datetm', type: 'date' },
		{ name: 'last_approved_by' },
		{ name: 'rejected_datetm', type: 'date' },
		{ name: 'rejected_by' },
		{ name: 'rejected_reason' }
	],

    belongsTo: [
        {
			model     : 'NP.model.vendor.Vendorsite',
			name      : 'vendorsite',
			getterName: 'getVendorsite',
			foreignKey: 'vendorsite_id',
			primaryKey: 'vendorsite_id',
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

    getDisplayNumber: function() {
    	var showSetting = NP.Config.getSetting('CP.DISPLAY_PO_NUMBER_WHEN', 'Created=1; PendingApproval=1; Approved=1');
    	var status = this.get('purchaseorder_status');
    	if (showSetting.indexOf('Created=1') === -1 && status === 'open') {
    		return '';
    	} else if (showSetting.indexOf('PendingApproval=1') === -1 && status === 'forapproval') {
    		return '';
    	} else if (showSetting.indexOf('Approved=1') === -1 && status === 'saved') {
    		return '';
    	} else {
    		return this.get('purchaseorder_ref');
    	}
    }
});