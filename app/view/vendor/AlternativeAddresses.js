/**
 * Created by rnixx on 10/31/13.
 */


Ext.define('NP.view.vendor.AlternativeAddresses', {
	extend: 'Ext.container.Container',
	alias: 'widget.vendor.alternativeaddresses',

	requires: [
		'NP.lib.core.Security',
		'NP.lib.ui.ComboBox'
	],

	padding: 8,

	// For localization
	title                     : NP.Translator.translate('Alternative addresses'),

	initComponent: function() {
		var that = this;

		this.defaults = {
			labelWidth: 150,
			width: 500
		};

		this.items = [];

		this.callParent(arguments);
	}
});