/**
 * Catalog Maintenance add/edit form
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalogMaintenance.CatalogFormProperties', {
    extend: 'Ext.ux.form.ItemSelector',
    alias: 'widget.catalogmaintenance.catalogformproperties',
    
    requires: ['NP.lib.core.Config'],

    name        : 'vc_properties',
    hideLabel   : true, 
    store       : 'user.Properties',
    displayField: 'property_name',
    valueField  : 'property_id',
    fromTitle   : 'Unassigned',
    toTitle     : 'Assigned',
    buttons     : ['add','remove'],
    msgTarget   : 'under',

    initComponent: function() {
        var that = this;
        
        this.title = NP.lib.core.Config.getSetting('PN.Main.PropertyLabel') + ' Assignment',

        this.callParent(arguments);
    }
});