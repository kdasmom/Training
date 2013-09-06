/**
 * Model for an Invoice entity
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.invoice.Invoice', {
    extend: 'Ext.data.Model',
    
    requires: [
		'NP.lib.core.Config',
		'NP.model.vendor.Vendorsite',
		'NP.model.property.Property'
	],
    
    idProperty: 'invoice_id',
    fields: [
    	{ name: 'invoice_id', type: 'int' },
		{ name: 'reftable_name' },
		{ name: 'invoice_datetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'invoice_createddatetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'invoice_status' },
		{ name: 'invoice_budgetid', type: 'int' },
		{ name: 'invoice_glaccountid', type: 'int' },
		{ name: 'paytable_name' },
		{ name: 'paytablekey_id', type: 'int' },
		{ name: 'property_id', type: 'int' },
		{ name: 'invoice_ref' },
		{ name: 'invoice_note' },
		{ name: 'invoice_duedate', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'invoice_submitteddate', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'invoicetype_id', type: 'int' },
		{ name: 'frequency_id', type: 'int' },
		{ name: 'invoice_startdate', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'invoice_endate', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
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
		{ name: 'invoice_period', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'control_amount' },
		{ name: 'invoice_multiproperty', type: 'int' },
		{ name: 'invoice_taxallflag', type: 'int' },
		{ name: 'invoice_budgetoverage_note' },
		{ name: 'invoice_cycle_from', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'invoice_cycle_to', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'vendor_code' },
		{ name: 'lock_id', type: 'int' },
		{ name: 'universal_field1' },
		{ name: 'universal_field2' },
		{ name: 'universal_field3' },
		{ name: 'reftablekey_id' },
		{ name: 'remit_advice', type: 'int' },
		{ name: 'vendoraccess_notes' },
		{ name: 'PriorityFlag_ID_Alt', type: 'int' },
		{ name: 'invoice_NeededBy_datetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'universal_field4' },
		{ name: 'universal_field5' },
		{ name: 'universal_field6' },
		{ name: 'universal_field7' },
		{ name: 'universal_field8' },
		{ name: 'payablesconnect_flag' },
		{ name: 'address_id', type: 'int' },
		{ name: 'invoicefromvendor_id', type: 'int' },
		{ name: 'template_name' },

		// These fields are not in the INVOICE table
		{ name: 'entity_amount', type: 'float' },
		{ name: 'integration_package_type_display_name' },
		{ name: 'userprofile_id', type: 'int' },
    	{ name: 'userprofile_username' },
    	{ name: 'created_by' },
		{ name: 'rejected_datetm', type: 'date', dateFormat: NP.lib.core.Config.getServerDateFormat() },
		{ name: 'rejected_by' },
		{ name: 'rejected_reason' },
		{ name: 'invoice_pending_days', type: 'int' },
		{ name: 'invoice_onhold_by' },
		{ name: 'invoice_days_onhold', type: 'int' }
    ],

    belongsTo: [
        {
			model     : 'NP.model.vendor.Vendorsite',
			name      : 'vendorsite',
			getterName: 'getVendorsite',
			foreignKey: 'paytablekey_id',
			primaryKey: 'vendorsite_id',
			reader    : 'jsonflat'
        },{
			model     : 'NP.model.property.Property',
			name      : 'property',
			getterName: 'getProperty',
			foreignKey: 'property_id',
			primaryKey: 'property_id',
			reader    : 'jsonflat'
        }
    ]
});