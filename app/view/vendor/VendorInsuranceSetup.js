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
		'NP.view.vendor.InsuranceForm',
		'NP.lib.core.Translator'
	],

	padding: 8,

	// For localization
	title: 'Insurance Setup',
    addInsuranceBtnText: 'Add',
    daysNoticeLabelText: 'How many days notice prior to expiration for Expired Insurance Certificates Warning?',
	overflowX: 'scroll',
	insurances: [],

	// Custom options

    startIndex: 0,

	initComponent: function() {
		var that = this;

		that.title = NP.Translator.translate(that.title);

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
            },
			{
				xtype: 'container',
				name: 'test'
			}
        ];

		Ext.Array.each(this.insurances, function(insurance) {
			that.addInsurance(insurance);
		});

		this.callParent(arguments);
	},

    addInsurance: function (model, isEdit) {
        var that = this;

		var container = this.down('container');

		var insConf ={
			bind: {
				models: [{classPath: 'vendor.Insurance'}]
			},
			startIndex: that.startIndex,
			modelData: model,
			itemId: 'vendorinsurances' + that.startIndex
		};
		var insForm = Ext.create('NP.view.vendor.InsuranceForm', insConf);

		if (model) {
			insForm.setModel('vendor.Insurance', Ext.create('NP.model.vendor.Insurance', model));
			if (!isEdit) {
				container.items.push(insForm);
			} else {
				container.add(insForm);
			}
		} else {
			container.add(insForm);
		}

        this.startIndex++;
    }
});