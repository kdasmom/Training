/**
 * Model for a InvoiceImageSource
 *
 * @author 
 */
Ext.define('NP.model.image.InvoiceImageSource', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'invoiceimage_source_id',
	fields: [
		{ name: 'invoiceimage_source_id', type: 'int' },
		{ name: 'invoiceimage_source_name' },
		{ name: 'IMAGESOURCE_id_alt', type: 'int' }
	]
});