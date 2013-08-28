/**
 * Tile for Image Exceptions
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.ImageExceptions', {
	extend: 'NP.view.shared.tile.AbstractImageTile',
	
	getCols: function() {
    	return ['image.gridcol.ScanDate','image.gridcol.DocType','property.gridcol.PropertyName','vendor.gridcol.VendorName',
        'image.gridcol.Reference','image.gridcol.Amount','image.gridcol.ExceptionBy'];
    },

    getExcludedCols: function() {
        return ['shared.gridcol.PendingDays']
    }
});