Ext.define('NP.view.invoice.AbstractRegisterGrid', {
    extend: 'Ext.grid.Panel',
    store: '',
    
    requires: ['NP.core.Util','NP.core.Config'],
    
	vendorColumnText  : 'Vendor',
	amountColumnText  : 'Amount',
	propertyColumnText: NP.core.Config.getSetting('PN.main.PropertyLabel'),
	numberColumnText  : 'Invoice Number',
	dateColumnText    : 'Invoice Date',

    constructor: function(cfg) {
    	cfg.columns = {
		    items: [
		        {
		            text: this.vendorColumnText,
		            dataIndex: 'vendor_name'
		        },{
		            text: this.amountColumnText,
		            dataIndex: 'invoice_amount',
		            renderer: NP.core.Util.currencyRenderer
		        },{
		            text: this.propertyColumnText,
		            dataIndex: 'property_name'
		        },{
		            text: this.numberColumnText,
		            dataIndex: 'invoice_ref'
		        },{
		            text: this.dateColumnText,
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