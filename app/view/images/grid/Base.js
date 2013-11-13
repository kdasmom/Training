Ext.define('NP.view.images.grid.Base', {
    //extend: 'NP.lib.ui.Grid',
    extend: 'NP.view.image.ImageGrid',
    alias:  'widget.images.grid.Base',

    initComponent: function(){
        this.selType = 'checkboxmodel'
        this.selModel = {
            mode: 'MULTI',
            checkOnly: true
        };

        this.paging = true;
        this.defaultWidth = 50;

//this.cols = [];
        /*this.columns = [
            {header: 'Name',  dataIndex: 'name',  flex: 1},
            {header: 'Test',  dataIndex: 'test',  flex: 1},
            {header: 'Email', dataIndex: 'email', flex: 1}
        ];
        this.store = {
            fields: ['name', 'email'],
            data  : [
                {name: 'Ed',    email: 'ed@sencha.com', id: '123'},
                {name: 'Tommy', email: 'tommy@sencha.com', id: '456'}
            ]
        };*/
        
/*this.store   = Ext.create('NP.store.image.Images', {
					service    : 'ImageService',
					action     : 'getImagesToIndex1',
                                        paging     : true,
					extraParams: {
						//tab                        : tab, 
						userprofile_id             : NP.Security.getUser().get('userprofile_id'),
						delegated_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id')
			       	}        });

        // Custom fields used by lib.ui.Grid
        this.paging = true;*/

        this.callParent(arguments);
    }
});