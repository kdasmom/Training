/**
 * @author Baranov A.V.
 * @date 10/4/13
 */

Ext.define('NP.view.vendor.VendorGeneralInfoAndSettings', {
	extend: 'Ext.container.Container',
	alias: 'widget.vendor.vendorgeneralinfoandsettings',

	requires: [
		'NP.lib.core.Security',
		'NP.lib.ui.ComboBox'
	],

	padding: 8,

	// For localization
	title                     : 'General info and settings',

	// Custom options

	initComponent: function() {
		var that = this;

		this.defaults = {
			labelWidth: 150
		};

		this.callParent(arguments);
	}
});