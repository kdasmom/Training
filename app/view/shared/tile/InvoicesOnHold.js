/**
 * Grid for Invoices On Hold summary stat
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.InvoicesOnHold', {
	extend: 'NP.view.shared.tile.AbstractInvoiceTile',
	
	getCols: function() {
    	return ['property.gridcol.PropertyName','vendor.gridcol.VendorName','shared.gridcol.Amount',
    			'invoice.gridcol.Number','invoice.gridcol.Date','invoice.gridcol.HoldDate',
    			'invoice.gridcol.DaysOnHold','invoice.gridcol.OnHoldBy'];
    },

    getExcludedCols: function() {
        return ['shared.gridcol.RejectedDate','shared.gridcol.RejectedBy','shared.gridcol.RejectedReason',
                'shared.gridcol.LastApprovedDate','shared.gridcol.LastApprovedBy'];
    }
});