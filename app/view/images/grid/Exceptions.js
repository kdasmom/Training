Ext.define('NP.view.images.grid.Exceptions', {
    extend: 'NP.view.images.grid.Base',
    alias:  'widget.images.grid.Exceptions',

    initComponent: function(){
        this.cols = [
            'image.gridcol.ScanDate',
            'image.gridcol.ImageType',
            'property.gridcol.PropertyName',
            'vendor.gridcol.VendorName',
            'image.gridcol.Reference',
            'image.gridcol.Amount',
            'image.gridcol.ExceptionBy',
            'image.gridcol.ExceptionDate'
            
        ];
        this.autoscroll = true;

        var context = NP.Security.getCurrentContext();

        this.store = Ext.create('NP.store.image.ImageIndexes', {
            service    : 'ImageService',
            action     : 'getImageExceptions',
            paging     : true,
            pageSize   : 25,
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