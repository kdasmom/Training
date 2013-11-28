/**
 * Model for a ImageIndex
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.image.ImageIndex', {
	extend: 'Ext.data.Model',
	
	requires: [
		'NP.lib.core.Config',
		'NP.model.property.Property',
		'NP.model.vendor.Vendorsite',
		'NP.model.image.InvoiceImageSource',
		'NP.model.image.ImageDocType',
		'NP.model.invoice.Invoice',
		'NP.model.user.Userprofile',
		'NP.model.system.PriorityFlag'
	],

	idProperty: 'Image_Index_Id',
	fields: [
		{ name: 'Image_Index_Id', type: 'int' },
		{ name: 'Image_Index_Id_Alt', type: 'int' },
		{ name: 'Property_Id', type: 'int' },
                { name: 'Property_Alt_Id', type: 'int'},
		{ name: 'Image_Index_Name' },
		{ name: 'Image_Index_Type' },
		{ name: 'Image_Index_Ref' },
                { name: 'invoiceimage_ref'},
                { name: 'po_ref'},
                { name: 'invoiceimage_vendorsite_id' },
                { name: 'invoiceimage_vendorsite_alt_id' },
		{ name: 'Image_Index_VendorSite_Id', type: 'int' },
		{ name: 'Image_Index_Vendor_Id_Alt' },
		{ name: 'Image_Index_Invoice_Date', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'Image_Index_Due_Date', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'Image_Index_Amount' },
		{ name: 'Image_Index_PO_Ref' },
		{ name: 'Image_Index_User' },
		{ name: 'Image_Index_Date_Entered', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'Image_Index_DTS', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'Tablekey_Id', type: 'int' },
		{ name: 'Image_Index_Status', type: 'int' },
		{ name: 'Image_Index_Primary', type: 'int' },
		{ name: 'Image_Index_Source_Id', type: 'int' },
		{ name: 'asp_client_id', type: 'int' },
		{ name: 'Tableref_Id', type: 'int' },
		{ name: 'Image_Doctype_Id', type: 'int' },
		{ name: 'remit_advice', type: 'int' },
		{ name: 'image_index_draft_invoice_id', type: 'int' },
		{ name: 'image_index_notes' },
		{ name: 'universal_field1' },
		{ name: 'universal_field2' },
		{ name: 'universal_field3' },
		{ name: 'PriorityFlag_ID_Alt', type: 'int' },
		{ name: 'PriorityFlag_ID_Alt_invoice', type: 'int' },
		{ name: 'PriorityFlag_ID_Alt_po', type: 'int' },
		{ name: 'PriorityFlag_ID_Alt_vef', type: 'int' },
		{ name: 'image_index_NeededBy_datetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'universal_field4' },
		{ name: 'universal_field5' },
		{ name: 'universal_field6' },
		{ name: 'Image_Index_Exception_by', type: 'int' },
		{ name: 'Image_Index_Exception_datetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'Image_Index_Exception_End_datetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'Image_Index_Exception_reason' },
		{ name: 'universal_field7' },
		{ name: 'universal_field8' },
		{ name: 'image_index_indexed_datetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'image_index_indexed_by', type: 'int' },
		{ name: 'image_index_deleted_datetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'idimageindex' },
		{ name: 'image_index_GUID' },
		{ name: 'image_index_deleted_by', type: 'int' },
		{ name: 'utilityaccount_id', type: 'int' },
		{ name: 'cycle_from', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'cycle_to', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'utilityaccount_accountnumber' },
		{ name: 'utilityaccount_metersize' },

		// This field is not a database column
		{ name: 'days_outstanding', type: 'int' },
		{ name: 'pending_days', type: 'int' }
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
			model     : 'NP.model.image.ImageDocType',
			name      : 'docType',
			getterName: 'getDocType',
			foreignKey: 'Image_Doctype_Id',
			primaryKey: 'image_doctype_id',
			reader    : 'jsonflat'
        },{
			model     : 'NP.model.image.InvoiceImageSource',
			name      : 'source',
			getterName: 'getSource',
			foreignKey: 'Image_Index_Source_Id',
			primaryKey: 'invoiceimage_source_id',
			reader    : 'jsonflat'
        },{
			model     : 'NP.model.invoice.Invoice',
			name      : 'invoice',
			getterName: 'getInvoice',
			foreignKey: 'Tablekey_Id',
			primaryKey: 'invoice_id',
			reader    : 'jsonflat'
        },{
			model     : 'NP.model.user.Userprofile',
			name      : 'exceptionUser',
			getterName: 'getExceptionUser',
			foreignKey: 'Image_Index_Exception_by',
			primaryKey: 'userprofile_id',
			prefix    : 'exception_by_',
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
	validations: [
            { field: 'Image_Doctype_Id', type: 'presence' },
            { field: 'invoiceimage_vendorsite_id', type: 'presence' },
            { field: 'invoiceimage_vendorsite_alt_id', type: 'presence' },
            { field: 'Property_Id', type: 'presence' },
            { field: 'Property_Alt_Id', type: 'presence' },
	]
    
});