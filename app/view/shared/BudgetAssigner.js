/**
 * Generic component to assign budgets
 *
 * @author Renat Gatyatov
 */
Ext.define('NP.view.shared.BudgetAssigner', {
	extend: 'Ext.ux.form.ItemSelector',
	alias: 'widget.shared.budgetassigner',

//	requires: ['NP.lib.core.Config'],

	fieldLabel: 'Budgets',

	name        : 'budgets',
	displayField: 'budget_name',
	valueField  : 'budget_id',
	tpl         : '<tpl for="."><div class="x-boundlist-item">{budget_name}</div></tpl>',
	fromTitle   : 'Unassigned',
	toTitle     : 'Assigned',
	buttons     : ['add','remove'],
	msgTarget   : 'under',

	initComponent: function() {
		if (!this.store) {
			this.store = Ext.create('NP.store.property.Properties', {
				service : 'PropertyService',
				action  : 'getAll',
				autoLoad: true
			});
		}

		this.callParent(arguments);
	}
});
