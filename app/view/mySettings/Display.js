/**
 * My Settings: Display section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.mySettings.Display', {
    extend: 'NP.lib.ui.BoundForm',
    alias: 'widget.mysettings.display',

    requires: ['NP.lib.core.Translator'],
    
    layout: 'vbox',
    bodyPadding: 8,
    autoScroll: true,

    bind: {
    	models: ['user.Userprofile']
    },

    initComponent: function() {
    	var that = this;

        that.title = NP.Translator.translate('Display');

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
    			fieldLabel: NP.Translator.translate('Split Screen Viewing Size'),
    			defaults: { name: 'userprofile_splitscreen_size', margin: '0 5 0 0' },
    			items: [
    				{ boxLabel: '25%', inputValue: 25 },
    				{ boxLabel: '50%', inputValue: 50 },
    				{ boxLabel: '65%', inputValue: 65 },
    				{ boxLabel: NP.Translator.translate('Custom'), name: 'userprofile_splitscreen_size', inputValue: -1 },
    				{ xtype: 'numberfield', hidden: true, hideLabel: true, name: 'userprofile_splitscreen_size_custom', size: 3, minValue: 0, maxValue: 75 }
    			]
    		},{
    			xtype: 'radiogroup',
    			fieldLabel: NP.Translator.translate('Split Screen Viewing Orientation'),
    			defaults: { name: 'userprofile_splitscreen_isHorizontal', margin: '0 5 0 0' },
    			items: [
    				{ boxLabel: NP.Translator.translate('Vertical'), inputValue: 0, checked: true },
    				{ boxLabel: NP.Translator.translate('Horizontal'), inputValue: 1 }
    			]
    		},{
    			xtype: 'radiogroup',
    			fieldLabel: NP.Translator.translate('Split Screen Image Position'),
    			defaults: { name: 'userprofile_splitscreen_ImageOrder', margin: '0 5 0 0' },
    			items: [
    				{ boxLabel: NP.Translator.translate('Left (Bottom for Horizontal View)'), inputValue: 0, checked: true },
    				{ boxLabel: NP.Translator.translate('Right (Top for Horizontal View)'), inputValue: 1 }
    			]
    		},{
    			xtype: 'radiogroup',
    			fieldLabel: NP.Translator.translate('Default View'),
    			defaults: { name: 'userprofile_splitscreen_LoadWithoutImage', margin: '0 5 0 0' },
    			items: [
    				{ boxLabel: NP.Translator.translate('Split Screen'), inputValue: 0, checked: true },
    				{ boxLabel: NP.Translator.translate('PO / Receipt / Invoice'), inputValue: 1 }
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