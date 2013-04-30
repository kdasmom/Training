/**
 * Grid with items for a catalog
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalogMaintenance.ItemGrid', {
    extend: 'NP.lib.ui.Grid',
    alias : 'widget.catalogmaintenance.itemgrid',
    
    requires: [
        'NP.view.catalog.gridcol.VcItemCategory',
        'NP.view.catalog.gridcol.VcItemDesc',
        'NP.view.catalog.gridcol.VcItemManufacturer',
        'NP.view.catalog.gridcol.VcItemNumber',
        'NP.view.catalog.gridcol.VcItemPrice',
        'NP.view.catalog.gridcol.VcItemType',
        'NP.view.catalog.gridcol.VcItemUom',
        'NP.view.shared.gridcol.ButtonImg',
        'NP.lib.ui.ComboBox'
    ],

    paging: true,

    stateful: true,
    stateId: 'catalog_maintenance_items',

    store: Ext.create('NP.store.catalog.VcItems', {
        service: 'CatalogService',
        action : 'getItems',
        paging : true
    }),

    columns: [
        { xtype: 'catalog.gridcol.vcitemcategory', flex: 2 },
        { xtype: 'catalog.gridcol.vcitemtype', flex: 2 },
        { xtype: 'catalog.gridcol.vcitemnumber', flex: 2 },
        { xtype: 'catalog.gridcol.vcitemprice', flex: 1 },
        { xtype: 'catalog.gridcol.vcitemdesc', flex: 4 },
        { xtype: 'catalog.gridcol.vcitemuom', flex: 2 },
        { xtype: 'catalog.gridcol.vcitemmanufacturer', flex: 3 },
        {
            xtype: 'shared.gridcol.buttonimg',
            dataIndex: 'vcitem_status',
            flex: 1.5,
            renderer: function(val) {
                var name = (val == 1) ? 'Inactivate' : 'Activate';
                return '<img src="resources/images/buttons/'+name.toLowerCase()+'_button.gif" title="'+name+'" alt="'+name+'" />'
            }
        }
    ],

    pagingToolbarButtons: [
        {
            xtype         : 'customcombo',
            stateful      : true,
            stateId       : 'catalog_maintenance_items_filter',
            forceSelection: true,
            editable      : false,
            typeAhead     : false,
            fieldLabel    : 'View',
            labelWidth    : 35,
            displayField  : 'name',
            valueField    : 'code',
            margin        : '0 0 0 20',
            selectFirstRecord: true,
            store         : Ext.create('Ext.data.Store', {
                fields: ['code','name'],
                data  : [
                    { code: 'active', name: 'Active Items' },
                    { code: 'inactive', name: 'Inactive Items' },
                    { code: 'all', name: 'All Items' },
                    { code: 'category', name: 'View by Category' }
                ]
            })
        },{
            xtype         : 'customcombo',
            stateful      : true,
            stateId       : 'catalog_maintenance_items_category',
            editable      : false,
            typeAhead     : false,
            hidden        : true,
            fieldLabel    : 'Category',
            labelWidth    : 50,
            displayField  : 'category_name',
            valueField    : 'category_id',
            margin        : '0 0 0 20',
            selectFirstRecord: true,
            store         : 'catalog.VcItemCategories'
        }
    ],

    getFilterCombo: function() {
        if (!this.filterCombo) {
            this.filterCombo = this.query('combo')[0];
        }

        return this.filterCombo;
    },

    getCategoryCombo: function() {
        if (!this.categoryCombo) {
            this.categoryCombo = this.query('combo')[1];
        }

        return this.categoryCombo;
    }
});