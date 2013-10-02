/**
 * Tile for POs to Approve
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.PosToApprove', {
	extend: 'NP.view.shared.tile.AbstractPoTile',
	
	getCols: function() {
    	return ['po.gridcol.Date','property.gridcol.PropertyName','shared.gridcol.PriorityFlag','po.gridcol.NeededByDate',
                'vendor.gridcol.VendorName','po.gridcol.Number','shared.gridcol.Amount','shared.gridcol.PendingDays'];
    },

    getExcludedCols: function() {
        return ['shared.gridcol.RejectedBy','shared.gridcol.RejectedDate'];
    }
});