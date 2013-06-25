/**
 * My Settings: Display section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.mySettings.Display', {
    extend: 'NP.lib.ui.BoundForm',
    alias: 'widget.mysettings.display',
    
    title: 'Display',

	viewingSizeLabelText       : 'Split Screen Viewing Size',
	customBoxText              : 'Custom',
	viewingOrientationLabelText: 'Split Screen Viewing Orientation',
	verticalLabelText          : 'Vertical',
	horizontalLabelText        : 'Horizontal',
	imagePositionLabelText     : 'Split Screen Image Position',
	leftPositionText           : 'Left (Bottom for Horizontal View)',
	rightPositionText          : 'Right (Top for Horizontal View)',
	defaultViewLabelText       : 'Default View',
	splitScreenViewText        : 'Split Screen',
	poReceiptInvoiceViewText   : 'PO / Receipt / Invoice',

    layout: 'vbox',
    bodyPadding: 8,
    autoScroll: true,

    bind: {
    	models: ['user.Userprofile']
    },

    initComponent: function() {
    	var that = this;

    	var bar = [
	    	 { xtype: 'shared.button.save' }
	    ];
	    this.tbar = bar;
	    this.bbar = bar;

    	this.defaults = { layout: 'hbox', labelWidth: 200 };
    	this.items = [
    		{
    			xtype: 'radiogroup',
    			itemId: 'userprofile_splitscreen_size',
    			fieldLabel: this.viewingSizeLabelText,
    			defaults: { name: 'userprofile_splitscreen_size', margin: '0 5 0 0' },
    			items: [
    				{ boxLabel: '25%', inputValue: 25 },
    				{ boxLabel: '50%', inputValue: 50 },
    				{ boxLabel: '65%', inputValue: 65 },
    				{ boxLabel: this.customBoxText, name: 'userprofile_splitscreen_size', inputValue: -1 },
    				{ xtype: 'numberfield', hidden: true, hideLabel: true, name: 'userprofile_splitscreen_size_custom', size: 3, minValue: 0, maxValue: 75 }
    			]
    		},{
    			xtype: 'radiogroup',
    			fieldLabel: this.viewingOrientationLabelText,
    			defaults: { name: 'userprofile_splitscreen_isHorizontal', margin: '0 5 0 0' },
    			items: [
    				{ boxLabel: this.verticalLabelText, inputValue: 0, checked: true },
    				{ boxLabel: this.horizontalLabelText, inputValue: 1 }
    			]
    		},{
    			xtype: 'radiogroup',
    			fieldLabel: this.imagePositionLabelText,
    			defaults: { name: 'userprofile_splitscreen_ImageOrder', margin: '0 5 0 0' },
    			items: [
    				{ boxLabel: this.leftPositionText, inputValue: 0, checked: true },
    				{ boxLabel: this.rightPositionText, inputValue: 1 }
    			]
    		},{
    			xtype: 'radiogroup',
    			fieldLabel: this.defaultViewLabelText,
    			defaults: { name: 'userprofile_splitscreen_LoadWithoutImage', margin: '0 5 0 0' },
    			items: [
    				{ boxLabel: this.splitScreenViewText, inputValue: 0, checked: true },
    				{ boxLabel: this.poReceiptInvoiceViewText, inputValue: 1 }
    			]
    		}
    	];

    	this.callParent(arguments);

    	var screenSizeField = this.query('#userprofile_splitscreen_size')[0];
    	var screenSizeCustomField = that.query('[name="userprofile_splitscreen_size_custom"]')[0];
    	screenSizeField.on('change', function(field, newValue, oldValue) {
    		if (newValue['userprofile_splitscreen_size'] === -1) {
    			screenSizeCustomField.setValue(50);
    			screenSizeCustomField.show();
    		} else {
    			screenSizeCustomField.hide();
    			screenSizeCustomField.setValue('');
    		}
    	});
    }
});