/**
 * Store for InvoiceItems.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.invoice.InvoiceItems', {
    extend: 'NP.lib.data.Store',
    alias : 'store.invoice.invoiceitems',
	
	model: 'NP.model.invoice.InvoiceItem',

	sorters: [{
		property : 'invoiceitem_linenum',
		direction: 'ASC'
	}]
});