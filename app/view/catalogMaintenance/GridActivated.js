/**
 * Activated Catalogs grid
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.admin.catalog.GridActivated', {
    extend: 'NP.view.catalogMaintenance.GridAbstract',
    alias: 'widget.catalogmaintenance.gridactivated',
    
    stateful: true,
    stateId: 'active_catalog_grid',

    title: 'Activated Catalogs',

    store: Ext.create('NP.store.catalog.Vc', {
        service    : 'CatalogService',
        action     : 'getRegister',
        paging     : true,
        extraParams: { vc_status: '1,0' } 
    }),

    paging: true,

    viewConfig : { markDirty: false },

    // These are the default colums that will show for every extended grid
    columns: [
        {
            dataIndex: 'vc_status',
            flex: 1,
            tdCls: 'image-button-cell',
            align: 'center',
            renderer: function(val) {
                var name = (val == 1) ? 'Inactivate' : 'Activate';
                return '<img src="resources/images/buttons/'+name.toLowerCase()+'_button.gif" title="'+name+'" alt="'+name+'" />'
            }
        }
    ]
});