Ext.define('NP.model.workflow.WfRule', {
    extend: 'Ext.data.Model',

    idProperty: 'wfrule_id',

    fields: [
        { name: 'wfrule_id', type: 'int' },
        { name: 'wfrule_name' },
        { name: 'wfruletype_name' },
        { name: 'wfrule_status' },
        { name: 'userprofile_username' },
		{ name: 'wfrule_datetm', type: 'date' },
		{ name: 'all_properties_selected' },
		{ name: 'wfruletype_tablename' },
		{ name: 'wfruletype_id' },
		{ name: 'wfrule_operand' },
		{ name: 'wfrule_string' },
		{ name: 'wfrule_number_end' },
		{ name: 'wfrule_number' }
    ]
});