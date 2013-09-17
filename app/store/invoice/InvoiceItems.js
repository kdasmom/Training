/**
 * Store for InvoiceItems.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.invoice.InvoiceItems', {
    extend: 'NP.lib.data.Store',
	
	model: 'NP.model.invoice.InvoiceItem'    
});