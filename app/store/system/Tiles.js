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
	
	// For localization
	poChart: 'PO Chart',

	constructor: function() {
		var that = this;

		this.data = [];

		// By default, add all summary stats as tiles
		var stats = Ext.getStore('system.SummaryStats').getRange();
		Ext.each(stats, function(stat) {
			// Only add stats that are within the permissions granted
			that.data.push({
				name     : stat.get('title'),
				className: stat.get('name'),
				moduleId : stat.get('module_id')
			});
		});

		// Then add any other custom tiles
		this.data.push(
			{
				name     : this.poChart,
				className: 'PoChart',
				moduleId : null
			}
		);

		this.callParent(arguments);
	}
});