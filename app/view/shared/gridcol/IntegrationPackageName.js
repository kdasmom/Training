/**
 * Grid column for Property
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.IntegrationPackageName', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.shared.gridcol.integrationpackagename',

	requires: ['NP.lib.core.Config'],

	text: 'Integration Package',
	dataIndex: 'integration_package_name'
});