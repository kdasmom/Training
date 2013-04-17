/**
 * Activated Catalogs grid
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.admin.catalog.GridPending', {
    extend: 'NP.view.catalogMaintenance.GridAbstract',
    alias: 'widget.catalogmaintenance.gridpending',
    
    stateful: true,
    stateId: 'pending_catalog_grid',

    title: 'Pending Catalogs',

    store: Ext.create('NP.store.catalog.Vc', {
		service    : 'CatalogService',
		action     : 'getRegister',
		paging     : true,
		extraParams: { vc_status: '-2,-1' } 
    }),

    columns: [
        {
            flex: 0.1,
            tdCls: 'image-button-cell',
            align: 'center',
            renderer: function(val) {
                return '<img src="resources/images/buttons/delete.gif" title="Delete" alt="Delete" />'
            }
        }
    ]
});