Ext.define('NP.view.images.grid.DeletedImages', {
    extend: 'NP.view.images.grid.Base',
    alias:  'widget.images.grid.DeletedImages',

    initComponent: function(){
        this.cols = [
            'image.gridcol.Name',
            //Delete Date
            //Deleted By
            'image.gridcol.ScanDate',
            'image.gridcol.DocType',
            'property.gridcol.PropertyName',
            'vendor.gridcol.VendorName',
            'image.gridcol.Reference',
            'image.gridcol.Amount'
        ];

	this.store = Ext.create('NP.store.image.ImageIndexes', {
            service    : 'ImageService',
            action     : 'getImagesToDelete',
            paging     : true,
            pageSize: 25,
            extraParams: {
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