/**
 * Grid column for Priority Flag
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.PriorityFlag', {
	extend   : 'Ext.grid.column.Column',
	alias    : 'widget.shared.gridcol.priorityflag',
	
	text     : 'Priority',
	dataIndex: 'PriorityFlag_Display',

	renderer: function(val, meta, rec) {
		if (rec.getPriorityFlag) {
			return rec.getPriorityFlag().get('PriorityFlag_Display');
		}

		return val;
	}
});