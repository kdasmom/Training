/**
 * Store for months of the year
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.system.Months', {
	extend: 'Ext.data.Store',
	alias : 'store.system.months',
	
	requires: ['NP.lib.core.Translator'],
	
	fields: [
		{ name: 'month', type: 'int' },
		{ name: 'name' }
	],

	constructor: function() {
		var me    = this,
			month = Ext.Date.parse('1900-01-01', 'Y-m-d'),
			i;

		me.data = [];

		for (i=1; i<=12; i++) {
			me.data.push({
				month: i,
				name : Ext.Date.format(month, 'F')
			});
			month = Ext.Date.add(month, Ext.Date.MONTH, 1);
		}

		me.callParent(arguments);
	}
});