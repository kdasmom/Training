Ext.define('NP.view.images.grid.SearchCDIndex', {
    extend: 'NP.view.images.grid.Base',
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
            'image.gridcol.imagescandatetm',
            'image.gridcol.imagetocddisknum',
            'image.gridcol.Amount',
            'image.gridcol.doctype',
            'image.gridcol.createddt',
            'image.gridcol.refnumber',
            'vendor.gridcol.VendorName'
        ];

	this.store = Ext.create('NP.lib.data.Store', {
            service    : 'ImageService',
            action     : 'imageSearchCDIndex',
            paging     : true
        });

        this.callParent(arguments);
    }
});