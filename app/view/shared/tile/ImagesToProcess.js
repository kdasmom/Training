/**
 * Tile for Images to Process
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.ImagesToProcess', {
	extend: 'NP.view.shared.tile.AbstractImageTile',
	
	getCols: function() {
    	return ['image.gridcol.ScanDate','property.gridcol.PropertyName','shared.gridcol.PriorityFlag',
                'image.gridcol.NeededByDate','vendor.gridcol.VendorName','image.gridcol.Reference',
                'image.gridcol.Amount','image.gridcol.DueDate','shared.gridcol.PendingDays'];
    },

    getExcludedCols: function() {
        return ['image.gridcol.ExceptionBy']
    }
});