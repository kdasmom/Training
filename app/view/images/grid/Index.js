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
            'image.gridcol.Source'
        ];
        this.autoscroll = true;

        var picker = Ext.ComponentQuery.query(
            '[itemId~="componentContextPicker"]'
        );
        if (picker && picker[0] && picker[0].getState) {
            var state = picker[0].getState();
        }

        this.store = Ext.create('NP.store.image.ImageIndexes', {
            service    : 'ImageService',
            action     : 'getImagesToIndex1',
            paging     : true,
            extraParams: {
		userprofile_id             : NP.Security.getUser().get('userprofile_id'),
		delegated_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id'),
                contextType     : state && state[0] ? state[0].getState().type : 'all',
		contextSelection: state && state[0] ? state[0].getState().selected : ''

            }
        });

        this.callParent(arguments);
    }
});