/**
 * Tile for Receipts to Approve
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.ReceiptsToApprove', {
	extend: 'NP.view.shared.tile.AbstractReceiptTile',
	
	getName: function() {
    	return 'Receipts To Approve';
    },
    
    getCols: function() {
    	return ['receipt.gridcol.CreatedDate','property.gridcol.PropertyName','vendor.gridcol.VendorName',
                'receipt.gridcol.Number','shared.gridcol.Amount'];
    },

    getExcludedCols: function() {
        return ['shared.gridcol.RejectedBy','shared.gridcol.RejectedDate'];
    },

    getService: function() {
    	return 'ReceiptService';
    },

    getAction: function() {
    	return 'getReceiptsToApprove';
    }
});