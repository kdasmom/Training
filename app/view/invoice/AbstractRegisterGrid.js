Ext.define('NP.view.invoice.AbstractRegisterGrid', {
    extend: 'Ext.grid.Panel',
    store: '',
    
    requires: 'NP.core.Util',
    
    constructor: function(cfg) {
    	cfg.columns = {
		    items: [
		        {
		            text: 'Vendor',
		            dataIndex: 'vendor_name'
		        },{
		            text: 'Amount',
		            dataIndex: 'invoice_amount',
		            renderer: NP.core.Util.currencyRenderer
		        },{
		            text: 'Property',
		            dataIndex: 'property_name'
		        },{
		            text: 'Invoice Number',
		            dataIndex: 'invoice_ref'
		        },{
		            text: 'Invoice Date',
		            dataIndex: 'invoice_datetm',
		            xtype:'datecolumn'
		        }
		    ],
		    defaults: {
		        flex: 1
		    }
		};
		
    	Ext.applyIf(cfg, {
    		dockedItems: [{
				xtype: 'pagingtoolbar',
				dock: 'top',
				store: this.store,
				displayInfo: true
			}]
    	});
    	
    	if (this.extraCols) {
    		cfg.columns.items = cfg.columns.items.concat(this.extraCols);
    	}
    	
    	this.callParent(arguments);
    }
});