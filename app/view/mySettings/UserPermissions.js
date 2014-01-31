/**
 * My Settings: User Information : User Permissions
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.mySettings.UserPermissions', {
    extend: 'NP.view.shared.PropertyAssigner',
    alias: 'widget.mysettings.userpermissions',
    
    requires: [
        'NP.lib.core.Config'
    ],

    // For localization
    title: 'User Permissions',
    
    autoScroll: true,
    margin    : 8,
    hideLabel : false,
    name      : 'properties',
    anchor    : '100%',
    store     : 'property.AllProperties',

    initComponent: function() {
        var propLabel = NP.Config.getSetting('PN.Main.PropertiesLabel');

        this.fromTitle = this.fromTitle + ' ' + propLabel;
        this.toTitle = this.toTitle + ' ' + propLabel;

        this.callParent(arguments);
    }
});