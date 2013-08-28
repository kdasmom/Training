/**
 * Abstract tile for POs
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.AbstractReceiptTile', {
	extend: 'NP.view.shared.tile.AbstractTile',
	
	requires: [
		'NP.lib.core.Security',
		'NP.store.po.Receipts',
		'NP.view.receipt.ReceiptGrid'
	],

    getPreview: function() {
    	var grid = this.getGrid();
    	grid.store = this.getPreviewStore();

		return grid;
    },

    getDashboardPanel: function() {
    	var that = this;

    	var grid = Ext.apply(this.getGrid(), {
			stateful: true,
			stateId : 'dashboard_' + this.getName().replace(' ', '_'),
			store   : this.getDashboardStore()
    	});

    	grid = Ext.create('NP.view.receipt.ReceiptGrid', grid);

    	var contextPicker = this.getContextPicker();

    	function reloadGrid() {
    		var state = contextPicker.getState();
			
			grid.addExtraParams({
				contextType     : state.type,
				contextSelection: state.selected
			});

			grid.reloadFirstPage();	
    	}

    	reloadGrid();

    	grid.mon(contextPicker, 'change', function(toolbar, filterType, selected) {
			reloadGrid();
		});

		return grid;
    },

    getGrid: function() {
    	return {
            xtype       : 'receipt.receiptgrid',
            cols        : this.getCols(),
            excludedCols: this.getExcludedCols(),
            paging      : true
        };
    },

    getCols: function() {
    	throw 'You must implement this function in your tile. It defines the columns for the invoice grid.';
    },

    getExcludedCols: function() {
        return [];
    },

    getPreviewStore: function() {
    	return Ext.create('NP.store.po.Receipts', {
		    		data: []
		    	});
    },

    getDashboardStore: function() {
    	return Ext.create('NP.store.po.Receipts', {
    		service: this.getService(),
    		action : this.getAction(),
    		paging     : true,
			extraParams: {
				userprofile_id             : NP.Security.getUser().get('userprofile_id'),
				delegated_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id'),
				countOnly                  : false
			}
    	});
    },

    getService: function() {
    	throw 'You must implement getService() in your tile if you haven\'t overridden getDashboardStore().';
    },

    getAction: function() {
    	throw 'You must implement getAction() in your tile if you haven\'t overridden getDashboardStore().';
    }
});