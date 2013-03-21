Ext.define('NP.view.viewport.dashboard.InvoicesByUser', {
	extend : 'NP.lib.ui.Grid',
	alias  : 'widget.viewport.dashboard.invoicesbyuser',
	
	initComponent: function() {
		this.columns = {
		    items: [
		        Ext.create('NP.view.shared.gridcol.InvoiceDate'),
		        Ext.create('NP.view.shared.gridcol.PropertyName'),
		        Ext.create('NP.view.shared.gridcol.PriorityFlag'),
		        Ext.create('NP.view.shared.gridcol.VendorName'),
		        Ext.create('NP.view.shared.gridcol.InvoiceNumber'),
		        Ext.create('NP.view.shared.gridcol.InvoicePendingDays'),
		        Ext.create('NP.view.shared.gridcol.InvoiceAmount'),
		        Ext.create('NP.view.shared.gridcol.InvoiceStatus')
		    ],
		    defaults: {
		        flex: 1
		    }
		};

		this.callParent(arguments);
	}
});