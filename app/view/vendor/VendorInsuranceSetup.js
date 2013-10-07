/**
 * @author Baranov A.V.
 * @date 10/4/13
 */

Ext.define('NP.view.vendor.VendorInsuranceSetup', {
	extend: 'Ext.container.Container',
	alias: 'widget.vendor.vendorinsurancesetup',

	requires: [
		'NP.lib.core.Security',
		'NP.lib.ui.ComboBox',
		'NP.view.vendor.InsuranceForm'
	],

	padding: 8,

	// For localization
	title                     : 'Insurance setup',
    addInsuranceBtnText: 'Add',

	// Custom options

    startIndex: 0,

	initComponent: function() {
		var that = this;

		this.defaults = {
			labelWidth: 150
		};

        this.items = [
            {
                xtype: 'shared.button.new',
                text: this.addInsuranceBtnText,
                handler: function() {
                    Ext.bind(that.addInsurance(), that, []);
                }
            }
        ];

		this.callParent(arguments);
	},

    addInsurance: function () {
        var that = this;

        var item = this.add({
            xtype: 'vendor.insuranceform'
        });

        return item;
    }
});