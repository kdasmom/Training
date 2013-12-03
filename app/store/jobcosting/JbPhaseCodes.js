/**
 * Store for Job Phase Codes
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.jobcosting.JbPhaseCodes', {
    extend: 'NP.lib.data.Store',
    alias : 'store.jobcosting.jbphasecodes',
	
    model: 'NP.model.jobcosting.JbPhaseCode'
});