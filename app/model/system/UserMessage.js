/**
 * Model for a UserMessage
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.system.UserMessage', {
	extend: 'Ext.data.Model',
	
	requires: [
		'NP.lib.core.Config',
		'NP.model.user.Userprofile'
	],

	idProperty: 'id',
	fields: [
		{ name: 'id', type: 'int' },
		{ name: 'type', defaultValue: 'email' },
		{ name: 'status', defaultValue: 'scheduled' },
		{ name: 'subject' },
		{ name: 'body' },
		{ name: 'createdBy', type: 'int' },
		{ name: 'createdAt', type: 'date' },
		{ name: 'sentAt', type: 'date' },
		{ name: 'displayUntil', type: 'date' }
	],

	belongsTo: [
		{
            model         : 'NP.model.user.Userprofile',
            name          : 'createdByUser',
            getterName    : 'getCreatedByUser',
            foreignKey    : 'createdBy',
            primaryKey    : 'userprofile_id',
            reader        : 'jsonflat'
        }
	],

	validations: [
		{ field: 'type', type: 'length', max: 10 },
		{ field: 'status', type: 'length', max: 10 },
		{ field: 'subject', type: 'length', max: 100 },
		{ field: 'body', type: 'length', max: 6000 }
	]
});