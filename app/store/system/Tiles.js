/**
 * Collection of Tiles available
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.system.Tiles', {
	extend: 'Ext.data.Store',
	
	requires: [
		'NP.lib.core.Security',
		'NP.store.system.SummaryStats'
	],

	fields: [
		{ name: 'name' },
		{ name: 'className' },
		{ name: 'moduleId', type: 'int' },
		{ name: 'iconCls' }
	],
	
	// For localization
	poChart: 'PO Chart',

	sorters: [{
        property: 'name',
        direction: 'ASC'
    }],

	constructor: function() {
		var that = this;

		if (!this.permissions) {
    		this.permissions = NP.Security.getPermissions();
    	}

		this.data = [];

		// First, import all the summary stats as tiles
		var stats = Ext.getStore('system.SummaryStats').getRange();
		
		Ext.each(stats, function(stat) {
			if (stat.get('module_id') in this.permissions) {
				that.data.push({
					name     : stat.get('title'),
					className: stat.get('name'),
					moduleId : stat.get('module_id'),
					iconCls  : ''
				});
			}
		});

		// Then add any other custom tiles
		this.data.push(
	    	{
				name     : this.poChart,
				className: 'PoChart',
				moduleId : null,
				iconCls  : ''
			}
		);

		this.callParent(arguments);
	}
});