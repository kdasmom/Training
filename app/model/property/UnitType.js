/**
 * Model for a UnitType
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.property.UnitType', {
	extend: 'Ext.data.Model',
	
	requires: [
		'NP.lib.core.Config',
		'NP.model.user.Userprofile',
		'NP.model.property.UnitTypeVal'
	],

	idProperty: 'unittype_id',
	fields: [
		{ name: 'unittype_id', type: 'int' },
		{ name: 'unittype_id_alt' },
		{ name: 'unittype_name' },
		{ name: 'unittype_order', type: 'int' },
		{ name: 'unittype_bedrooms', type: 'float' },
		{ name: 'unittype_bathrooms', type: 'float' },
		{ name: 'property_id', type: 'int' },
		{ name: 'unittype_updated_by', type: 'int' },
		{ name: 'unittype_updated_date', type: 'date' }
	],

	belongsTo: {
		model         : 'NP.model.user.Userprofile',
		//associationKey: 'lastUpdatedUser',
		name          : 'userprofile',
		getterName    : 'getLastUpdatedUser',
		foreignKey    : 'unittype_updated_by',
		primaryKey    : 'userprofile_id',
        reader        : 'jsonflat'
	},
	hasMany  : [
		{
			model     : 'NP.model.property.UnitTypeVal',
			name      : 'vals',
			foreignKey: 'unittype_id',
			primaryKey: 'unittype_id'
		},{
			model     : 'NP.model.property.Unit',
			name      : 'units',
			foreignKey: 'unittype_id',
			primaryKey: 'unittype_id'
		}
	],

	validations: [
		{ field: 'unittype_id_alt', type: 'length', max: 5 },
		{ field: 'unittype_name', type: 'length', max: 255 },
		{ field: 'unittype_bedrooms', type: 'presence' },
		{ field: 'unittype_bathrooms', type: 'presence' }
	]
});