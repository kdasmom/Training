/**
 * Grid for My Invoices summary stat
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.InvoicesByUser', {
	extend: 'NP.view.shared.tile.AbstractInvoiceTile',
	
	getCols: function() {
    	return ['invoice.gridcol.Date','property.gridcol.PropertyName','shared.gridcol.PriorityFlag',
    			'vendor.gridcol.VendorName','invoice.gridcol.Number','invoice.gridcol.PendingDays',
    			'shared.gridcol.Amount','invoice.gridcol.Status'];
    }
});