/**
 * Store for Job Codes
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.jobcosting.JbJobCodes', {
    extend: 'NP.lib.data.Store',
    alias : 'store.jobcosting.jbjobcodes',
	
    model: 'NP.model.jobcosting.JbJobCode'
});