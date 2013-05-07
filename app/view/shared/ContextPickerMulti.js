/**
 * A custom container that shows a Context Picker, which is a picker that allows you to select what
 * properties the user is viewing items for. The container displays four radio buttons: Current Property,
 * Multiple Properties, Region, and All Properties. Clicking on the last three pops up additional options
 * for selecting properties, regions, or whether to get active, inactive, or on hold properties.
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.ContextPickerMulti', {     
    extend: 'Ext.container.Container',
    alias: 'widget.shared.contextpickermulti',
    
    requires: ['NP.lib.core.Config','NP.lib.core.Security'],

    // We need a static variable to be able to give the radio buttons a different name per instance
    statics: {
        pickerInstanceId: 0
    },

    currentPropertyRadioText: 'Current ' + NP.lib.core.Config.getSetting('PN.main.PropertyLabel'),
    multiPropertyRadioText  : 'Multiple ' + NP.lib.core.Config.getSetting('PN.main.PropertiesLabel'),
    regionRadioText         : NP.lib.core.Config.getSetting('PN.Main.RegionLabel'),
    allPropertiesRadioText  : 'All ' + NP.lib.core.Config.getSetting('PN.Main.PropertiesLabel'),
    activePropText          : 'Active',
    inactivePropText        : 'Inactive',
    onholdPropText          : 'On Hold',

    initComponent: function() {
        var that = this;

        var propertyLabel = NP.lib.core.Config.getSetting('PN.main.PropertyLabel');
        var propertiesLabel = NP.lib.core.Config.getSetting('PN.main.PropertiesLabel');
        var regionLabel = NP.lib.core.Config.getSetting('PN.Main.RegionLabel');

        // Increment the static variable for instance ID
        NP.view.shared.ContextPickerMulti.pickerInstanceId++;

        // Save this picker's ID in the instance
        this.pickerId = NP.view.shared.ContextPickerMulti.pickerInstanceId;

        this.items = [
            this.radioGroup = Ext.create('Ext.form.RadioGroup', {
                defaults: {
                    xtype: 'radio',
                    style: 'white-space:nowrap;margin-right:12px;'
                },
                listeners: {
                    change: function(field, newValue, oldValue) {
                        var state = that.getState();
                        
                        var panels = ['multiProperty','region','all'];
                        Ext.Array.each(panels, function(panel) {
                            var panelObj = that[panel + 'Panel'];
                            if (panel == state.type) {
                                panelObj.show();
                            } else {
                                panelObj.hide();
                            }
                        });
                    }
                },
                items      : [
                    Ext.create('Ext.form.field.Radio', {
                        boxLabel  : this.currentPropertyRadioText,
                        name      : 'contextPickerMultiType' + this.pickerId, // Dynamic name to avoid errors when using multiple pickers
                        inputValue: 'property',
                        checked   : true
                    }),
                    Ext.create('Ext.form.field.Radio', {
                        boxLabel  : this.multiPropertyRadioText,
                        name      : 'contextPickerMultiType' + this.pickerId, // Dynamic name to avoid errors when using multiple pickers
                        inputValue: 'multiProperty'
                    }),
                    Ext.create('Ext.form.field.Radio', {
                        boxLabel  : this.regionRadioText,
                        name      : 'contextPickerMultiType' + this.pickerId, // Dynamic name to avoid errors when using multiple pickers
                        inputValue: 'region'
                    }),
                    Ext.create('Ext.form.field.Radio', {
                        boxLabel  : this.allPropertiesRadioText, 
                        name      : 'contextPickerMultiType' + this.pickerId, // Dynamic name to avoid errors when using multiple pickers
                        inputValue: 'all'
                    })
                ]
            }),
            this.multiPropertyPanel = Ext.create('Ext.ux.form.field.BoxSelect', {
                emptyText   : 'Select ' + propertiesLabel + '...',
                queryMode   : 'local',
                selectOnTab : false,
                displayField: 'property_name',
                valueField  : 'property_id',
                store       : Ext.getStore('user.Properties'),
                hidden      : true,
                width       : 400,
                growMin     : 75,
                growMax     : 300
            }),
            this.regionPanel = Ext.create('Ext.ux.form.field.BoxSelect', {
                emptyText   : 'Select ' + regionLabel + 's...',
                queryMode   : 'local',
                selectOnTab : false,
                displayField: 'region_name',
                valueField  : 'region_id',
                store       : Ext.getStore('user.Regions'),
                hidden      : true,
                width       : 400,
                growMin     : 75,
                growMax     : 300
            }),
            this.allPanel = Ext.create('Ext.form.CheckboxGroup', {
                hidden: true,
                defaults: {
                    style: 'white-space:nowrap;margin-right:12px;'
                },
                listeners: {
                    change: function(field, newValue, oldValue) {
                        var state = that.getState();

                        var panels = ['multiProperty','region'];
                        Ext.Array.each(panels, function(panel) {
                            var panelObj = that[panel + 'Panel'];
                            if (panel == state.type) {
                                panelObj.show();
                            } else {
                                panelObj.hide();
                            }
                        });

                        that.fireEvent('change', that, state.type, state.selected);
                    }
                },
                items      : [
                    Ext.create('Ext.form.field.Checkbox', {
                        boxLabel  : this.activePropText,
                        name      : 'contextPickerMultiAllType' + this.pickerId, // Dynamic name to avoid errors when using multiple pickers
                        inputValue: 1,
                        checked   : true
                    }),
                    Ext.create('Ext.form.field.Checkbox', {
                        boxLabel  : this.inactivePropText,
                        name      : 'contextPickerMultiAllType' + this.pickerId, // Dynamic name to avoid errors when using multiple pickers
                        inputValue: 0
                    }),
                    Ext.create('Ext.form.field.Checkbox', {
                        boxLabel  : this.onholdPropText,
                        name      : 'contextPickerMultiAllType' + this.pickerId, // Dynamic name to avoid errors when using multiple pickers
                        inputValue: -1
                    })
                ]
            })
        ];

        // Add custom event that can be listened to by other components
        this.addEvents('change');
        this.addStateEvents('change');

        this.callParent(arguments);
    },

    getState: function() {
        var selected, type;
        
        type = this.radioGroup.getValue()['contextPickerMultiType' + this.pickerId];
        if (type == 'property') {
            selected = NP.Security.getCurrentContext().property_id;
        } else if (type == 'multiProperty') {
            selected = this.multiPropertyPanel.getValue();
        } else if (type == 'region') {
            selected = this.regionPanel.getValue();
        } else {
            selected = this.allPanel.getValue()['contextPickerMultiAllType' + this.pickerId];
        }
        
        return { type: type, selected: selected };
    }
});