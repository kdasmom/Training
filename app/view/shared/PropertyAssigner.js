/**
 * Generic component to assign properties
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.PropertyAssigner', {
    extend: 'NP.lib.ui.Assigner',
    alias: 'widget.shared.propertyassigner',
    
    requires: ['NP.lib.core.Config'],

    fieldLabel: 'Properties',

    name        : 'properties',
    displayField: 'property_name',
    valueField  : 'property_id',
    tpl         : '<tpl for=".">' +
                    '<div class="x-boundlist-item">{property_name}' +
                        '<tpl if="property_status == -1">' +
                            ' (On Hold)' +
                        '<tpl elseif="property_status == 0">' +
                            ' (Inactive)' +
                        '</tpl>' +
                    '</div>' +
                '</tpl>',
    fromTitle   : 'Unassigned',
    toTitle     : 'Assigned',
    buttons     : ['add','remove'],
    msgTarget   : 'under',

    initComponent: function() {
        if (!this.store) {
            this.store = Ext.create('NP.store.property.Properties', {
                           service : 'PropertyService',
                           action  : 'getAll',
                           autoLoad: true
                        });
        }

        this.callParent(arguments);
    }
}); 
