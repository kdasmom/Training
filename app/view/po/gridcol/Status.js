/**
 * Grid column for PO Status
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.po.gridcol.Status', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.po.gridcol.status',

	text     : 'PO Status',
	dataIndex: 'purchaseorder_status',
	renderer : function(val, meta, rec) {
		if (val == 'draft') {
			return (rec.get('property_id') == 0) ? 'User Template' : 'Template';
		} else if (val == 'open') {
			return 'In Progress'
		} else if (val == 'forapproval') {
			return 'Pending Approval';
		} else if (val == 'saved') {
			return 'Released';
		} else if (val == 'closed') {
			return 'Invoiced';
		} else {
			return Ext.util.Format.capitalize(val);
		}
	}
});