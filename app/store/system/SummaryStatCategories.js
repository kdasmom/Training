/**
 * Store for Summary Stat Categories. This is a static store, it does not use an Ajax proxy. Additional summary stats
 *  categoriesshould be added here to be used by other parts of the app.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.system.SummaryStatCategories', {
	extend: 'Ext.data.Store',
	
	requires: ['NP.lib.core.Translator'],
	
	fields: ['title','name'],
	
	constructor: function() {
		var me = this;

		me.data = [
			{ name: 'po', title: 'Purchase Orders' },
			{ name: 'invoice', title: 'Invoice' },
			{ name: 'image', title: 'Image' },
			{ name: 'vendor', title: 'Vendor' },
			{ name: 'budget', title: 'Budget' }
		];

		me.callParent(arguments);

		me.addEvents('statcategoriesloaded');

		// We need the locale to be loaded before we can run this because we need to localize the text
		NP.Translator.on('localeloaded', function() {
			var recs = me.getRange();
			for (var i=0; i<recs.length; i++) {
				recs[i].set('title', NP.Translator.translate(recs[i].get('title')));
			}

			me.fireEvent('statcategoriesloaded');
		});
	}
});