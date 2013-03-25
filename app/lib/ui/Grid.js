/**
 * The Grid class extends Ext's standard grid panel to provide some additional utility config options specific to NP.
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.ui.Grid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.customgrid',
	
	/**
	 * @cfg {boolean} paging      Whether or not paging will be used for this grid
	 */
	/**
	 * @cfg {Object}  extraParams If using a grid with a remote store, these are extra parameters you want sent with the ajax request
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
	},

	/**
	 * Adds extra parameters to the grid's store proxy
	 * @param {Object} extraParams
	 */
	addExtraParams: function(extraParams) {
		var proxy = this.getStore().getProxy();
		Ext.apply(proxy.extraParams, extraParams);
	},

	/**
	 * Reloads the grid with whatever parameters are set on it, moving it back to the first page
	 */
	reloadFirstPage: function() {
		this.getStore().removeAll();
		this.getDockedItems('pagingtoolbar')[0].moveFirst();
	}
});