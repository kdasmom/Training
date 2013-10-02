/**
 * Grid column for Image Invoice Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.image.gridcol.InvoiceDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.image.gridcol.invoicedate',

	text     : 'Invoice Date',
	dataIndex: 'Image_Index_Invoice_Date'
});