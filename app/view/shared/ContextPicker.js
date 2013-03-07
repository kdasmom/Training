Ext.define('NP.view.shared.ContextPicker', function () {
    
    return {
        extend: 'Ext.panel.Panel',
        alias: 'widget.shared.contextpicker',
        
        requires: ['NP.lib.core.Config','NP.lib.core.Security'],

        layout: {
            type : 'hbox',
            align: 'middle'
        },
        
        border: false,
        style: 'background-color: transparent',
        bodyStyle: 'background-color: transparent',

        padding: '2 0 2 0',

        defaults: {
            border: false,
            margin: '0 0 0 15',
            style: 'background-color: transparent',
            bodyStyle: 'background-color: transparent'
        },

        propertyComboText       : NP.lib.core.Config.getSetting('PN.main.PropertyLabel'),
        regionComboText         : NP.lib.core.Config.getSetting('PN.Main.RegionLabel'),
        currentPropertyRadioText: 'Current ' + NP.lib.core.Config.getSetting('PN.main.PropertyLabel'),
        regionRadioText         : NP.lib.core.Config.getSetting('PN.Main.RegionLabel'),
        allPropertiesRadioText  : 'All ' + NP.lib.core.Config.getSetting('PN.Main.PropertiesLabel'),

        initComponent: function() {
            var that = this;

            // Middle column displays the region and property combo boxes (only one active at a time)
            var default_prop = NP.lib.core.Security.getUser().get('userprofile_preferred_property');
            var default_region = NP.lib.core.Security.getUser().get('userprofile_preferred_region');
            var hide_prop = true;
            var hide_region = true;
            var select_all = false;

            if ( Ext.isNumeric(default_region) && default_region ) {
                hide_region = false;
            } else if ( Ext.isNumeric(default_prop) && default_prop ) {
                hide_prop = false;
            } else {
                hide_prop = false;
                select_all = true;
            }

            if (default_region == 0) {
                default_region = null;
            }

            // Inner function for re-use below
            function triggerChangeEvent() {
                var state = that.getState();
                that.fireEvent('change', that, state.contextFilterType, state.selected);
            }

            this.items = [{
                flex  : 1,
                defaults: {
                    padding: 0,
                    margin : 0
                },
                items: [{
                    xtype            : 'customcombo',
                    itemId           : '__contextPickerUserPropertiesCombo',
                    store            : 'user.Properties',
                    fieldLabel       : this.propertyComboText,
                    labelAlign       : 'right',
                    selectFirstRecord: true,
                    displayField     : 'property_name',
                    valueField       : 'property_id',
                    value            : default_prop,
                    hidden           : hide_prop,
                    listeners        : {
                        select: function() {
                            // Suspend events briefly to prevent change event on radio buttons from firing
                            var filterTypeComp = that.queryById('__contextPickercontextFilterType');
                            filterTypeComp.suspendEvents(false);
                            filterTypeComp.queryById('__currentPropFilterType').setValue(true);
                            filterTypeComp.resumeEvents();

                            triggerChangeEvent();
                        }
                    }
                },{
                    xtype            : 'customcombo',
                    itemId           : '__contextPickerUserRegionsCombo',
                    store            : 'user.Regions',
                    fieldLabel       : this.regionComboText,
                    labelAlign       : 'right',
                    selectFirstRecord: true,
                    displayField     : 'region_name',
                    valueField       : 'region_id',
                    value            : default_region,
                    hidden           : hide_region,
                    listeners        : {
                        select: function() {
                            triggerChangeEvent();
                        }
                    }
                }]
            }];
            
            // Left column displays the radio buttons for choosing to see Current Property, Region, or All Properties
            this.items.push({
                xtype      : 'checkboxgroup',
                itemId     : '__contextPickercontextFilterType', 
                defaults: {
                    xtype: 'radio',
                    style: 'white-space: nowrap;margin-right:12px;'
                },
                listeners: {
                    change: function(field, newValue, oldValue) {
                        var selVal = newValue.contextFilterType;
                        if (!(selVal instanceof Object)) {
                            if (selVal == 'property' || selVal == 'all') {
                                var showComp = '__contextPickerUserPropertiesCombo';
                                var hideComp = '__contextPickerUserRegionsCombo';
                            } else if (selVal == 'region') {
                                var showComp = '__contextPickerUserRegionsCombo';
                                var hideComp = '__contextPickerUserPropertiesCombo';
                            }

                            that.queryById(showComp).show();
                            that.queryById(hideComp).hide();

                            triggerChangeEvent();
                        }
                    }
                },
                items      : [
                    {
                        boxLabel  : this.currentPropertyRadioText,
                        itemId    : '__currentPropFilterType',
                        name      : 'contextFilterType',
                        inputValue: 'property',
                        checked   : !hide_prop && !select_all
                    },
                    {
                        boxLabel  : this.regionRadioText, 
                        name      : 'contextFilterType', 
                        inputValue: 'region',
                        checked   : !hide_region
                    },
                    {
                        boxLabel  : this.allPropertiesRadioText, 
                        name      : 'contextFilterType', 
                        inputValue: 'all',
                        checked   : select_all
                    }
                ]
            });

            // Add custom event that can be listened to by other components
            this.addEvents('change');

            this.callParent(arguments);
        },

        getState: function() {
            var contextFilterType = this.queryById('__contextPickercontextFilterType').getValue().contextFilterType;
            var selected;
            if (contextFilterType == 'region') {
                var combo = this.queryById('__contextPickerUserRegionsCombo');
                selected = combo.getValue();
            } else if (contextFilterType == 'property') {
                var combo = this.queryById('__contextPickerUserPropertiesCombo');
                selected = combo.getValue();
            } else if (contextFilterType == 'all') {
                var combo = this.queryById('__contextPickerUserRegionsCombo');
                selected = null;
            }
            return { contextFilterType: contextFilterType, selected: selected };
        }
    }
});