/**
 * Model for a Purchaseorder
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.po.Purchaseorder', {
	extend: 'Ext.data.Model',
	
	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Translator'
	],

	idProperty: 'purchaseorder_id',
	fields: [
		{ name: 'purchaseorder_id', type: 'int' },
		{ name: 'sent_vendor_portal_flag', type: 'int' },
		{ name: 'purchaseorder_quote' },
		{ name: 'purchaseorder_quoteamount' },
		{ name: 'vendorsite_id', type: 'int' },
		{ name: 'purchaseorder_status', defaultValue: 'open' },
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
		{ name: 'is_cancelled', type: 'int', defaultValue: 0 },

		{ name: 'vendor_id', type: 'int' },
		{ name: 'vendor_id_alt' },
		{ name: 'vendor_name' },
		{ name: 'vendor_status' },
		{ name: 'vendorsite_id', type: 'int' },
		{ name: 'vendorsite_status' },

		{ name: 'property_id', type: 'int' },
		{ name: 'property_id_alt' },
		{ name: 'property_name' },

		{ name: 'PriorityFlag_Display' },
		
		{ name: 'received_status'},
		
		{ name: 'sent_to_vendor_datetm', type: 'date' },

		{ name: 'entity_amount', type: 'float' },
		{ name: 'created_by' },
		{ name: 'userprofile_id', type: 'int' },
    	{ name: 'userprofile_username' },
		{ name: 'pending_days', type: 'int' },
		{ name: 'pending_approval_days', type: 'int' },
		{ name: 'last_approved_datetm', type: 'date' },
		{ name: 'last_approved_by' },
		{ name: 'rejected_datetm', type: 'date' },
		{ name: 'rejected_by' },
		{ name: 'rejected_reason' },

		// Vendor address
		{ name: 'address_line1', useNull: false },
		{ name: 'address_line2', useNull: false },
		{ name: 'address_city', useNull: false },
		{ name: 'address_state', useNull: false },
		{ name: 'address_zip', useNull: false },
		{ name: 'address_zipext', useNull: false },
		{ name: 'address_country', type: 'int' },

		// Vendor phone
		{ name: 'phone_number' },
		{ name: 'phone_ext' },
		{ name: 'phone_countrycode' },

		// Property address
		{ name: 'property_address_line1', useNull: false },
		{ name: 'property_address_line2', useNull: false },
		{ name: 'property_address_city', useNull: false },
		{ name: 'property_address_state', useNull: false },
		{ name: 'property_address_zip', useNull: false },
		{ name: 'property_address_zipext', useNull: false },
		{ name: 'property_address_country', type: 'int' },

		// Property phone
		{ name: 'property_phone_number' },
		{ name: 'property_phone_ext' },
		{ name: 'property_phone_countrycode' }
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
    },

    isModifiable: function() {
        var me = this;

        if (NP.Security.hasPermission(6074)) {
            return true;
        }

        if (NP.Security.hasPermission(6075) 
                && NP.Security.getUser().get('userprofile_id') == me.get('userprofile_id')) {
            return true;
        }

        return false;
    },

    isEditable: function() {
		var me      = this,
			status  = me.get('purchaseorder_status');

		if (
			(status == 'open' && me.isModifiable())
			|| (status == 'saved' && NP.Security.hasPermission(6011))
		) {
			return true;
		}

		return false;
	},
    
    isLineEditable: function() {
        var me = this,
            status  = me.get('purchaseorder_status');

        if (
        	(status == 'draft' && NP.Security.hasPermission(2007))
            || (status == 'open' && (NP.Security.hasPermission(1032) || NP.Security.hasPermission(6076) || NP.Security.hasPermission(6077)))
            || (status == 'saved' && NP.Security.hasPermission(1068) && me.isModifiable())
            || (status == 'paid' && NP.Security.hasPermission(2094))
        ) {
            return true;
        }

        return false;
    },

    isLineAddable: function() {
		var me      = this,
			status  = me.get('purchaseorder_status');

		if (
			(
				status == 'open' 
				&& (
					NP.Security.hasPermission(1027) 
					|| NP.Security.hasPermission(6074) 
					|| NP.Security.hasPermission(6075)
				)
			)
			|| (status == 'saved' && NP.Security.hasPermission(6011))
		) {
			return true;
		}

		return false;
	},

	getDisplayStatus: function() {
		var me     = this,
			status = (me.get('purchaseorder_id') === null) ? 'New' : me.get('purchaseorder_status');
		
		return NP.model.po.Purchaseorder.getDisplayStatus(status, me.get('is_cancelled'));
	},

	statics: {
		getDisplayStatus: function(status, is_cancelled) {
			if (is_cancelled == 1) {
				status = 'Cancelled';
			} else if (status == 'forapproval') {
				status = 'Pending Approval';
			} else if (status == 'open') {
				status = 'In Progress';
			} else if (status == 'saved') {
				status = 'Released';
			} else if (status == 'draft') {
				status = 'Template';
			} else if (status == 'closed') {
				status = 'Invoiced';
			} else {
				status = Ext.util.Format.capitalize(status);
			}

			return NP.Translator.translate(status);
		}
	}
});