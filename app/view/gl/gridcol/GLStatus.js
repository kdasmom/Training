/**
 * Grid column for GL Status
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.gl.gridcol.GLStatus', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.gl.gridcol.glstatus',

	requires: ['NP.lib.core.Config'],

	dataIndex: 'glaccount_status',

	initComponent: function() {
		this.text = 'Status';
		
		this.callParent(arguments);
	}
});