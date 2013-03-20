Ext.define('NP.view.viewport.dashboard.InvoicesToApprove', {
	extend : 'NP.lib.ui.Grid',
	alias  : 'widget.viewport.dashboard.invoicestoapprove',
	
	initComponent: function() {
		this.columns = {
		    items: [
		        Ext.create('NP.view.shared.gridcol.InvoiceDate'),
		        Ext.create('NP.view.shared.gridcol.PropertyName'),
		        Ext.create('NP.view.shared.gridcol.VendorName'),
		        Ext.create('NP.view.shared.gridcol.InvoiceNumber'),
		        Ext.create('NP.view.shared.gridcol.InvoiceAmount'),
		        Ext.create('NP.view.shared.gridcol.InvoicePendingDays'),
		        Ext.create('NP.view.shared.gridcol.InvoiceDueDate')
		    ],
		    defaults: {
		        flex: 1
		    }
		};

		this.callParent(arguments);
	}
});