Ext.define('NP.view.viewport.dashboard.InvoicesOnHold', {
	extend : 'NP.lib.ui.Grid',
	alias  : 'widget.viewport.dashboard.invoicesonhold',
	
	initComponent: function() {
		this.columns = {
		    items: [
		        Ext.create('NP.view.shared.gridcol.PropertyName'),
		        Ext.create('NP.view.shared.gridcol.VendorName'),
		        Ext.create('NP.view.shared.gridcol.InvoiceAmount'),
		        Ext.create('NP.view.shared.gridcol.InvoiceNumber'),
		        Ext.create('NP.view.shared.gridcol.InvoiceDate'),
		        Ext.create('NP.view.shared.gridcol.InvoiceHoldDate'),
		        Ext.create('NP.view.shared.gridcol.InvoiceDaysOnHold'),
		        Ext.create('NP.view.shared.gridcol.InvoiceOnHoldBy')
		    ],
		    defaults: {
		        flex: 1
		    }
		};

		this.callParent(arguments);
	}
});