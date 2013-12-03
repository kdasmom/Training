/**
 * Grid column for GL Account
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.gl.gridcol.GlAccountName', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.gl.gridcol.glaccountname',

	requires: ['NP.lib.core.Config'],

	text: 'GL Account',

	renderer : function(val, meta, rec) {
		if (rec.getGl) {
			return rec.getGl().get('display_name');
		}
		return rec.get('display_name');
	},

	initComponent: function() {
		var glDisplay = NP.Config.getSetting('PN.Budget.GLDisplayOrder', 'number').toLowerCase();

		if (glDisplay == 'name') {
			this.dataIndex = 'glaccount_name';
		} else {
			this.dataIndex = 'glaccount_number';
		}

		this.callParent(arguments);
	}
});