Ext.define('NP.model.workflow.WfRuleType', {
    extend: 'Ext.data.Model',

    idProperty: 'wfruletype_id',

    fields: [
        { name: 'wfruletype_id', type: 'int' },
        { name: 'wfruletype_name' },
        { name: 'type_id_alt' },
        { name: 'ordinal' }
    ]
});