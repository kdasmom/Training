/**
 * Abstract tile for Image Summary Stats
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.AbstractImageTile', {
	extend: 'NP.view.shared.tile.AbstractSummaryStatTile',
	
	requires: [
		'NP.lib.core.Security',
		'NP.store.image.ImageIndexes',
		'NP.view.image.ImageGrid'
	],

    getGrid: function() {
    	return {
            xtype       : 'image.imagegrid',
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
        return 'image.ImageIndexes';
    },

    getService: function() {
    	return 'ImageService';
    }
});