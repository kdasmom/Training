Ext.define('NP.view.images.grid.Index', {
    extend: 'NP.view.images.grid.Base',
    alias:  'widget.images.grid.Index',

    initComponent: function(){
        this.cols = [
            'image.gridcol.Name',
            'image.gridcol.ScanDate',
            'image.gridcol.DocType',
            'property.gridcol.PropertyName',
            'vendor.gridcol.VendorName',
            'image.gridcol.Source'
        ]

        this.store = Ext.create('NP.store.image.ImageIndexes', {
            service    : 'ImageService',
            action     : 'getImagesToIndex1',
            paging     : true,
            extraParams: {
		userprofile_id             : NP.Security.getUser().get('userprofile_id'),
		delegated_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id'),
                contextType     : 'all',// state && state[0] ? state[0].getState().type : '',
		contextSelection: ''//state && state[0] ? state[0].getState().selected : ''

            }
        });
//            var contextpicker = Ext.ComponentQuery.query(
//                '[xtype="shared.contextpickermulti"]'
//            )[0];

        this.callParent(arguments);
    }
});