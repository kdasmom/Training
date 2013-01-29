Ext.define('NP.view.shared.ContextPicker', function () {
	return {
        extend: 'Ext.panel.Panel',
        alias: 'widget.shared.contextpicker',
        
        requires: ['NP.core.Config','NP.core.Security'],

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

        items: [],
        initComponent: function() {
            var that = this;

            // Middle column displays the region and property combo boxes (only one active at a time)
            var default_prop = NP.core.Security.getUser().get('userprofile_preferred_property');
            var default_region = NP.core.Security.getUser().get('userprofile_preferred_region');
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

            this.items.push({
                flex  : 1,
                defaults: {
                    padding: 0,
                    margin : 0
                },
                items: [{
                    xtype            : 'customcombo',
                    itemId           : '__contextPickerUserPropertiesCombo',
                    store            : 'UserProperties',
                    fieldLabel       : NP.core.Config.getSetting('PN.main.PropertyLabel'),
                    labelAlign       : 'right',
                    selectFirstRecord: true,
                    displayField     : 'property_name',
                    valueField       : 'property_id',
                    value            : default_prop,
                    hidden           : hide_prop,
                    listeners        : {
                        select: function() {
                            // Suspend events briefly to prevent change event on radio buttons from firing
                            var filterTypeComp = that.queryById('__contextPickerPropertyFilterType');
                            filterTypeComp.suspendEvents(false);
                            filterTypeComp.queryById('__currentPropFilterType').setValue(true);
                            filterTypeComp.resumeEvents();

                            var state = that.getState();
                            that.fireEvent('change', that, state.propertyFilterType, state.selected);
                        }
                    }
                },{
                    xtype            : 'customcombo',
                    itemId           : '__contextPickerUserRegionsCombo',
                    store            : 'UserRegions',
                    fieldLabel       : NP.core.Config.getSetting('PN.Main.RegionLabel'),
                    labelAlign       : 'right',
                    selectFirstRecord: true,
                    displayField     : 'region_name',
                    valueField       : 'region_id',
                    value            : default_region,
                    hidden           : hide_region,
                    listeners        : {
                        select: function() {
                            var state = that.getState();
                            that.fireEvent('change', that, state.propertyFilterType, state.selected);
                        }
                    }
                }]
            });

            // Left column displays the radio buttons for choosing to see Current Property, Region, or All Properties
            this.items.push({
                xtype      : 'checkboxgroup',
                itemId     : '__contextPickerPropertyFilterType', 
                defaults: {
                    xtype: 'radio',
                    style: 'white-space: nowrap;margin-right:12px;'
                },
                listeners: {
                    change: function(field, newValue, oldValue) {
                        var selVal = newValue.propertyFilterType;
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

                            var state = that.getState();
                            that.fireEvent('change', that, state.propertyFilterType, state.selected);
                        }
                    }
                },
                items      : [
                    {
                        boxLabel  : 'Current ' + NP.core.Config.getSetting('PN.main.PropertyLabel'),
                        itemId    : '__currentPropFilterType',
                        name      : 'propertyFilterType',
                        inputValue: 'property',
                        checked   : !hide_prop && !select_all
                    },
                    {
                        boxLabel  : NP.core.Config.getSetting('PN.Main.RegionLabel'), 
                        name      : 'propertyFilterType', 
                        inputValue: 'region',
                        checked   : !hide_region
                    },
                    {
                        boxLabel  : 'All ' + NP.core.Config.getSetting('PN.Main.PropertiesLabel'), 
                        name      : 'propertyFilterType', 
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
            var propertyFilterType = this.queryById('__contextPickerPropertyFilterType').getValue().propertyFilterType;
            var selected;
            if (propertyFilterType == 'region') {
                var combo = this.queryById('__contextPickerUserRegionsCombo');
                selected = combo.getValue();
            } else if (propertyFilterType == 'property') {
                var combo = this.queryById('__contextPickerUserPropertiesCombo');
                selected = combo.getValue();
            } else if (propertyFilterType == 'all') {
                var combo = this.queryById('__contextPickerUserRegionsCombo');
                selected = null;
            }
            return { propertyFilterType: propertyFilterType, selected: selected };
        }
    }
});