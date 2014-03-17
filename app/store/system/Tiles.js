/**
 * Collection of Tiles available
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.system.Tiles', {
	extend: 'Ext.data.Store',
	
	requires: ['NP.lib.core.Translator'],

	fields: [
		{ name: 'name' },
		{ name: 'className' },
		{ name: 'moduleId', type: 'int' },
		{ name: 'iconCls' }
	],
	
	constructor: function() {
		var me = this,
			stats = Ext.getStore('system.SummaryStats');

		me.data = [];

		// We need to wait for the SummaryStats store to have data before we can populate this one
		stats.on('statsloaded', function() {
			// By default, add all summary stats as tiles
			Ext.each(stats.getRange(), function(stat) {
				// Only add stats that are within the permissions granted
				me.add({
					name     : stat.get('title'),
					className: stat.get('name'),
					moduleId : stat.get('module_id')
				});
			});
		});

		me.data.push({
			name     : 'GL Category MTD Spend',
			className: 'GlCategoryMtdSpend'
		});

		me.data.push({
			name     : 'Invoice Statistics',
			className: 'InvoiceStatistics'
		});

		me.data.push({
			name     : 'YTD Top Spend by Vendor',
			className: 'YtdTopSpendByVendor'
		});

		me.callParent(arguments);

		// We need the locale to be loaded before we can run this because we need to localize the text
		NP.Translator.on('localeloaded', function() {
			var recs = me.getRange();
			for (var i=0; i<recs.length; i++) {
				recs[i].set('name', NP.Translator.translate(recs[i].get('name')));
			}
		});
	}
});