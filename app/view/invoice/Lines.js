Ext.define('NP.view.invoice.Lines', function() {
	
	return {
		extend: 'Ext.panel.Panel',
		alias: 'widget.invoicelinepanel',
		
		requires: [
			'NP.view.invoice.InvoiceLineGrid'
			,'NP.view.invoice.InvoiceLineForm'
		],
		
		title: 'Line Items',
		
		layout: {
			type: 'hbox',
			align: 'stretch'
		},
		
		border: 0,
		
		items: [
			{
				xtype: 'invoicelinegrid',
				flex: 1
			},
			{
				xtype: 'invoicelineform',
				flex: 1,
				hidden: true
			}
		]
	}
});