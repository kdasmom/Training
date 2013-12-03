/**
 * Model for a Warning
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.shared.Warning', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	fields: [
		{ name: 'warning_type' },
		{ name: 'warning_title' },
		{ name: 'warning_icon' },
		{ name: 'warning_data' }
	]
});