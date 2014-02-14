/**
 * Model for an Invoice entity
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.invoice.Invoice', {
    extend: 'Ext.data.Model',
    
    requires: [
		'NP.lib.core.Security',
		'NP.lib.core.Config'
	],
    
    idProperty: 'invoice_id',
    fields: [
    	{ name: 'invoice_id', type: 'int' },
		{ name: 'reftable_name' },
		{ name: 'invoice_datetm', type: 'date' },
		{ name: 'invoice_createddatetm', type: 'date' },
		{ name: 'invoice_status', defaultValue: 'open' },
		{ name: 'invoice_budgetid', type: 'int' },
		{ name: 'invoice_glaccountid', type: 'int' },
		{ name: 'paytable_name', defaultValue: 'vendorsite' },
		{ name: 'paytablekey_id', type: 'int' },
		{ name: 'property_id', type: 'int' },
		{ name: 'invoice_ref' },
		{ name: 'invoice_note' },
		{ name: 'invoice_duedate', type: 'date' },
		{ name: 'invoice_submitteddate', type: 'date' },
		{ name: 'invoicetype_id', type: 'int' },
		{ name: 'frequency_id', type: 'int' },
		{ name: 'invoice_startdate', type: 'date' },
		{ name: 'invoice_endate', type: 'date' },
		{ name: 'invoice_activityday', type: 'int' },
		{ name: 'invoice_dueday', type: 'int' },
		{ name: 'invoice_paymentmethod' },
		{ name: 'invoicepayment_type_id', type: 'int' },
		{ name: 'project_id' },
		{ name: 'task_id' },
		{ name: 'imagekey_id', type: 'int' },
		{ name: 'invoiced_amount' },
		{ name: 'initial_amount' },
		{ name: 'invoice_reject_note' },
		{ name: 'invoice_period', type: 'date' },
		{ name: 'control_amount', type: 'float' },
		{ name: 'invoice_multiproperty', type: 'int' },
		{ name: 'invoice_taxallflag', type: 'int' },
		{ name: 'invoice_budgetoverage_note' },
		{ name: 'invoice_cycle_from', type: 'date' },
		{ name: 'invoice_cycle_to', type: 'date' },
		{ name: 'vendor_code' },
		{ name: 'lock_id', type: 'int' },
		{ name: 'universal_field1' },
		{ name: 'universal_field2' },
		{ name: 'universal_field3' },
		{ name: 'reftablekey_id' },
		{ name: 'remit_advice', type: 'int' },
		{ name: 'vendoraccess_notes' },
		{ name: 'PriorityFlag_ID_Alt', type: 'int', defaultValue: 1 },
		{ name: 'invoice_NeededBy_datetm', type: 'date' },
		{ name: 'universal_field4' },
		{ name: 'universal_field5' },
		{ name: 'universal_field6' },
		{ name: 'universal_field7' },
		{ name: 'universal_field8' },
		{ name: 'payablesconnect_flag' },
		{ name: 'address_id', type: 'int' },
		{ name: 'template_name' },

		// These fields are not in the INVOICE table
		{ name: 'vendor_id', type: 'int' },
		{ name: 'vendor_id_alt' },
		{ name: 'vendor_name' },
		{ name: 'vendorsite_id', type: 'int' },

		{ name: 'property_id', type: 'int' },
		{ name: 'property_id_alt' },
		{ name: 'property_name' },

		{ name: 'PriorityFlag_Display' },

		{ name: 'entity_amount', type: 'float', default_value: 0 },
		{ name: 'shipping_amount', type: 'float', default_value: 0, useNull: false },
		{ name: 'tax_amount', type: 'float', default_value: 0, useNull: false },
		{ name: 'integration_package_type_display_name' },
		{ name: 'userprofile_id', type: 'int' },
    	{ name: 'userprofile_username' },
    	{ name: 'created_by' },
		{ name: 'rejected_datetm', type: 'date' },
		{ name: 'rejected_by' },
		{ name: 'rejected_reason' },
		{ name: 'invoice_pending_days', type: 'int' },
		{ name: 'invoice_onhold_by' },
		{ name: 'invoice_days_onhold', type: 'int' },
		{ name: 'invoice_onhold_reason' },
		{ name: 'invoice_onhold_notes' },
		{ name: 'invoice_hold_datetm', type: 'date' },
		{ name: 'invoicepayment_type' },
		{ name: 'pending_approval_days', type: 'int' },
		{ name: 'pending_approval_for' },
		{ name: 'last_approved_datetm', type: 'date' },
		{ name: 'last_approved_by' },
		{ name: 'void_datetm', type: 'date' },
		{ name: 'void_by' },
		{ name: 'payment_details' },
		{ name: 'payment_amount_remaining', type: 'float' },

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

    isModifiable: function() {
        var me = this;

        if (NP.Security.hasPermission(6076)) {
            return true;
        }

        if (NP.Security.hasPermission(6077) 
                && NP.Security.getUser().get('userprofile_id') == me.get('userprofile_id')) {
            return true;
        }

        return false;
    },

    isEditable: function() {
		var me      = this,
			status  = me.get('invoice_status');

		if (
			(status == 'open' && me.isModifiable())
			|| (status == 'saved' && NP.Security.hasPermission(1068))
			|| (status == 'paid' && NP.Security.hasPermission(2094))
		) {
			return true;
		}

		return false;
	},
    
    isLineEditable: function() {
        var me = this,
            status  = me.get('invoice_status');

        if (
            (status == 'open' && (NP.Security.hasPermission(1032) || NP.Security.hasPermission(6076) || NP.Security.hasPermission(6077)))
            || (status == 'saved' && NP.Security.hasPermission(1068) && me.isModifiable())
            || (status == 'paid' && NP.Security.hasPermission(2094))
        ) {
            return true;
        }

        return false;
    },

    isLineAddable: function() {
		var me      = this,
			status  = me.get('invoice_status');

		if (
			(
				status == 'open' 
				&& (
					NP.Security.hasPermission(1032) 
					|| NP.Security.hasPermission(6076) 
					|| NP.Security.hasPermission(6077)
				)
			)
			|| (status == 'saved' && NP.Security.hasPermission(1068))
		) {
			return true;
		}

		return false;
	},

	getDisplayStatus: function() {
		return NP.model.invoice.Invoice.getDisplayStatus(
			this.get('invoice_status')
		);
	},

	statics: {
		getDisplayStatus: function(status) {
			if (status == 'forapproval') {
				return 'Pending Approval';
			} else if (status == 'open') {
				return 'In Progress';
			} else if (status == 'saved') {
				return 'Completed';
			} else if (status == 'draft') {
				return 'Template';
			} else if (status == 'closed') {
				return 'Invoiced';
			} else {
				return Ext.util.Format.capitalize(status);
			}
		}
	}
});