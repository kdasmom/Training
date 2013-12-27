/**
 * Model for a ImageToCD
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.image.ImageToCD', {
	extend: 'Ext.data.Model',
	
	idProperty: 'ImageToCD_ID',
	fields: [
		{ name: 'ImageToCD_ID', type: 'int' },
		{ name: 'ImageToCD_diskNum', type: 'int' },
		{ name: 'ImageToCD_notes' },
		{ name: 'ImageToCD_createddatetm', type: 'date' },
		{ name: 'created_userprofile_ID', type: 'int' },
		{ name: 'image_index_ID', type: 'int' },
		{ name: 'tablekey_id', type: 'int' },
		{ name: 'table_name' },
		{ name: 'image_scan_datetm', type: 'date' },

		// These fields are no DB columns in the ImageToCD table
		{ name: 'Image_Index_Amount', type: 'float' },
		{ name: 'ref_number' },

		{ name: 'vendor_name' },

		{ name: 'image_doctype_name' }
	]
});