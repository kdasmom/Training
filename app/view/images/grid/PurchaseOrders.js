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
            'image.gridcol.DocType',
            //Marked as Exception By
            //Exception Date
        ];
	this.store = Ext.create('NP.store.image.ImageIndexes', {
            service    : 'ImageService',
            action     : 'getImagesToConvert1',
            paging     : true,
            pageSize: 25,
            extraParams: {
                //tab                        : 'index', 
                paging     : true,
		userprofile_id             : NP.Security.getUser().get('userprofile_id'),
		delegated_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id'),
                contextType     : 'all',// state && state[0] ? state[0].getState().type : '',
		contextSelection: ''//state && state[0] ? state[0].getState().selected : ''

            }
        });
        this.callParent(arguments);
    }
});