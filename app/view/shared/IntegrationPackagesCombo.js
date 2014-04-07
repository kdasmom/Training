/**
 * Created by Andrey Baranov on 07.04.2014.
 */
Ext.define('NP.view.shared.IntegrationPackagesCombo', {
    extend: 'NP.lib.ui.ComboBox',
    alias: 'widget.shared.integrationpackagescombo',

    requires: ['NP.model.system.IntegrationPackage'],

    fieldLabel: 'Integration Package',

    name                : 'integration_package_id',
    displayField        : 'integration_package_name',
    valueField          : 'integration_package_id',
    width               : 400,
    storeAutoLoad       : false,

    initComponent: function() {
        var me = this;

        if (!this.store) {
            this.store = Ext.create('NP.store.system.IntegrationPackages', {
                service : 'ConfigService',
                action  : 'getIntegrationPackages',
                autoLoad: me.storeAutoLoad
            });
        }

        this.callParent(arguments);
    }
});