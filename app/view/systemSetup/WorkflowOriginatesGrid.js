Ext.define('NP.view.systemSetup.WorkflowOriginatesGrid', {
	extend: 'NP.lib.ui.Grid',
	alias: 'widget.systemsetup.workfloworiginatesgrid',

	requires: [
		'NP.view.systemSetup.gridcol.OriginatesFrom',
		'NP.view.systemSetup.gridcol.FromUser',
		'NP.view.systemSetup.gridcol.ForwardTo',
		'NP.view.systemSetup.gridcol.ToUser'
	],

	initComponent: function(){
		var me = this;

		if (me.data) {
			this.store = Ext.create('NP.store.workflow.Originates', {
				service: 'WFRuleService',
				action : 'GetRuleOriginators',
				extraParams: {
					wfruleid: me.data.rule.wfrule_id
				}
			});

			this.store.load();
		}

		this.columns = [
			{ xtype: 'systemsetup.gridcol.originatesfrom', flex: 1 },
			{ xtype: 'systemsetup.gridcol.fromuser', flex: 1 },
			{ xtype: 'systemsetup.gridcol.forwardto', flex: 1 },
			{ xtype: 'systemsetup.gridcol.touser', flex: 1 },
			{
				flex: 0.1,
				tdCls: 'image-button-cell',
				align: 'center',
				renderer: function(val) {
					return '<img src="resources/images/buttons/delete.gif" title="Delete" alt="Delete" />'
				},
				hidden: (me.hideDeleteColumn) ? true : false
			}
		];

		this.callParent(arguments);
	}
});