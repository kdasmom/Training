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
    
    stateful: true,
    stateId: 'global_context_picker',

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

        if (default_prop == 0 || default_prop == null) {
            default_prop = Ext.StoreManager.get('user.Properties').getAt(0).get('property_id');
        }

        if (default_region == 0 || default_region == null) {
            default_region = Ext.StoreManager.get('user.Regions').getAt(0).get('region_id');
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
                displayField     : 'property_name',
                valueField       : 'property_id',
                value            : default_prop,
                hidden           : hide_prop,
                listeners        : {
                    select: function() {
                        // Suspend events briefly to prevent change event on radio buttons from firing
                        var filterTypeComp = that.queryById('__contextPickerType');
                        filterTypeComp.suspendEvents(false);
                        filterTypeComp.queryById('__currentPropFilterType').setValue(true);
                        filterTypeComp.resumeEvents();

                        that.triggerChangeEvent();
                    }
                }
            },{
                xtype            : 'customcombo',
                itemId           : '__contextPickerUserRegionsCombo',
                store            : 'user.Regions',
                fieldLabel       : this.regionComboText,
                labelAlign       : 'right',
                displayField     : 'region_name',
                valueField       : 'region_id',
                value            : default_region,
                hidden           : hide_region,
                listeners        : {
                    select: function() {
                        that.triggerChangeEvent();
                    }
                }
            }]
        }];
        
        // Left column displays the radio buttons for choosing to see Current Property, Region, or All Properties
        this.items.push({
            xtype      : 'checkboxgroup',
            itemId     : '__contextPickerType', 
            defaults: {
                xtype: 'radio',
                style: 'white-space: nowrap;margin-right:12px;'
            },
            listeners: {
                change: function(field, newValue, oldValue) {
                    var selVal = newValue.contextPickerType;
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

                        that.triggerChangeEvent();
                    }
                }
            },
            items      : [
                {
                    boxLabel  : this.currentPropertyRadioText,
                    itemId    : '__currentPropFilterType',
                    name      : 'contextPickerType',
                    inputValue: 'property',
                    checked   : !hide_prop && !select_all
                },
                {
                    boxLabel  : this.regionRadioText,
                    itemId    : '__regionFilterType',
                    name      : 'contextPickerType', 
                    inputValue: 'region',
                    checked   : !hide_region
                },
                {
                    boxLabel  : this.allPropertiesRadioText, 
                    itemId    : '__allFilterType',
                    name      : 'contextPickerType', 
                    inputValue: 'all',
                    checked   : select_all
                }
            ]
        });

        // Add custom event that can be listened to by other components
        this.addEvents('change');
        this.addStateEvents('change');

        this.callParent(arguments);
    },

    triggerChangeEvent: function() {
        var state = this.getState();
        /**
         * @event change
         * Fires whenever a change is made to the context picker, like selecting another item in the combo
         * box or clicking a different radio button.
         * @param {NP.view.shared.ContextPicker} picker   The picker object that fired the event
         * @param {"property"/"region"/"all"}    type     The context type
         * @param {Number}                       selected The value of the item selected in the combo box
         */
        this.fireEvent('change', this, state.type, state.selected);
    },

    /**
     * Returns the state of the Context Picker
     * @return {Object}
     * @return {"property"/"region"/"all"} return.type     The context type
     * @return {String}                    return.selected The value of the item selected in the combo box
     */
    getState: function() {
        var contextPickerType = this.queryById('__contextPickerType').getValue().contextPickerType;
        var selected;
        if (contextPickerType == 'region') {
            var combo = this.queryById('__contextPickerUserRegionsCombo');
            selected = combo.getValue();
        } else if (contextPickerType == 'property') {
            var combo = this.queryById('__contextPickerUserPropertiesCombo');
            selected = combo.getValue();
        } else if (contextPickerType == 'all') {
            var combo = this.queryById('__contextPickerUserPropertiesCombo');
            selected = combo.getValue();
        }
        return { type: contextPickerType, selected: selected };
    },

    applyState: function(state) {
        if (state.selected != null) {
            var filterType = this.queryById('__contextPickerType');
            var propCombo = this.queryById('__contextPickerUserPropertiesCombo');
            var regionCombo = this.queryById('__contextPickerUserRegionsCombo');

            // Suspend events on the combos and radio buttons
            filterType.suspendEvents(false);
            propCombo.suspendEvents(false);
            regionCombo.suspendEvents(false);

            if (state.type == 'property') {
                propCombo.show();
                regionCombo.hide();
                this.queryById('__currentPropFilterType').setValue(true);
                this.queryById('__contextPickerUserPropertiesCombo').setValue(state.selected);
            } else if (state.type == 'region') {
                regionCombo.show();
                propCombo.hide();
                this.queryById('__regionFilterType').setValue(true);
                this.queryById('__contextPickerUserRegionsCombo').setValue(state.selected);
            } else if (state.type == 'all') {
                regionCombo.hide();
                this.queryById('__allFilterType').setValue(true);
                this.queryById('__contextPickerUserPropertiesCombo').setValue(state.selected);
            }

            // Resume events on the combos and radio buttons
            filterType.resumeEvents();
            propCombo.resumeEvents();
            regionCombo.resumeEvents();
        }
    }
});