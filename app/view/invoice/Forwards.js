Ext.define('NP.view.invoice.Forwards', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.invoiceForwards',
	
	store: 'InvoiceForwards',
	
	title: 'Invoice Forwards',
	viewConfig: {
		emptyText: '<i>This invoice has not been forwarded</i>',
		deferEmptyText: false
	},
	
	columns: {
		items: [
			{
				text: 'Sent From',
				dataIndex: 'forward_from_name'
			},
			{
				text: 'Sent To Email',
				dataIndex: 'forward_to_email'
			},
			{
				text: 'Sent To',
				dataIndex: 'forward_to_name'
			},
			{
				text: 'Date Forwarded',
				dataIndex: 'forward_datetm',
				xtype:'datecolumn'
			},
			{
				text: 'Details',
				dataIndex: 'invoicepo_forward_id',
				renderer: function() {}
			}
		],
		defaults: {
			flex: 1
		}
	}
});