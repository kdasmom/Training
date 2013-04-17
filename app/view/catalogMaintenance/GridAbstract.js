/**
 * Abstract Catalog grid that can be extended
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalogMaintenance.GridAbstract', {
    extend: 'NP.lib.ui.Grid',
    
    requires: [
        'NP.view.catalog.gridcol.Type',
        'NP.view.catalog.gridcol.NumberOfItems',
        'NP.view.catalog.gridcol.CreatedOn',
        'NP.view.catalog.gridcol.LastUpdated',
        'NP.view.catalog.gridcol.Status',
        'NP.view.shared.button.New'
    ],

    paging: true,

    initComponent: function() {
        // These are the default colums that will show for every extended grid
        var defaultColumns = [
            { text: 'Vendor Name', dataIndex: 'vc_vendorname', flex: 3 },
            { text: 'Catalog Name', dataIndex: 'vc_catalogname', flex: 3 },
            { xtype: 'catalog.gridcol.type', flex: 2 },
            { xtype: 'catalog.gridcol.numberofitems', flex: 1 },
            { xtype: 'catalog.gridcol.createdon', flex: 2 },
            { xtype: 'catalog.gridcol.lastupdated', flex: 2 },
            { xtype: 'catalog.gridcol.status', flex: 1 }
        ];
        this.columns = defaultColumns.concat(this.columns);

        this.pagingToolbarButtons = [{ xtype: 'shared.button.new', itemId: 'newCatalogBtn', text: 'New Catalog', style: 'margin-left:12px' }];

        this.callParent(arguments);
    }
});