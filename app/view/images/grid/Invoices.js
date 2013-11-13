Ext.define('NP.view.images.grid.Invoices', {
    extend: 'NP.view.images.grid.Base',
    alias:  'widget.images.grid.Invoices',

    initComponent: function(){
        var baseCols       = ['image.gridcol.ScanDate','property.gridcol.PropertyName','vendor.gridcol.VendorName'];
        var indexedCols    = baseCols.slice(0);
        indexedCols.push('image.gridcol.Reference','image.gridcol.Amount','image.gridcol.InvoiceDate','shared.gridcol.PriorityFlag','image.gridcol.Source');
        
        this.cols = [
            'image.gridcol.ScanDate','image.gridcol.Reference','image.gridcol.Amount','image.gridcol.InvoiceDate','shared.gridcol.PriorityFlag','image.gridcol.Source'
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