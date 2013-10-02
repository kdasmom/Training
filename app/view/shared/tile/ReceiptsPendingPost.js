/**
 * Tile for Receipts to Approve
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.ReceiptsPendingPost', {
	extend: 'NP.view.shared.tile.AbstractReceiptTile',
	
	getName: function() {
    	return 'Receipts Pending Post Approval';
    },
    
    getCols: function() {
    	return ['receipt.gridcol.CreatedDate','property.gridcol.PropertyName','vendor.gridcol.VendorName',
                'receipt.gridcol.Number','shared.gridcol.Amount'];
    },

    getExcludedCols: function() {
        return ['shared.gridcol.RejectedBy','shared.gridcol.RejectedDate'];
    }
});