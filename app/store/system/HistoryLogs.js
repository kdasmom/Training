/**
 * Store for HistoryLog.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.system.HistoryLogs', {
    extend: 'NP.lib.data.Store',
	alias : 'store.system.historylogs',
	
	model: 'NP.model.system.HistoryLog'    
});