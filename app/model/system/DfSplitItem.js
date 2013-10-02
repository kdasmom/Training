/**
 * Model for a DfSplitItem
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.system.DfSplitItem', {
	extend: 'Ext.data.Model',
	
	requires: [
		'NP.lib.core.Config',
		'NP.model.gl.GlAccount',
		'NP.model.property.Property'
	],

	idProperty: 'dfsplititem_id',
	fields: [
		{ name: 'dfsplititem_id', type: 'int' },
		{ name: 'dfsplit_id', type: 'int' },
		{ name: 'property_id', type: 'int' },
		{ name: 'glaccount_id', type: 'int' },
		{ name: 'dfsplititem_percent', type: 'float', defaultValue: 0 },
		{ name: 'universal_field1' },
		{ name: 'universal_field2' },
		{ name: 'universal_field3' },
		{ name: 'universal_field4' },
		{ name: 'universal_field5' },
		{ name: 'universal_field6' },
		{ name: 'unit_id', type: 'int' },
		{ name: 'universal_field7' },
		{ name: 'universal_field8' }
	],

	belongsTo: [
		{
			model         : 'NP.model.gl.GlAccount',
			name          : 'glaccount',
			getterName    : 'getGlAccount',
			foreignKey    : 'glaccount_id',
			primaryKey    : 'glaccount_id',
	        reader        : 'jsonflat'
		},{
			model         : 'NP.model.property.Property',
			name          : 'property',
			getterName    : 'getProperty',
			foreignKey    : 'property_id',
			primaryKey    : 'property_id',
	        reader        : 'jsonflat'
		}
	]
});