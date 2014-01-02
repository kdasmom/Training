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
		{ name: 'recauthor_datetm', type: 'date' },
		{ name: 'delegation_to_userprofile_id', type: 'int' }
	]
});