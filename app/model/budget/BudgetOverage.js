/**
 * Model for a Budget Overage (note that this model does not correspond to any database table)
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.budget.BudgetOverage', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	fields: [
		{ name: 'category_name', type: 'int' },
		{ name: 'budget_total', type: 'float' },
		{ name: 'budget_allocated', type: 'float' },
		{ name: 'budget_variance', type: 'float' }
	]
});