/**
 * Model for a ImageIndex
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.image.ImageIndex', {
	extend: 'Ext.data.Model',
	
	requires: [
		'NP.lib.core.Config'
	],

	idProperty: 'Image_Index_Id',
	fields: [
		{ name: 'Image_Index_Id', type: 'int' },
		{ name: 'Image_Index_Id_Alt', type: 'int' },
		{ name: 'Property_Id', type: 'int' },
		{ name: 'Image_Index_Name' },
		{ name: 'Image_Index_Type' },
		{ name: 'Image_Index_Ref' },
		{ name: 'Image_Index_VendorSite_Id', type: 'int' },
		{ name: 'Image_Index_Vendor_Id_Alt' },
		{ name: 'Image_Index_Invoice_Date', type: 'date' },
		{ name: 'Image_Index_Due_Date', type: 'date' },
		{ name: 'Image_Index_Amount' },
		{ name: 'Image_Index_PO_Ref' },
		{ name: 'Image_Index_User' },
		{ name: 'Image_Index_Date_Entered', type: 'date' },
		{ name: 'Image_Index_DTS', type: 'date' },
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
		{ name: 'image_index_NeededBy_datetm', type: 'date' },
		{ name: 'universal_field4' },
		{ name: 'universal_field5' },
		{ name: 'universal_field6' },
		{ name: 'Image_Index_Exception_by', type: 'int' },
		{ name: 'Image_Index_Exception_datetm', type: 'date' },
		{ name: 'Image_Index_Exception_End_datetm', type: 'date' },
		{ name: 'Image_Index_Exception_reason' },
		{ name: 'universal_field7' },
		{ name: 'universal_field8' },
		{ name: 'image_index_indexed_datetm', type: 'date' },
		{ name: 'image_index_indexed_by', type: 'int' },
		{ name: 'image_index_deleted_datetm', type: 'date' },
		{ name: 'idimageindex' },
		{ name: 'image_index_GUID' },
		{ name: 'image_index_deleted_by', type: 'int' },
		{ name: 'utilityaccount_id', type: 'int' },
		{ name: 'cycle_from', type: 'date' },
		{ name: 'cycle_to', type: 'date' },
		{ name: 'utilityaccount_accountnumber' },
		{ name: 'utilityaccount_metersize' },

		// This field is not a database column
		{ name: 'vendor_id', type: 'int' },
		{ name: 'vendor_id_alt' },
		{ name: 'vendor_name' },
		{ name: 'vendorsite_id', type: 'int' },

		{ name: 'property_id', type: 'int' },
		{ name: 'property_id_alt' },
		{ name: 'property_name' },

		{ name: 'exception_by_userprofile_username' }, // for Image_Index_Exception_by

		{ name: 'PriorityFlag_Display' },

		{ name: 'image_doctype_name' },

		{ name: 'invoiceimage_source_name' },

		{ name: 'days_outstanding', type: 'int' },
		{ name: 'pending_days', type: 'int' },

		{ name: 'invoice_id', type: 'int' },
		{ name: 'invoice_ref' },
		{ name: 'invoice_NeededBy_datetm', type: 'date' },
		{ name: 'invoice_duedate', type: 'date' }
	]
});