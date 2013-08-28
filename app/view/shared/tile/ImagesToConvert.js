/**
 * Tile for Images to Convert
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.ImagesToConvert', {
	extend: 'NP.view.shared.tile.AbstractImageTile',
	
	getCols: function() {
    	return ['image.gridcol.ScanDate','image.gridcol.InvoiceDate','image.gridcol.DueDate','property.gridcol.PropertyName',
                'vendor.gridcol.VendorName','image.gridcol.Reference','image.gridcol.Amount','shared.gridcol.PriorityFlag',
                'image.gridcol.DaysOutstanding'];
    },

    getExcludedCols: function() {
        return ['shared.gridcol.PendingDays','image.gridcol.ExceptionBy']
    }
});