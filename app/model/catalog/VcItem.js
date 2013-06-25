/**
 * Model for a VcItem
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.catalog.VcItem', {
	extend: 'Ext.data.Model',
	
	requires: [
		'NP.lib.core.Config',
		'NP.model.catalog.UnspscCommodity'
	],

	idProperty: 'vcitem_id',
	fields: [
		{ name: 'vcitem_id', type: 'int' },
		{ name: 'vc_id', type: 'int' },
		{ name: 'vcitem_status' },
		{ name: 'UNSPSC_Commodity_Commodity', type: 'int' },
		{ name: 'vcitem_category_name' },
		{ name: 'vcitem_type' },
		{ name: 'vcitem_number' },
		{ name: 'vcitem_price' },
		{ name: 'vcitem_desc' },
		{ name: 'vcitem_uom' },
		{ name: 'vcitem_pkg_qty' },
		{ name: 'vcitem_case_qty' },
		{ name: 'vcitem_desc_ext' },
		{ name: 'vcitem_min_qty' },
		{ name: 'vcitem_manufacturer' },
		{ name: 'vcitem_color' },
		{ name: 'vcitem_upc' },
		{ name: 'vcitem_mft_partnumber' },
		{ name: 'vcitem_imageurl' },
		{ name: 'vcitem_infourl' },
		{ name: 'universal_field1' },
		{ name: 'universal_field2' },
		{ name: 'universal_field3' },
		{ name: 'universal_field4' },
		{ name: 'universal_field5' },
		{ name: 'universal_field6' },
		{ name: 'vcitem_weight' }
	],

	belongsTo: {
		model     : 'NP.model.catalog.UnspscCommodity',
		name      : 'unspscCommodity',
		getterName: 'getUnspscCommodity',
		foreignKey: 'UNSPSC_Commodity_Commodity',
		primaryKey: 'UNSPSC_Commodity_Commodity',
		reader    : 'jsonflat'
	},

	validations: [
		{ field: 'vcitem_id', type: 'presence' },
		{ field: 'vcitem_category_name', type: 'length', max: 255 },
		{ field: 'vcitem_type', type: 'length', max: 255 },
		{ field: 'vcitem_number', type: 'length', max: 100 },
		{ field: 'vcitem_desc', type: 'length', max: 250 },
		{ field: 'vcitem_uom', type: 'length', max: 50 },
		{ field: 'vcitem_desc_ext', type: 'length', max: 2000 },
		{ field: 'vcitem_manufacturer', type: 'length', max: 50 },
		{ field: 'vcitem_color', type: 'length', max: 25 },
		{ field: 'vcitem_upc', type: 'length', max: 150 },
		{ field: 'vcitem_mft_partnumber', type: 'length', max: 50 },
		{ field: 'vcitem_imageurl', type: 'length', max: 500 },
		{ field: 'vcitem_infourl', type: 'length', max: 500 },
		{ field: 'universal_field1', type: 'length', max: 255 },
		{ field: 'universal_field2', type: 'length', max: 255 },
		{ field: 'universal_field3', type: 'length', max: 255 },
		{ field: 'universal_field4', type: 'length', max: 255 },
		{ field: 'universal_field5', type: 'length', max: 255 },
		{ field: 'universal_field6', type: 'length', max: 255 }
	]
});