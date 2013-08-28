/**
 * Grid column for Integration Package Name
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.IntegrationPackageName', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.shared.gridcol.integrationpackagename',

	requires: ['NP.lib.core.Config'],

	text     : 'Integration Package',
	dataIndex: 'integration_package_name',

	renderer : function(val, meta, rec) {
		if (rec.getIntegrationPackage) {
			return rec.getIntegrationPackage().get('integration_package_name');
		} else if (rec.getVendor) {
			return rec.getVendor().getIntegrationPackage().get('integration_package_name');
		}

		return val;
	}
});