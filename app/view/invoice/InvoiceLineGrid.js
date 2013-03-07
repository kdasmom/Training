Ext.define('NP.view.invoice.InvoiceLineGrid', {
    extend: 'Ext.grid.Panel',
    
    alias: 'widget.invoicelinegrid',
    
    requires: [
    	'NP.lib.core.Util'
    	,'NP.model.gl.GLAccount'
    ],
    
    store: 'invoice.Lines',

    features: [{
		ftype: 'summary'
	}],
    
    border: 0, 
    columns: {
    	items: [
	        {
	            text: 'Qty',
	            dataIndex: 'invoiceitem_quantity',
	            flex: 1,
	            summaryType: 'sum',
				summaryRenderer: function(value, summaryData, dataIndex) {
					return value + ' items';
				}
	        },{
	            text: 'Description',
	            dataIndex: 'invoiceitem_description',
	            flex: 3
	        },{
	            text: 'GL Account',
	            dataIndex: 'glaccount_number',
	            renderer: function(val, meta, rec) {
	            	return NP.model.gl.GLAccount.getFormattedName(val, rec.get('glaccount_name'));
	            },
	            flex: 2
	        },{
	            text: 'Item price',
	            dataIndex: 'invoiceitem_unitprice',
	            renderer: NP.lib.core.Util.currencyRenderer,
	            flex: 1,
	            summaryType: 'average',
				summaryRenderer: NP.lib.core.Util.currencyRenderer
	        },{
	            text: 'Amount',
	            dataIndex: 'invoiceitem_amount',
	            renderer: NP.lib.core.Util.currencyRenderer,
	            flex: 1,
	            summaryType: 'sum',
				summaryRenderer: NP.lib.core.Util.currencyRenderer
	        }
    	]
    }
});