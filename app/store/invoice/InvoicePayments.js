/**
 * Store for InvoicePayments.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.invoice.InvoicePayments', {
    extend: 'NP.lib.data.Store',
    alias : 'store.invoice.invoicepayments',
	
	model: 'NP.model.invoice.InvoicePayment'    
});