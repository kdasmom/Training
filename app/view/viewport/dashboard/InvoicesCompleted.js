Ext.define('NP.view.viewport.dashboard.InvoicesCompleted', {
	extend  : 'NP.lib.ui.Grid',
	alias   : 'widget.viewport.dashboard.invoicescompleted',
	
	initComponent: function() {
		this.selModel = Ext.create('Ext.selection.CheckboxModel');
		this.columns = {
		    items: [
		        Ext.create('NP.view.shared.gridcol.InvoiceDate',         { flex: 1 }),
		        Ext.create('NP.view.shared.gridcol.PropertyName',        { flex: 1 }),
		        Ext.create('NP.view.shared.gridcol.PriorityFlag',        { flex: 1 }),
		        Ext.create('NP.view.shared.gridcol.InvoiceNeededByDate', { flex: 1 }),
		        Ext.create('NP.view.shared.gridcol.VendorName',          { flex: 1 }),
		        Ext.create('NP.view.shared.gridcol.InvoiceNumber',       { flex: 1 }),
		        Ext.create('NP.view.shared.gridcol.InvoiceAmount',       { flex: 1 }),
		        Ext.create('NP.view.shared.gridcol.InvoicePendingDays',  { flex: 1 }),
		        Ext.create('NP.view.shared.gridcol.InvoiceDueDate',      { flex: 1 }),
		        Ext.create('NP.view.shared.gridcol.InvoicePeriod',       { flex: 1 })
		    ],
		    defaults: {
		        flex: 1
		    }
		};

		this.callParent(arguments);
	}
});