/**
 * Store for Job Change Orders
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.jobcosting.JbChangeOrders', {
    extend: 'NP.lib.data.Store',
    alias : 'store.jobcosting.jbchangeorders',
	
    model: 'NP.model.jobcosting.JbChangeOrder'
});