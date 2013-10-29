/**
 * Store for Catalog Types
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.catalog.CatalogTypes', {
    extend: 'Ext.data.Store',
	
	requires: ['NP.lib.core.Translator'],
    
    fields: ['id','name'],
    
    data: [
        { id: 'excel', name: 'Excel File' },
        { id: 'pdf', name: 'PDF File' },
        { id: 'url', name: 'URL' },
        { id: 'punchout', name: 'Punchout' }
    ],

	constructor: function() {
		var me = this;

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