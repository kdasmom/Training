/**
 * Generic component to assign budgets
 *
 * @author Renat Gatyatov
 */
Ext.define('NP.view.systemSetup.BudgetByGlCodeAssigner', {
	extend: 'Ext.ux.form.ItemSelector',
	alias: 'widget.systemSetup.budgetbyglcodeassigner',

	fieldLabel: 'Budgets By Gl Code',

	name        : 'budgets',
	displayField: 'glaccount_name',
	valueField  : 'glaccount_id',
	tpl         : '<tpl for="."><div class="x-boundlist-item">{glaccount_number} ({glaccount_name})</div></tpl>',
	fromTitle   : 'Unassigned',
	toTitle     : 'Assigned',
	buttons     : ['add','remove'],
	msgTarget   : 'under',

	store: Ext.create('NP.lib.data.Store', {
		service	: 'GLService',
		action	: 'getBudgetAmountByGlCode',
		autoLoad: true,
		fields	: ['glaccount_id', 'glaccount_name', 'glaccount_number'],
		extraParams: {
			sort: NP.Config.getSetting('PN.Budget.GLCodeSort')
		}
	})
});
