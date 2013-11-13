Ext.define('NP.view.images.grid.Index', {
    extend: 'NP.view.images.grid.Base',
    //extend: 'NP.view.image.ImageGrid',
    alias:  'widget.images.grid.Index',

    initComponent: function(){
        var baseCols       = ['image.gridcol.ScanDate','property.gridcol.PropertyName','vendor.gridcol.VendorName'];
        var indexedCols    = baseCols.slice(0);
        indexedCols.push('image.gridcol.Name','image.gridcol.DocType','image.gridcol.Source');
        
        this.cols = [
            'images.grid.columnview',
            'image.gridcol.ScanDate','image.gridcol.Name','image.gridcol.DocType','image.gridcol.Source'
        ];

	this.store = Ext.create('NP.store.image.ImageIndexes', {
            service    : 'ImageService',
            action     : 'getImagesToIndex1',
            paging     : true,
            extraParams: {
                //tab                        : 'index', 
		userprofile_id             : NP.Security.getUser().get('userprofile_id'),
		delegated_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id'),
                contextType     : 'all',// state && state[0] ? state[0].getState().type : '',
		contextSelection: ''//state && state[0] ? state[0].getState().selected : ''

            }
        });


        //this.cols = indexedCols;
        /*this.store = Ext.create('NP.store.image.ImageIndexes', {
            service    : 'ImageService',
            action     : 'getImagesToIndex1',
            paging     : true,
            extraParams: {
                //tab                        : tab, 
		userprofile_id             : NP.Security.getUser().get('userprofile_id'),
		delegated_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id')
            }
        });*/


/*        
        itemId  : 'image_grid_' + tab.toLowerCase(),
        stateful: true,
        stateId : 'image_management_' + tab,
        
)
*/        
        this.callParent(arguments);
    }
});