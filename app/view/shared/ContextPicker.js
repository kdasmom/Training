/**
 * A custom container that shows a Context Picker, which is a picker that allows you to select what is
 * properties the user is viewing items for. The container displays a drop down on the left (for either
 * properties or regions depending on what radio button is selected) and three radio buttons on the
 * right: Current Property, Region, and All Properties.
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.ContextPicker', {
    extend: 'Ext.container.Container',
    alias: 'widget.shared.contextpicker',
    
    requires: ['NP.lib.core.Config','NP.lib.core.Security','NP.lib.ui.ComboBox'],

    // We need a static variable to be able to give the radio buttons a different name per instance
    statics: {
        pickerInstanceId: 0
    },

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

        // Increment the static variable for instance ID
        NP.view.shared.ContextPicker.pickerInstanceId++;

        // Save this picker's ID in the instance
        this.pickerId = NP.view.shared.ContextPicker.pickerInstanceId;

        // Middle column displays the region and property combo boxes (only one active at a time)
        var state = NP.Security.getCurrentContext();
        
        var hide_prop = true;
        var hide_region = true;
        var select_all = false;

        if (state.type == 'region') {
            hide_region = false;
        } else if (state.type == 'property') {
            hide_prop = false;
        } else {
            hide_prop = false;
            select_all = true;
        }

        this.items = [
            {
                flex  : 1,
                defaults: {
                    padding: 0,
                    margin : 0
                },
                items: [
                    this.propertyCombo = Ext.create('NP.lib.ui.ComboBox', {
                        store            : 'user.Properties',
                        fieldLabel       : this.propertyComboText,
                        width            : 325,
                        labelAlign       : 'right',
                        displayField     : 'property_name',
                        valueField       : 'property_id',
                        value            : parseInt(state.property_id),
                        hidden           : hide_prop,
                        listeners        : {
                            select: function() {
                                // Suspend events briefly to prevent change event on radio buttons from firing
                                var filterTypeComp = that.radioGroup;
                                filterTypeComp.suspendEvents(false);
                                that.propertyRadioBtn.setValue(true);
                                filterTypeComp.resumeEvents();

                                that.triggerChangeEvent();
                            }
                        }
                    }),
                    this.regionCombo = Ext.create('NP.lib.ui.ComboBox', {
                        store            : 'user.Regions',
                        fieldLabel       : this.regionComboText,
                        width            : 325,
                        labelAlign       : 'right',
                        displayField     : 'region_name',
                        valueField       : 'region_id',
                        value            : parseInt(state.region_id),
                        hidden           : hide_region,
                        listeners        : {
                            select: function() {
                                that.triggerChangeEvent();
                            }
                        }
                    })
                ]
            },
            // Right column displays the radio buttons for choosing to see Current Property, Region, or All Properties
            this.radioGroup = Ext.create('Ext.form.RadioGroup', {
                defaults: {
                    xtype: 'radio',
                    style: 'white-space: nowrap;margin-right:12px;'
                },
                listeners: {
                    change: function(field, newValue, oldValue) {
                        var selVal = newValue['contextPickerType' + that.pickerId];
                        if (!(selVal instanceof Object)) {
                            if (selVal == 'property' || selVal == 'all') {
                                var showComp = that.propertyCombo;
                                var hideComp = that.regionCombo;
                            } else if (selVal == 'region') {
                                var showComp = that.regionCombo;
                                var hideComp = that.propertyCombo;
                            }

                            showComp.show();
                            hideComp.hide();

                            that.triggerChangeEvent();
                        }
                    }
                },
                items      : [
                    this.propertyRadioBtn = Ext.create('Ext.form.field.Radio', {
                        boxLabel  : this.currentPropertyRadioText,
                        name      : 'contextPickerType' + this.pickerId, // Dynamic name to avoid errors when using multiple pickers
                        inputValue: 'property',
                        checked   : !hide_prop && !select_all
                    }),
                    this.regionRadioBtn = Ext.create('Ext.form.field.Radio', {
                        boxLabel  : this.regionRadioText,
                        name      : 'contextPickerType' + this.pickerId, // Dynamic name to avoid errors when using multiple pickers
                        inputValue: 'region',
                        checked   : !hide_region
                    }),
                    this.allRadioBtn = Ext.create('Ext.form.field.Radio', {
                        boxLabel  : this.allPropertiesRadioText, 
                        name      : 'contextPickerType' + this.pickerId, // Dynamic name to avoid errors when using multiple pickers
                        inputValue: 'all',
                        checked   : select_all
                    })
                ]
            })
        ];

        // Add custom event that can be listened to by other components
        this.addEvents('change');
        this.addStateEvents('change');

        this.callParent(arguments);
    },

    triggerChangeEvent: function() {
        var context = this.getState();

        NP.Security.setCurrentContext({
            type       : context.type,
            property_id: this.propertyCombo.getValue(),
            region_id  : this.regionCombo.getValue()
        });

        /**
         * @event change
         * Fires whenever a change is made to the context picker, like selecting another item in the combo
         * box or clicking a different radio button.
         * @param {NP.view.shared.ContextPicker} picker   The picker object that fired the event
         * @param {"property"/"region"/"all"}    type     The context type
         * @param {Number}                       selected The value of the item selected in the combo box
         */
        this.fireEvent('change', this, context.type, context.selected);
    },

    /**
     * Returns the state of the Context Picker
     * @return {Object}
     * @return {"property"/"region"/"all"} return.type     The context type
     * @return {String}                    return.selected The value of the item selected in the combo box
     */
    getState: function() {
        var type = this.radioGroup.getValue()['contextPickerType' + this.pickerId];
        var selected = (type == 'region') ? this.regionCombo.getValue() : this.propertyCombo.getValue();

        return { type: type, selected: selected };
    }
});