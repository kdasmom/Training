Ext.define('NP.view.image.grid.SearchCDIndex', {
    extend: 'NP.lib.ui.Grid',
    alias:  'widget.image.grid.searchcdindex',

    requires:[
        'NP.lib.core.Translator',
        'NP.view.image.gridcol.Amount',
        'NP.view.image.gridcol.CreatedDT',
        'NP.view.image.gridcol.DocType',
        'NP.view.image.gridcol.ImageToCDDiskNum',
        'NP.view.image.gridcol.Reference',
        'NP.view.vendor.gridcol.VendorName'
    ],

    initComponent: function() {
        this.columns = {
            defaults: { flex: 1 },
            items   : [
                { xtype: 'datecolumn', dataIndex: 'image_scan_datetm', text: NP.Translator.translate('Date') },
                { xtype: 'image.gridcol.doctype' },
                { xtype: 'vendor.gridcol.vendorname' },
                { xtype: 'image.gridcol.amount' },
                { dataIndex: 'ref_number', text: NP.Translator.translate('Reference') },
                { xtype: 'image.gridcol.imagetocddisknum' }
            ]
        };

    	this.store = Ext.create('NP.store.image.ImageToCDs', {
            service    : 'ImageService',
            action     : 'imageSearchCDIndex',
            paging     : true
        });

        this.callParent(arguments);
    }
});