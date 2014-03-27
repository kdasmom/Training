/**
 * Created by rnixx on 27.03.2014.
 */

Ext.define('NP.view.systemSetup.RuleTypeAutocomplete', {
    extend: 'NP.lib.ui.AutoComplete',
    alias: 'widget.systemSetup.ruletypeautocomplete',

    requires: ['NP.store.workflow.RuleTypes'],

    fieldLabel      : 'Rule Type',

    name            : 'ruletype',
    valueField      : 'wfruletype_id',
    displayField    : 'wfruletype_name',
    width           : 500,
    allowBlank      : false,
    multiSelect     : false,
    minChars        : 0,

    initComponent: function() {
        if (!this.store) {
            this.store = Ext.create('NP.store.workflow.RuleTypes', {
                service: 'WFRuleService',
                autoLoad: true,
                action: 'listRulesType'
            });
        }

        this.callParent(arguments);
    }
});