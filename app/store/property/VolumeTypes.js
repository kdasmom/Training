/**
 * Store for Property Volume Types
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.property.VolumeTypes', {
	extend: 'Ext.data.Store',
	
	fields: ['name','code'],
	
	data: [
		{ name: 'Normal', code: 'normal' },
		{ name: 'High', code: 'high' },
		{ name: 'Low', code: 'low' }
	]
});