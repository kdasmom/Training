/**
 * Tile for My POs
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.PosByUser', {
	extend: 'NP.view.shared.tile.AbstractPoTile',
	
	getCols: function() {
    	return ['po.gridcol.Date','property.gridcol.PropertyName','vendor.gridcol.VendorName','po.gridcol.Number',
                'shared.gridcol.Amount','po.gridcol.Status'];
    }
});