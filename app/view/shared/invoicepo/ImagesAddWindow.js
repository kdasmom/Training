/**
 * The Manage Images window for invoice/po page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.ImagesAddWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.shared.invoicepo.imagesaddwindow',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
    	'NP.lib.core.Util',
        'NP.lib.ui.Grid',
        'NP.store.image.ImageIndexes',
        'NP.view.image.gridcol.Name',
        'NP.view.image.gridcol.ScanDate',
        'NP.view.image.gridcol.ImageStatus',
        'NP.view.image.gridcol.Reference',
        'NP.view.image.gridcol.Amount',
        'NP.view.vendor.gridcol.VendorName',
        'NP.view.property.gridcol.PropertyName',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Save'
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
            throw 'You must specify a valid "type" attribute for the ImagesAddWindow class';
        }

    	type = Ext.util.Format.capitalize(me.type);

        me.title = NP.Translator.translate('Attach Images');
        
        me.items = [{
            xtype     : 'customgrid',
            border    : false,  
            selType   : 'checkboxmodel',
            tbar      : [
                { xtype: 'shared.button.cancel', handler: function() { me.close(); } },
                { xtype: 'shared.button.save' }
            ],
            columns   : [
                { xtype: 'image.gridcol.name', flex: 2 },
                { xtype: 'image.gridcol.imagestatus', flex: 1 },
                { xtype: 'property.gridcol.propertyname', flex: 1 },
                { xtype: 'vendor.gridcol.vendorname', flex: 1 },
                { xtype: 'image.gridcol.reference', flex: 1 },
                { xtype: 'image.gridcol.amount', width: 80 },
                { xtype: 'image.gridcol.scandate', width: 80 }
            ],
            store  : {
                type   : 'image.imageindexes',
                service: type + 'Service',
                action : 'getAddableImages'
            }
        }];

        me.callParent(arguments);
    }
});