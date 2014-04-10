/**
 * Generic component to assign job codes
 *
 * @author Renat Gatyatov
 */
Ext.define('NP.view.systemSetup.InvoiceItemAmountAssigner', {
	extend: 'NP.lib.ui.Assigner',
	alias: 'widget.systemSetup.invoiceitemamountassigner',

	fieldLabel: 'Invoice Item Amount By Job Code',

	name        : 'invoiceitemamount',
	displayField: 'jbjobcode_name',
	valueField  : 'jbjobcode_id',
	tpl         : '<tpl for=".">' +
					'<div class="x-boundlist-item">{jbjobcode_name}' +
						'<tpl if="jbjobcode_desc != \'\'">' +
							' ({jbjobcode_desc})' +
						'</tpl>' +
					'</div>' +
				  '</tpl>',
	fromTitle   : 'Unassigned',
	toTitle     : 'Assigned',
	buttons     : ['add','remove'],
	msgTarget   : 'under',
	autoLoad    : true,

	initComponent: function() {
		if (!this.store) {
			this.store = Ext.create('NP.lib.data.Store', {
				service	: 'JobCostingService',
				action	: 'getJobCodes',
				autoLoad: this.autoLoad,
				fields	: ['jbjobcode_id', 'jbjobcode_desc', 'jbjobcode_name'],
				extraParams: {
					status: 'active'
				}
			});
		}

		this.callParent(arguments);
	}
});
