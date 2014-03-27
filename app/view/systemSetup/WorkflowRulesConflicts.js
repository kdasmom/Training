Ext.define('NP.view.systemSetup.WorkflowRulesConflicts', {
	extend: 'Ext.panel.Panel',
	alias:  'widget.systemsetup.workflowrulesconflicts',

	requires: [
		'NP.view.systemSetup.WorkflowOriginatesGrid',
		'NP.view.systemSetup.WorkflowConflictingRulesGrid'
	],

	initComponent: function() {
		var me = this;

		this.items = [
			{
				xtype: 'fieldset',
				title: NP.Translator.translate('Rule Routes'),
				defaultType: 'textfield',
				padding: '8',
				border: true,
				items: [
					{
						xtype: 'systemsetup.workfloworiginatesgrid',
						data: me.data,
						hideDeleteColumn: true
					}
				]
			},
			{
				xtype: 'fieldset',
				title: NP.Translator.translate('Conflicts with these rules'),
				defaultType: 'textfield',
				padding: '8',
				border: true,
				items: [
					{
						xtype: 'systemsetup.workflowconflictingrulesgrid',
						data: me.data
					},
					{
						xtype: 'form',
						name: 'nextactionform',
						itemId: 'nextactionform',
						border: 0,
						items: [
							{
								xtype: 'radiogroup',
								name: 'nextaction',
								columns: 1,
								vertical: true,
								padding: '15 0 0 0',
								items: [
									{
										boxLabel: NP.Translator.translate('Edit this rule > Admin_Invoice > {rulename}', { rulename: me.data ? me.data.rule.wfrule_name : ''}),
										checked: true,
										name: 'nextaction',
										inputValue: 'edit'
									},
									{
										boxLabel: NP.Translator.translate('Delete conflicting rules'),
										name: 'nextaction',
										inputValue: 'delete'
									}
								]
							}
						]
					}
				]
			}
		];

		this.callParent(arguments);
	}
});