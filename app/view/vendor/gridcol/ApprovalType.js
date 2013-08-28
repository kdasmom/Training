/**
 * Grid column for Approval Type
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.vendor.gridcol.ApprovalType', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.vendor.gridcol.approvaltype',

	text     : 'Approval Type',
	dataIndex: 'approval_type',

	renderer: function(val) {
		if (val != 'New') {
			return 'Modification';
		}

		return val;
	}
});