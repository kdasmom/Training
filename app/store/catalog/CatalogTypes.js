/**
 * Store for Catalog Types
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.catalog.CatalogTypes', {
    extend: 'Ext.data.Store',
    
    fields: ['id','name'],
    
    data: [
        { id: 'excel', name: 'Excel File' },
        { id: 'pdf', name: 'PDF File' },
        { id: 'url', name: 'URL' },
        { id: 'punchout', name: 'Punchout' }
    ]
});