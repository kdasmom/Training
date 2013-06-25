/**
 * Model for a UnspscCommodity
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.catalog.UnspscCommodity', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'UNSPSC_Commodity_Commodity',
	fields: [
		{ name: 'UNSPSC_Commodity_Commodity', type: 'int' },
		{ name: 'UNSPSC_Commodity_CommodityTitle' },
		{ name: 'UNSPSC_Commodity_Segment', type: 'int' },
		{ name: 'UNSPSC_Commodity_SegmentTitle' },
		{ name: 'UNSPSC_Commodity_Family', type: 'int' },
		{ name: 'UNSPSC_Commodity_FamilyTitle' },
		{ name: 'UNSPSC_Commodity_Class', type: 'int' },
		{ name: 'UNSPSC_Commodity_ClassTitle' },
		{ name: 'UNSPSC_Commodity_KeyID', type: 'int' }
	],

	validations: [
		{ field: 'UNSPSC_Commodity_SegmentTitle', type: 'length', max: 255 },
		{ field: 'UNSPSC_Commodity_FamilyTitle', type: 'length', max: 255 },
		{ field: 'UNSPSC_Commodity_ClassTitle', type: 'length', max: 255 },
		{ field: 'UNSPSC_Commodity_CommodityTitle', type: 'length', max: 255 }
	]
});