/**
 * Model for a Person entity
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.system.Person', {
	extend: 'NP.lib.data.Model',
	
    idProperty: 'person_id',
    fields: [
        { name: 'person_id', type: 'int' },
        { name: 'person_title' },
        { name: 'person_firstname' },
        { name: 'person_middlename' },
        { name: 'person_lastname' },
        { name: 'person_suffix' }
	]
});
