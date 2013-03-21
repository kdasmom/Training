/**
 * The Grid class extends Ext's standard grid panel to provide some additional utility config options specific to NP.
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.ui.Grid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.customgrid',
	
	/**
	 * @cfg {string} contextPicker The itemId of the contextPicker to use to filter this grid's store
	 */
	initComponent: function() {
		if (this.paging === true) {
			Ext.applyIf(this, {
				dockedItems: [{
					xtype: 'pagingtoolbar',
					dock: 'top',
					store: this.store,
					displayInfo: true
				}]
	    	});
		}

		this.callParent(arguments);

		if (this.extraParams) {
			var proxy = this.getStore().getProxy();
			Ext.apply(proxy.extraParams, this.extraParams);
		}
	}
});