/**
 * Model for a ImageDocType
 *
 * @author 
 */
Ext.define('NP.model.image.ImageDocType', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'image_doctype_id',
	fields: [
		{ name: 'image_doctype_id', type: 'int' },
		{ name: 'image_doctype_name' },
		{ name: 'image_doctype_default', type: 'int' },
		{ name: 'tableref_id', type: 'int' },
		{ name: 'universal_field_status', type: 'int' }
	]
});