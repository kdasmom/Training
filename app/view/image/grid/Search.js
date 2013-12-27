Ext.define('NP.view.image.grid.Search', {
    extend: 'NP.view.image.ImageGrid',
    alias:  'widget.image.grid.Search',

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