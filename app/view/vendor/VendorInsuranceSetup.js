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
    daysNoticeLabelText: 'How many days notice prior to expiration for Expired Insurance Certificates Warning?',

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
            },
            {
                xtype: 'textfield',
                name: 'vendorsite_DaysNotice_InsuranceExpires',
                fieldLabel: this.daysNoticeLabelText,
                labelWidth: 546,
                width: 680,
                value: 0
            }
        ];

		this.callParent(arguments);
	},

    addInsurance: function (model) {
        var that = this;

		var insConf ={
			bind: {
				models: ['vendor.Insurance']
			},
			startIndex: that.startIndex
		};
		insForm = Ext.create('NP.view.vendor.InsuranceForm', insConf);

		if (model) {
			insForm.setModel('vendor.Insurance', model);
		}

		this.add(insForm);

        this.startIndex++;
    }
});