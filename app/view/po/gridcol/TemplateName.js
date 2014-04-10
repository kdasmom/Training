/**
 * Grid column for Template Name
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.po.gridcol.TemplateName', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.po.gridcol.templatename',

	text     : 'Template Name',
	dataIndex: 'purchaseorder_ref'
});