/**
 * Generic component to assign pay by types
 *
 * @author Renat Gatyatov
 */
Ext.define('NP.view.systemSetup.PaymentTypeAssigner', {
	extend: 'Ext.ux.form.ItemSelector',
	alias: 'widget.systemSetup.paymenttypeassigner',

	fieldLabel: 'Budgets By Gl Code',

	name        : 'paymenttype',
	displayField: '',
	valueField  : '',
	tpl         : '<tpl for="."><div class="x-boundlist-item">{glaccount_number}</div></tpl>',
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
//			sort: NP.Config.getSetting('PN.Budget.GLCodeSort')
		}
	})
});
