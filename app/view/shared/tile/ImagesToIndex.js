/**
 * Tile for Images to Index
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.ImagesToIndex', {
	extend: 'NP.view.shared.tile.AbstractImageTile',
	
	getCols: function() {
    	return ['image.gridcol.ScanDate','image.gridcol.Name','property.gridcol.PropertyName','vendor.gridcol.VendorName',
                'image.gridcol.Reference','image.gridcol.Amount'];
    },

    getExcludedCols: function() {
        return ['shared.gridcol.PendingDays','image.gridcol.ExceptionBy']
    }
});