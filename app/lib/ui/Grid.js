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
		
		var that = this;

		if (this.contextPicker) {
			function changeProxyParams(contextFilterType, selected) {
				var proxy = that.getStore().getProxy();
				Ext.apply(proxy.extraParams, {
					contextType     : contextFilterType,
					contextSelection: selected
				});
			}

			function onContextChange(picker, filterType, selected) {
				changeProxyParams(filterType, selected);
				if (this.paging === true) {
					this.getStore().removeAll();
					this.getDockedItems('pagingtoolbar')[0].moveFirst();
				}
			}

			var contextPicker = Ext.ComponentQuery.query('#'+this.contextPicker)[0];
			var state = contextPicker.getState();
			changeProxyParams(state.contextFilterType, state.selected);

			this.addListener('destroy', function(comp) {
				contextPicker.removeListener('change', onContextChange, this);
			}, this);

			contextPicker.addListener('change', onContextChange, this);
		}
	}
});