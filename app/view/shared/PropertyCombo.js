/**
 * Generic combo for properties
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.PropertyCombo', {
    extend: 'NP.lib.ui.ComboBox',
    alias: 'widget.shared.propertycombo',
    
    requires: ['NP.lib.core.Config'],

    fieldLabel: NP.Config.getPropertyLabel(),

    name               : 'property_id',
    displayField       : 'property_name',
    valueField         : 'property_id',
    tpl                : '<tpl for=".">' +
                            '<li class="x-boundlist-item" role="option">{property_name}' +
                                '<tpl if="property_status == -1">' +
                                    ' (On Hold)' +
                                '<tpl elseif="property_status == 0">' +
                                    ' (Inactive)' +
                                '</tpl>' +
                            '</li>' +
                        '</tpl>',
    initComponent: function() {
        if (!this.store) {
            this.store = Ext.create('NP.store.property.Properties', {
                           service : 'PropertyService',
                           action  : 'getAll'
                        });
        }

        this.callParent(arguments);
    }
});