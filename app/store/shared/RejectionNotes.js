/**
 * Store for RejectionNotes.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.shared.RejectionNotes', {
	extend: 'NP.lib.data.Store',
	alias : 'store.shared.rejectionnotes',

	model : 'NP.model.shared.RejectionNote'    
});