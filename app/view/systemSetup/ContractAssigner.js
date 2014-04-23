/**
 * Generic component to assign contracts
 *
 * @author Renat Gatyatov
 */
Ext.define('NP.view.systemSetup.ContractAssigner', {
	extend: 'NP.lib.ui.Assigner',
	alias: 'widget.systemSetup.contractassigner',

	fieldLabel: 'Invoice Item Amount (by Contract)',

	name        : 'contractassigner',
	displayField: 'jbcontract_name',
	valueField  : 'jbcontract_id',
	tpl         : '<tpl for=".">' +
					'<div class="x-boundlist-item">{jbcontract_name}' +
						'<tpl if="jbcontract_desc != \'\'">' +
							' ({jbcontract_desc})' +
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
				action	: 'getContracts',
				autoLoad: this.autoLoad,
				fields	: ['jbcontract_id', 'jbcontract_desc', 'jbcontract_name'],
				extraParams: {
					status: 'active'
				}
			});
		}

		this.callParent(arguments);
	}
});
