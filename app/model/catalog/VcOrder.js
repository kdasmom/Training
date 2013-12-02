/**
 * Created by Andrey Baranov
 * date: 12/2/13 11:14 AM
 */

Ext.define('NP.model.catalog.VcOrder', {
	extend: 'Ext.data.Model',

	requires: ['NP.lib.core.Config'],

	idProperty: 'vcorder_id',
	fields: [
		{ name: 'vcorder_id', type: 'int' },
		{ name: 'userprofile_id', type: 'int' },
		{ name: 'vcitem_id', type: 'int' },
		{ name: 'vcorder_qty', type: 'int' },
		{ name: 'vcitem_number' },
		{ name: 'vcitem_price' },
		{ name: 'vcitem_desc' },
		{ name: 'vcitem_uom' },
		{ name: 'vcitem_manufacturer' },
		{ name: 'vcitem_mft_partnumber' },
		{ name: 'UNSPSC_Commodity_Commodity', type: 'int' },
		{ name: 'vc_id', type: 'int' },
		{ name: 'vcorder_aux_part_id' }
	],

	validations: [
		{ field: 'userprofile_id', type: 'presence' },
		{ field: 'vcorder_qty', type: 'presence' },
		{ field: 'vcitem_number', type: 'length', max: 100 },
		{ field: 'vcitem_desc', type: 'length', max: 250 },
		{ field: 'vcitem_uom', type: 'length', max: 50 },
		{ field: 'vcitem_manufacturer', type: 'length', max: 50 },
		{ field: 'vcitem_mft_partnumber', type: 'length', max: 50 },
		{ field: 'vcorder_aux_part_id', type: 'length', max: 255 }
	]
});