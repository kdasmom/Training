Ext.define('NP.view.images.grid.Invoices', {
    extend: 'NP.view.images.grid.Base',
    alias:  'widget.images.grid.Invoices',

    initComponent: function(){
        this.cols = [
            'image.gridcol.ScanDate',
            'property.gridcol.PropertyName',
            'vendor.gridcol.VendorName',
            'image.gridcol.RefNumber',
            'image.gridcol.Amount',
            'image.gridcol.InvoiceDate',
            'shared.gridcol.PriorityFlag',
            'image.gridcol.Source'
        ]
        this.autoscroll = true;

        var picker = Ext.ComponentQuery.query(
            '[itemId~="componentContextPicker"]'
        );
        if (picker && picker[0] && picker[0].getState) {
            var state = picker[0].getState();
        }

	this.store = Ext.create('NP.store.image.ImageIndexes', {
            service    : 'ImageService',
            action     : 'getImagesToConvert1',
            paging     : true,
            pageSize: 25,
            extraParams: {
                paging     : true,
		userprofile_id             : NP.Security.getUser().get('userprofile_id'),
		delegated_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id'),
                contextType     : state && state[0] ? state[0].getState().type : 'all',
		contextSelection: state && state[0] ? state[0].getState().selected : ''
            }
        });

        this.callParent(arguments);
    }
});