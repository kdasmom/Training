/**
 * Generic component to assign budgets
 *
 * @author Renat Gatyatov
 */
Ext.define('NP.view.systemSetup.BudgetByGlCategoryAssigner', {
	extend: 'Ext.ux.form.ItemSelector',
	alias: 'widget.systemSetup.budgetbyglcategoryassigner',

	fieldLabel: 'Budgets By Gl Category',

	name        : 'budgets',
	displayField: 'glaccount_name',
	valueField  : 'glaccount_id',
	tpl         : '<tpl for="."><div class="x-boundlist-item">{glaccount_name}</div></tpl>',
	fromTitle   : 'Unassigned',
	toTitle     : 'Assigned',
	buttons     : ['add','remove'],
	msgTarget   : 'under',

	store: Ext.create('NP.lib.data.Store', {
		service	: 'GLService',
		action	: 'getBudgetAmountByGlCategory',
		autoLoad: true,
		fields	: ['glaccount_id', 'glaccount_name', 'glaccount_number'],
	})
});
