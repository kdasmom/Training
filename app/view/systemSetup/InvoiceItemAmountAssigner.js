/**
 * Generic component to assign budgets
 *
 * @author Renat Gatyatov
 */
Ext.define('NP.view.systemSetup.InvoiceItemAmountAssigner', {
	extend: 'Ext.ux.form.ItemSelector',
	alias: 'widget.systemSetup.invoiceitemamountassigner',

	fieldLabel: 'Invoice Item Amount By Job Code',

	name        : 'invoiceitemamount',
	displayField: 'jbjobcode_name',
	valueField  : 'jbjobcode_id',
	tpl         : '<tpl for="."><div class="x-boundlist-item">{jbjobcode_name} ({jbjobcode_desc})</div></tpl>',
	fromTitle   : 'Unassigned',
	toTitle     : 'Assigned',
	buttons     : ['add','remove'],
	msgTarget   : 'under',

	store: Ext.create('NP.lib.data.Store', {
		service	: 'JobCostingService',
		action	: 'getJobCodes',
		autoLoad: true,
		fields	: ['jbjobcode_id', 'jbjobcode_desc', 'jbjobcode_name'],
		extraParams: {
			status: 'active'
		}
	})
});
