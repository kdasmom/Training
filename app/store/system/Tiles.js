/**
 * Collection of Tiles available
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.system.Tiles', {
	extend: 'Ext.data.Store',
	
	fields: [
		{ name: 'name' },
		{ name: 'className' },
		{ name: 'moduleId', type: 'int' },
		{ name: 'iconCls' }
	],
	
	constructor: function() {
		var that = this,
			stats = Ext.getStore('system.SummaryStats');

		this.data = [];

		// We need to wait for the SummaryStats store to have data before we can populate this one
		stats.on('statsloaded', function() {
			// By default, add all summary stats as tiles
			Ext.each(stats.getRange(), function(stat) {
				// Only add stats that are within the permissions granted
				that.add({
					name     : stat.get('title'),
					className: stat.get('name'),
					moduleId : stat.get('module_id')
				});
			});
		});

		this.callParent(arguments);
	}
});