/**
 * Model for a Delegation entity
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.user.Delegation', {
	extend: 'NP.lib.data.Model',
	
    idProperty: 'delegation_id',
    fields: [
        { name: 'delegation_id', type: 'int' },
        { name: 'userprofile_id', type: 'int' },
        { name: 'delegation_to_userprofile_id', type: 'int' },
        { name: 'delegation_startdate', type: 'date', dateFormat: NP.lib.core.Config.getServerDateFormat() },
        { name: 'delegation_stopdate', type: 'date', dateFormat: NP.lib.core.Config.getServerDateFormat() },
        { name: 'delegation_createddate', type: 'date', dateFormat: NP.lib.core.Config.getServerDateFormat() },
        { name: 'delegation_createdby', type: 'int' },
        { name: 'delegation_status' }
	]
});
