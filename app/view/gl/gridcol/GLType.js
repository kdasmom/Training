/**
 * Grid column for GL Type
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.gl.gridcol.GLType', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.gl.gridcol.gltype',

	requires: ['NP.lib.core.Config'],

	dataIndex: 'glaccounttype_id',

	initComponent: function() {
		this.text = 'Type';
		
		this.callParent(arguments);
	}
});