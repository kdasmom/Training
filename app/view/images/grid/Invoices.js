Ext.define('NP.view.images.grid.Invoices', {
    extend: 'NP.view.images.grid.Base',
    alias:  'widget.images.grid.Invoices',

    requires: [
        'NP.lib.core.Security'
    ],

    initComponent: function(){
        this.cols = [
            'image.gridcol.ScanDate',
            'property.gridcol.PropertyName',
            'vendor.gridcol.VendorName',
            'image.gridcol.Reference',
            'image.gridcol.Amount',
            'image.gridcol.InvoiceDate',
            'shared.gridcol.PriorityFlag',
            'image.gridcol.Source'
        ]
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
                countOnly                  : 'false'
            }
        });

        this.callParent(arguments);
    }
});