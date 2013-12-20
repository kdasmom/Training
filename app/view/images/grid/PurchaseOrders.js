Ext.define('NP.view.images.grid.PurchaseOrders', {
    extend: 'NP.view.images.grid.Base',
    alias:  'widget.images.grid.PurchaseOrders',

    initComponent: function(){
        this.cols = [
            'image.gridcol.ScanDate',
            'property.gridcol.PropertyName',
            'vendor.gridcol.VendorName',
            'image.gridcol.Reference',
            'image.gridcol.Amount',
            'image.gridcol.Source',
            //'image.gridcol.ImageType'
            'image.gridcol.Type'
        ];
        this.autoscroll = true;

        var context = NP.Security.getCurrentContext();

        this.store = Ext.create('NP.store.image.ImageIndexes', {
            service    : 'ImageService',
            action     : 'getImagesToConvert',
            paging     : true,
            pageSize: 25,
            extraParams: {
                userprofile_id             : NP.Security.getUser().get('userprofile_id'),
                delegated_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id'),
                contextType                : context.type,
                contextSelection           : (context.type == 'region') ? context.region_id : context.property_id,
                docTypes                   : 'Purchase Order,Receipt',
                countOnly                  : 'false'
            }
        });
        this.callParent(arguments);
    }
});