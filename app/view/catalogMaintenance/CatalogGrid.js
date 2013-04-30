/**
 * Catalog grid
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalogMaintenance.CatalogGrid', {
    extend: 'NP.lib.ui.Grid',
    alias : 'widget.catalogmaintenance.cataloggrid',
    
    requires: [
        'NP.view.catalog.gridcol.VcType',
        'NP.view.catalog.gridcol.VcNumberOfItems',
        'NP.view.catalog.gridcol.VcCreatedOn',
        'NP.view.catalog.gridcol.VcLastUpdated',
        'NP.view.catalog.gridcol.VcStatus',
        'NP.view.shared.button.New',
        'NP.view.shared.gridcol.ButtonImg'
    ],

    paging: true,

    viewConfig : { markDirty: false },

    initComponent: function() {
        // Add the base columns for the grid
        this.columns = [
            { text: 'Vendor Name', dataIndex: 'vc_vendorname', flex: 3 },
            { text: 'Catalog Name', dataIndex: 'vc_catalogname', flex: 3 },
            { xtype: 'catalog.gridcol.vctype', flex: 2 },
            { xtype: 'catalog.gridcol.vcnumberofitems', flex: 1 },
            { xtype: 'catalog.gridcol.vccreatedon', flex: 2 },
            { xtype: 'catalog.gridcol.vclastupdated', flex: 2 },
            { xtype: 'catalog.gridcol.vcstatus', flex: 1 }
        ];

        // Create the store, only thing that changes between stores is the vc_status
        this.store = Ext.create('NP.store.catalog.Vc', {
            service    : 'CatalogService',
            action     : 'getRegister',
            paging     : true,
            extraParams: { vc_status: this.vc_status } 
        });

        // Dynamic state ID so each iteration has its own
        this.stateId = this.type + '_catalog_grid';

        // Custom columns for Activated grid
        if (this.type == 'activated') {
            this.columns.push({
                xtype: 'shared.gridcol.buttonimg',
                dataIndex: 'vc_status',
                flex: 1,
                renderer: function(val) {
                    var name = (val == 1) ? 'Inactivate' : 'Activate';
                    return '<img src="resources/images/buttons/'+name.toLowerCase()+'_button.gif" title="'+name+'" alt="'+name+'" />'
                }
            });
        // Custom columns for Pending grid
        } else if (this.type == 'pending') {
            this.columns.push({
                flex: 0.1,
                tdCls: 'image-button-cell',
                align: 'center',
                renderer: function(val) {
                    return '<img src="resources/images/buttons/delete.gif" title="Delete" alt="Delete" />'
                }
            });
        } else {
            throw 'Invalid type attribute. Valid type attributes are "activated" and "pending"';
        }

        // Add New button to paging toolbar
        this.pagingToolbarButtons = [{ xtype: 'shared.button.new', itemId: 'newCatalogBtn', text: 'New Catalog', style: 'margin-left:12px' }];

        this.callParent(arguments);
    }
});