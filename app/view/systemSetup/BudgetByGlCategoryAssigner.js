/**
 * Generic component to assign budgets
 *
 * @author Renat Gatyatov
 */
Ext.define('NP.view.systemSetup.BudgetByGlCategoryAssigner', {
	extend: 'NP.lib.ui.Assigner',
	alias: 'widget.systemSetup.budgetbyglcategoryassigner',

	fieldLabel: 'GL Categories',

	name        : 'budgets',
	displayField: 'glaccount_name',
	valueField  : 'glaccount_id',
	tpl         : '<tpl for="."><div class="x-boundlist-item">{glaccount_name}</div></tpl>',
	fromTitle   : 'Unassigned',
	toTitle     : 'Assigned',
	buttons     : ['add','remove'],
	msgTarget   : 'under',
	autoLoad	: true,

	initComponent: function() {
		if (!this.store) {
			this.store = Ext.create('NP.lib.data.Store', {
				service	 : 'GLService',
				action	 : 'getBudgetAmountByGlCategory',
				autoLoad : this.autoLoad,
				fields	 : ['glaccount_id', 'glaccount_name', 'glaccount_number'],
			});
		}

		this.callParent(arguments);
	}
});
