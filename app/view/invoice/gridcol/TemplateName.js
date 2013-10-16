/**
 * Grid column for Template Name
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.TemplateName', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.invoice.gridcol.templatename',

	text     : 'Template Name',
	dataIndex: 'template_name'
});