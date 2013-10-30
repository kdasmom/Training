/**
 * Store for InvoicePaymentTypes.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.invoice.InvoicePaymentTypes', {
    extend: 'NP.lib.data.Store',
    alias : 'store.invoice.invoicepaymenttypes',
	
	model: 'NP.model.invoice.InvoicePaymentType'    
});