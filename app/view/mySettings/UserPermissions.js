/**
 * My Settings: User Information : User Permissions
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.mySettings.UserPermissions', {
    extend: 'Ext.ux.form.ItemSelector',
    alias: 'widget.mysettings.userpermissions',
    
    requires: [
        'NP.lib.core.Config'
    ],

    title: 'User Permissions',

    autoScroll: true,

    margin: 8,

    name        : 'user_properties',
    anchor      : '100%',
    store       : 'property.AllProperties',
    displayField: 'property_name',
    valueField  : 'property_id',
    fromTitle   : 'Unassigned ' + NP.lib.core.Config.getSetting('PN.Main.PropertiesLabel'),
    toTitle     : 'Assigned ' + NP.lib.core.Config.getSetting('PN.Main.PropertiesLabel'),
    buttons     : ['add','remove'],
    msgTarget   : 'under'
});