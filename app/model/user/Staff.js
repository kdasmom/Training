/**
 * Model for a Staff
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.user.Staff', {
	extend: 'Ext.data.Model',
	
	requires: [
		'NP.lib.core.Config',
		'NP.model.user.Person',
        'NP.lib.data.JsonFlat'
	],

	idProperty: 'staff_id',
	fields: [
		{ name: 'staff_id', type: 'int' },
		{ name: 'staff_id_alt' },
		{ name: 'person_id', type: 'int' },
		{ name: 'staff_status' }
	],

    belongsTo: [
        {
            model         : 'NP.model.user.Person',
            name          : 'person',
            getterName    : 'getPerson',
            foreignKey    : 'person_id',
            primaryKey    : 'person_id',
            reader        : 'jsonflat'
        }
    ],

	validations: [
		{ field: 'staff_id', type: 'presence' },
		{ field: 'staff_id_alt', type: 'length', max: 15 },
		{ field: 'staff_status', type: 'length', max: 50 }
	]
});