/**
 * Grid column for Invoice Status
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.InvoiceStatus', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.shared.gridcol.invoicestatus',

	text     : 'Status',
	dataIndex: 'invoice_status',
	renderer: function(val, meta, rec) {
		var ret;
		switch(val) {
			case 'open':
				ret = 'In Progress'
				break;
			case 'forapproval':
				ret = 'Pending Approval'
				break;
			case 'approved':
				ret = 'Approved'
				break;
			case 'rejected':
				ret = 'Rejected'
				break;
			case 'saved':
				ret = 'Complete'
				break;
			case 'submitted':
				ret = 'Submitted For Payment'
				break;
			case 'sent':
				ret = 'In ' + rec.get('integration_package_type_display_name')
				break;
			case 'posted':
				ret = 'Posted In ' + rec.get('integration_package_type_display_name')
				break;
			case 'paid':
				ret = 'Paid'
				break;
			case 'hold':
				ret = 'Hold'
				break;
			case 'void':
				ret = 'Void'
				break;
		}

		return ret;
	}
});