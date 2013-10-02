/**
 * Abstract tile for Budgets
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.AbstractBudgetTile', {
	extend: 'NP.view.shared.tile.AbstractSummaryStatTile',
	
	requires: [
        'NP.lib.core.Security',
		'NP.store.budget.BudgetOverages',
		'NP.view.budget.BudgetOverageGrid'
	],

    getGrid: function() {
    	return {
            xtype       : 'budget.budgetoveragegrid',
            paging      : true
        };
    },

    getStorePath: function() {
        return 'budget.BudgetOverages';
    },

    getService: function() {
    	return 'BudgetService';
    },

    getStoreParams: function() {
        return {
            property_id: NP.Security.getCurrentContext().property_id,
            countOnly  : false
        };
    }
});