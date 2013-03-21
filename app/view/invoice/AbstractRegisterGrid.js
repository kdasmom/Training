Ext.define('NP.view.invoice.AbstractRegisterGrid', {
    extend: 'NP.lib.ui.Grid',
    
    requires: ['NP.lib.core.Util','NP.lib.core.Config'],
    
	vendorColumnText  : 'Vendor',
	amountColumnText  : 'Amount',
	propertyColumnText: NP.lib.core.Config.getSetting('PN.main.PropertyLabel'),
	numberColumnText  : 'Invoice Number',
	dateColumnText    : 'Invoice Date',

	constructor: function(cfg) {
		cfg.paging = true;
		cfg.columns = {
		    items: [
		        {
		            text: this.vendorColumnText,
		            dataIndex: 'vendor_name'
		        },{
		            text: this.amountColumnText,
		            dataIndex: 'invoice_amount',
		            renderer: NP.lib.core.Util.currencyRenderer
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
		
		this.store = Ext.create('NP.store.invoice.Register');
    	
    	if (this.extraCols) {
    		cfg.columns.items = cfg.columns.items.concat(this.extraCols);
    	}

    	cfg.stateful = true;
    	
    	this.callParent(arguments);
    }
});