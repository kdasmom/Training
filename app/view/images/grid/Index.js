Ext.define('NP.view.images.grid.Index', {
    extend: 'NP.view.images.grid.Base',
    alias:  'widget.images.grid.Index',

    initComponent: function(){
        this.cols = [
            'image.gridcol.Name',
            'image.gridcol.ScanDate',
            'image.gridcol.ImageType',
            'property.gridcol.PropertyName',
            'vendor.gridcol.VendorName',
            'image.gridcol.ScanSource'
        ];
        this.autoscroll = true;

        var context = NP.Security.getCurrentContext();

        this.store = Ext.create('NP.store.image.ImageIndexes', {
            service    : 'ImageService',
            action     : 'getImagesToIndex',
            paging     : true,
            extraParams: {
                userprofile_id             : NP.Security.getUser().get('userprofile_id'),
                delegated_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id'),
                contextType                : context.type,
                contextSelection           : (context.type == 'region') ? context.region_id : context.property_id,
                countOnly                  : 'false'
            }
        });

        this.callParent(arguments);
    }
});