/**
 * A component to easily create a Budget Overage Grid
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.budget.BudgetOverageGrid', {
    extend: 'NP.lib.ui.Grid',
 	alias : 'widget.budget.budgetoveragegrid',

    requires: ['NP.lib.core.Config'],
    
    // For localization
	categoryColText: 'Category',
	budgetColText  : 'Budget',
	accrualsColText: 'Accruals',
	varianceColText: 'Variance',

    initComponent: function() {
    	this.columns = {
    		defaults: { flex: 1 },
    		items: [
    			{ text: this.categoryColText, dataIndex: 'category_name' },
	    		{ xtype: 'numbercolumn', text: this.budgetColText, dataIndex: 'budget_total', format: '$0,000', align: 'right' },
	    		{ xtype: 'numbercolumn', text: this.accrualsColText, dataIndex: 'budget_allocated', format: '$0,000', align: 'right' },
	    		{ xtype: 'numbercolumn', text: this.varianceColText, dataIndex: 'budget_variance', format: '$0,000', align: 'right' }
    		]
    	};
    	
    	this.callParent(arguments);
    }
});