/**
 * Tile for Receipts to Approve
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.ReceiptsRejected', {
	extend: 'NP.view.shared.tile.AbstractReceiptTile',
	
	getName: function() {
    	return 'Rejected Receipts';
    },
    
    getCols: function() {
    	return ['receipt.gridcol.CreatedDate','property.gridcol.PropertyName','vendor.gridcol.VendorName',
                'receipt.gridcol.Number','shared.gridcol.Amount'];
    }
});