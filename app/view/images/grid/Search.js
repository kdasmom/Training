Ext.define('NP.view.images.grid.Search', {
    extend: 'NP.view.images.grid.Base',
    alias:  'widget.images.grid.Search',

    initComponent: function(){
        this.cols = [
            'image.gridcol.Name',
            'image.gridcol.DocType',
            'image.gridcol.ScanDate',
            'property.gridcol.PropertyName',
            'vendor.gridcol.VendorName'
        ];

	this.store = Ext.create('NP.store.image.ImageIndexes', {
            service    : 'ImageService',
            action     : 'imageSearch',
            paging     : true
        });

        this.callParent(arguments);
    }
});