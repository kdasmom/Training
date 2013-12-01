Ext.define('NP.view.images.grid.SearchCDIndex', {
    extend: 'NP.view.image.ImageGrid',
    alias:  'widget.images.grid.SearchCDIndex',

    fullData: true,

    requires:[
        'NP.view.image.gridcol.ImageScanDateTM',
        'NP.view.image.gridcol.ImageToCDDiskNum',
        'NP.view.image.gridcol.CreatedDT',
        'NP.view.image.gridcol.RefNumber'
    ],

    initComponent: function(){
        this.cols = [
            'image.gridcol.createddt',
            'image.gridcol.documenttype',
            'vendor.gridcol.VendorName',
            'image.gridcol.Amount',
            'image.gridcol.reference',
            'image.gridcol.imagetocddisknum',
        ];

	this.store = Ext.create('NP.lib.data.Store', {
            service    : 'ImageService',
            action     : 'imageSearchCDIndex',
            paging     : true
        });

        this.callParent(arguments);
    }
});