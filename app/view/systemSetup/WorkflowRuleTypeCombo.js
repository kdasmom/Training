Ext.define('NP.view.systemSetup.WorkflowRuleTypeCombo', {
	extend: 'Ext.form.field.ComboBox',
	alias: 'widget.systemsetup.workflowruletypecombo',

	queryMode: 'local',
	fieldLabel: NP.Translator.translate('Filter by:'),

	valueField: 'id',
	displayField: 'type',

	initComponent: function() {
		this.store = Ext.create('Ext.data.Store', {
			data: [
				{id: 0, type: NP.Translator.translate('--ALL--')},
				{id: 6, type: NP.Translator.translate('Rule Type')},
				{id: 1, type: NP.Translator.translate('Property')},
				{id: 2, type: NP.Translator.translate('GL Account')},
				{id: 3, type: NP.Translator.translate('User')},
				{id: 4, type: NP.Translator.translate('User Group')},
				{id: 5, type: NP.Translator.translate('Vendor')},
			],
			fields: ['id', 'type']
		});

		this.callParent(arguments);
	}
});