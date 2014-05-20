/**
 * My Settings: Settings section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.mySettings.Settings', {
    extend: 'NP.lib.ui.BoundForm',
    alias: 'widget.mysettings.settings',
    
    requires: [
    	'NP.lib.core.Config',
    	'NP.lib.core.Security',
    	'NP.lib.ui.AutoComplete',
    	'NP.view.shared.PropertyCombo',
    	'NP.view.shared.button.Save',
    	'NP.lib.ui.ComboBox',
    	'NP.store.system.SummaryStatCategories'
    ],

    title: 'Settings',

    bodyPadding: 8,

    bind: {
    	models: ['user.Userprofile']
    },

    initComponent: function() {
    	var that = this;

    	var bar = [{ xtype: 'shared.button.save' }];

    	this.tbar = bar;
    	this.bbar = bar;

    	this.defaults = {
			width     : 500,
			labelWidth: 175
    	};

    	this.summaryStatStore = Ext.create('NP.store.system.SummaryStats');

    	this.items = [
    		{
				xtype       : 'customcombo',
				fieldLabel  : 'Preferred ' + NP.Config.getPropertyLabel(),
				name        : 'userprofile_preferred_property',
				displayField: 'property_name',
				valueField  : 'property_id',
				store       : 'user.Properties',
				emptyText   : NP.Translator.translate('System Default'),
				afterSubTpl : '<i>' + NP.Translator.translate('Will be ignored if Region is selected') + '</i>'
    		},{
    			xtype       : 'customcombo',
    			fieldLabel  : 'Preferred ' + NP.Config.getSetting('PN.main.RegionLabel', 'Region'),
			    name        : 'userprofile_preferred_region',
			    displayField: 'region_name',
			    valueField  : 'region_id',
			    store       : 'user.Regions',
				emptyText   : 'Use ' + NP.Config.getPropertyLabel(),
				afterSubTpl : '<i>' + NP.Translator.translate('Leave blank to use Property') + '</i>'
    		},{
    			xtype       : 'customcombo',
    			fieldLabel  : 'Default Dashboard',
			    name        : 'category_name',
			    displayField: 'title',
			    valueField  : 'name',
			    store       : 'system.SummaryStatCategories',
				emptyText   : 'Home Page',
				listeners   : {
					select: Ext.bind(this.onCategorySelect, this)
				}
    		},{
    			xtype       : 'customcombo',
    			itemId      : 'defaultSummaryStatCombo',
    			fieldLabel  : 'Default Summary Statistic',
			    name        : 'userprofile_default_dashboard',
			    displayField: 'title',
			    valueField  : 'id',
			    store       : this.summaryStatStore
    		}
    	];

    	this.callParent(arguments);

    	this.propertyCombo = this.query('[name="userprofile_preferred_property"]')[0];
    	this.regionCombo = this.query('[name="userprofile_preferred_region"]')[0];
    	this.categoryCombo = this.query('[name="category_name"]')[0];
    	this.summaryStatCombo = this.query('[name="userprofile_default_dashboard"]')[0];
    },

    onCategorySelect: function() {
    	var combo = this.categoryCombo;
    	// If there's a category selected, proceed
    	if (combo.getValue() !== null) {
    		// Get the record for the selected summary stat category
    		var rec = combo.getStore().findRecord('name', combo.getValue());
    		// Set the filter for the summary stat combo
    		this.summaryStatStore.filterBy(function(statRec) {
				if (statRec.get('category') == rec.get('name')) {
					return true;
				}
				return false;
			});

    		// Make sure the summary stat combo is visible
			this.summaryStatCombo.show();

			// Check if we have a valid selection in the summary stat combo
			var summaryStatId = this.summaryStatCombo.getValue();
            if (summaryStatId !== null) {
				var summaryStatRec = this.summaryStatStore.findExact('id', summaryStatId);
                if (summaryStatRec === -1) {
                    summaryStatId = null;
                }
			}

            // If the selection doesn't exist in the store, select the first item from the store
            if (summaryStatId === null) {
                this.summaryStatCombo.setValue(this.summaryStatStore.getAt(0));
            }
		// ...else, if we selected Home Page as the Dashboard (empty selection), hide the summary stat combo
		} else {
			this.summaryStatCombo.clearValue();
			this.summaryStatCombo.hide();
			this.summaryStatStore.filterBy(function() {});
		}
    }
});