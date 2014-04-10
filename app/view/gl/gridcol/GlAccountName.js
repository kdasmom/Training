/**
 * Grid column for GL Account
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.gl.gridcol.GlAccountName', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.gl.gridcol.glaccountname',

	requires: [
		'NP.lib.core.Config',
		'NP.model.gl.GlAccount'
	],

	text: 'GL Account',

	renderer : function(val, meta, rec) {
		if (rec.getGl) {
			return rec.getGl().get('display_name');
		}

		if (rec.get('glaccount_id') !== null) {
			return NP.model.gl.GlAccount.formatName(rec.get('glaccount_number'), rec.get('glaccount_name'));
		}

		return '';
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