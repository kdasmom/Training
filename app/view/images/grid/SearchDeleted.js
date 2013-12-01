Ext.define('NP.view.images.grid.SearchDeleted', {
    extend: 'NP.view.image.ImageGrid',
    alias:  'widget.images.grid.SearchDeleted',

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
            action     : 'imageSearchDeleted',
            paging     : true
        });

        this.callParent(arguments);
    }
});