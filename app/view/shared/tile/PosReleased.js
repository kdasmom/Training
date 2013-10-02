/**
 * Tile for POs Released
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.PosReleased', {
	extend: 'NP.view.shared.tile.AbstractPoTile',
	
	getCols: function() {
    	return ['po.gridcol.Date','property.gridcol.PropertyName','vendor.gridcol.VendorName','po.gridcol.Number',
                'shared.gridcol.Amount'];
    },

    getExcludedCols: function() {
        return ['shared.gridcol.RejectedBy','shared.gridcol.RejectedDate'];
    }
});