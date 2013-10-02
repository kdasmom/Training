/**
 * Tile for POs Rejected
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.PosRejected', {
	extend: 'NP.view.shared.tile.AbstractPoTile',
	
	getCols: function() {
    	return ['po.gridcol.Date','property.gridcol.PropertyName','shared.gridcol.PriorityFlag','po.gridcol.NeededByDate',
                'vendor.gridcol.VendorName','po.gridcol.Number','shared.gridcol.Amount'];
    }
});