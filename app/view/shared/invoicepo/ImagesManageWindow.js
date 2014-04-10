/**
 * The Manage Images window for invoice/po page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.ImagesManageWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.shared.invoicepo.imagesmanagewindow',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
    	'NP.lib.core.Util',
        'NP.lib.ui.Grid',
        'NP.store.image.ImageIndexes',
        'NP.view.image.gridcol.Name',
        'NP.view.image.gridcol.ScanDate',
        'NP.view.image.gridcol.Source',
        'NP.view.vendor.gridcol.VendorName',
        'NP.view.property.gridcol.PropertyName',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Delete'
    ],
    
    // Determines if you're managing images for an invoice/PO; valid values are 'invoice' and 'po'
    type: null,

    layout: 'fit',

    modal : true,
    width : 800,
    height: 300,

    initComponent: function() {
        var me = this,
            type;

        if (!Ext.Array.contains(['invoice','po'], me.type)) {
            throw 'You must specify a valid "type" attribute for the ImagesManageWindow class';
        }

    	type = Ext.util.Format.capitalize(me.type);

        me.title = NP.Translator.translate('Manage Images');
        
        me.items = [{
            xtype     : 'customgrid',
            selType   : 'checkboxmodel',
            viewConfig: { markDirty: false },
            tbar      : [
                { xtype: 'shared.button.cancel', handler: function() { me.close(); } },
                { xtype: 'shared.button.delete', text: 'Delete Images' }
            ],
            columns   : [
                { xtype: 'image.gridcol.name', flex: 2 },
                { xtype: 'image.gridcol.scandate', width: 80 },
                { xtype: 'image.gridcol.source', width: 120 },
                { xtype: 'vendor.gridcol.vendorname', flex: 1 },
                { xtype: 'property.gridcol.propertyname', flex: 1 },
                {
                    text     : NP.Translator.translate('Primary'),
                    dataIndex: 'Image_Index_Primary',
                    width    : 50,
                    renderer : function(val) {
                        if (val === 1) {
                            return 'Yes';
                        }

                        return 'No';
                    }
                },
                {
                    xtype : 'actioncolumn',
                    text  : 'Make Primary',
                    width : 85,
                    align : 'center',
                    getClass: function(val, meta, rec) {
                        if (rec.get('Image_Index_Primary') !== 1) {
                            return 'view-btn';
                        }

                        return 'no-pointer';
                    },
                    handler: function(view, rowIndex, colIndex, item, e, rec, row) {
                        if (rec.get('Image_Index_Primary') !== 1) {
                            me.fireEvent('makeprimary', rowIndex, rec);
                        }
                    }
                }
            ],
            store  : {
                type   : 'image.imageindexes',
                service: type + 'Service',
                action : 'getImages'
            }
        }];

        me.callParent(arguments);

        me.addEvents('makeprimary');
    }
});