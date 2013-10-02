/**
 * Model for a RecAuthor
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.user.RecAuthor', {
	extend: 'Ext.data.Model',
	
	requires: [
		'NP.lib.core.Config',
		'NP.model.user.Userprofile'
	],

	idProperty: 'recauthor_id',
	fields: [
		{ name: 'recauthor_id', type: 'int' },
		{ name: 'userprofile_id', type: 'int' },
		{ name: 'table_name' },
		{ name: 'tablekey_id', type: 'int' },
		{ name: 'recauthor_datetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'delegation_to_userprofile_id', type: 'int' }
	],

    belongsTo: [
        {
            model     : 'NP.model.user.Userprofile',
            name      : 'user',
            getterName: 'getUser',
            foreignKey: 'userprofile_id',
            primaryKey: 'userprofile_id',
            reader    : 'jsonflat'
        }
    ]
});