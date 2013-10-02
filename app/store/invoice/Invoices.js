/**
 * Store for Invoices
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.invoice.Invoices', {
    extend: 'NP.lib.data.Store',
    alias : 'store.invoice.invoices',
	
    model: 'NP.model.invoice.Invoice'
});