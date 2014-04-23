/**
 * Generic component to assign budgets
 *
 * @author Renat Gatyatov
 */
Ext.define('NP.view.systemSetup.BudgetByGlCodeAssigner', {
	extend: 'NP.lib.ui.Assigner',
	alias: 'widget.systemSetup.budgetbyglcodeassigner',

	fieldLabel: 'GL Accounts',

	name        : 'budgets',
	displayField: 'glaccount_name',
	valueField  : 'glaccount_id',
	tpl         : '<tpl for="."><div class="x-boundlist-item">{glaccount_number} ({glaccount_name})</div></tpl>',
	fromTitle   : 'Unassigned',
	toTitle     : 'Assigned',
	buttons     : ['add','remove'],
	msgTarget   : 'under',
	autoLoad	: true,

	initComponent: function() {
		if (!this.store) {
			this.store = Ext.create('NP.lib.data.Store', {
				service	: 'GLService',
				action	: 'getBudgetAmountByGlCode',
				autoLoad: this.autoLoad,
				fields	: ['glaccount_id', 'glaccount_name', 'glaccount_number'],
				extraParams: {
					sort: NP.Config.getSetting('PN.Budget.GLCodeSort')
				}
			});
		}

		this.callParent(arguments);
	}
});
