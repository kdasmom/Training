/**
 * Store for Job Cost Codes
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.jobcosting.JbCostCodes', {
    extend: 'NP.lib.data.Store',
    alias : 'store.jobcosting.jbcostcodes',
	
    model: 'NP.model.jobcosting.JbCostCode'
});