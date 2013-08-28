/**
 * Abstract tile for POs
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.AbstractPoTile', {
	extend: 'NP.view.shared.tile.AbstractSummaryStatTile',
	
	requires: [
		'NP.lib.core.Security',
		'NP.store.po.Purchaseorders',
		'NP.view.po.PoGrid'
	],

    getGrid: function() {
    	return {
            xtype       : 'po.pogrid',
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

    getStorePath: function() {
        return 'po.Purchaseorders';
    },

    getService: function() {
    	return 'PoService';
    }
});