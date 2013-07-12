/**
 * Property Setup > Properties section > Form
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.PropertiesForm', {
    extend: 'NP.lib.ui.BoundForm',
    alias: 'widget.property.propertiesform',
    
    requires: [
    	'NP.lib.core.Config',
        'NP.lib.core.Security',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Save',
        'NP.view.shared.UserAssigner',
        'NP.lib.ui.VerticalTabPanel',
        'NP.view.property.PropertiesFormInfo',
        'NP.view.property.PropertiesFormAccounting',
        'NP.view.property.PropertiesFormGl',
        'NP.view.property.PropertiesFormCal',
        'NP.view.property.PropertiesFormUnits',
        'NP.view.property.PropertiesFormUnitMeasurements',
        'NP.view.property.PropertiesFormUserReport'
    ],

    autoScroll: true,

    layout: 'fit',

    initComponent: function() {
        var bar = [
            { xtype: 'shared.button.cancel', itemId: 'propertyCancelBtn' },
            { xtype: 'shared.button.save', itemId: 'propertySaveBtn' }
        ];
        this.tbar = bar;
        this.bbar = bar;

        var tabs = [
            { xtype: 'property.propertiesforminfo', customFieldData: this.customFieldData },
            { xtype: 'property.propertiesformaccounting' }
        ];
        if (NP.Config.getSetting('CP.PROPERTYGLACCOUNT_USE', 0) == 1 && NP.Security.hasPermission(12)) {
            tabs.push({ xtype: 'property.propertiesformgl', hidden: true });
        }
        if (NP.Security.hasPermission(1042)) {
            tabs.push({ xtype: 'property.propertiesformcal', hidden: true });
        }

        if (NP.Config.getSetting('PN.InvoiceOptions.AllowUnitAttach') == '1') {
            tabs.push({ xtype: 'property.propertiesformunits', hidden: true });
            if (NP.Config.getSetting('VC_isOn') == '1') {
                tabs.push({ xtype: 'property.propertiesformunitmeasurements', hidden: true });
            }
        }

        tabs.push(
            {
                xtype     : 'shared.userassigner',
                title     : 'User Assignment',
                hideLabel : true,
                name      : 'property_users',
                fromTitle : 'Unassigned Users',
                toTitle   : 'Assigned Users',
                autoScroll: true,
                margin    : 8,
                hidden    : true
            },
            { xtype: 'property.propertiesformuserreport', hidden: true }
        );

        this.items = [{
            xtype   : 'verticaltabpanel',
            border  : false,
            defaults: {
                padding: 8
            },
            items    : tabs
        }];

        this.callParent(arguments);
    }
});