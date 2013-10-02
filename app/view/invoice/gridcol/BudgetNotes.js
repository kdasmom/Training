/**
 * Grid column for Budget Overage Notes
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.BudgetNotes', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.invoice.gridcol.budgetnotes',

	text     : 'Budget Overage Notes',
	dataIndex: 'invoice_budgetoverage_note'
});