/**
 * Grid column for Budget Overage Notes
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.po.gridcol.BudgetNotes', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.po.gridcol.budgetnotes',

	text     : 'Budget Overage Notes',
	dataIndex: 'purchaseorder_budgetoverage_note'
});