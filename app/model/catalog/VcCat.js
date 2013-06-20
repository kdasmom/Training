/**
 * Model for a VcCat
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.catalog.VcCat', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'vccat_id',
	fields: [
		{ name: 'vccat_id', type: 'int' },
		{ name: 'vccat_name' }
	],

	validations: [
		{ field: 'vccat_id', type: 'presence' },
		{ field: 'vccat_name', type: 'length', max: 255 }
	]
});