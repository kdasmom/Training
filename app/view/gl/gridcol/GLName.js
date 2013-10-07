/**
 * Grid column for GL Name
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.gl.gridcol.GLName', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.gl.gridcol.glname',

	requires: ['NP.lib.core.Config'],

	dataIndex: 'glaccount_name',

	initComponent: function() {
		this.text = 'GL Name';
		
		this.callParent(arguments);
	}
});