/**
 * System Setup section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.systemSetup.Main', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.systemsetup.main',
    
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
        'NP.view.systemSetup.Overview',
        'NP.view.systemSetup.Settings',
        'NP.view.systemSetup.WorkflowRules',
        'NP.view.systemSetup.PasswordConfiguration',
        'NP.view.systemSetup.CustomFields',
        'NP.view.systemSetup.Picklists',
        'NP.view.systemSetup.DefaultSplits',
        'NP.view.systemSetup.LoginPage',
        'NP.view.systemSetup.POPrintSettings',
        'NP.view.shared.button.UserManager',
        'NP.view.shared.button.PropertySetup'
    ],

    title: 'System Setup',
    autoScroll: true,
    
    initComponent: function() {
        this.tbar = [
            {
                xtype: 'shared.button.usermanager',
                itemId: 'backToUserManagerBtn'
            },
            {
                xtype: 'shared.button.propertysetup',
                itemId: 'backToPropertySetupBtn'
            }
        ];

        this.items = [
            {
                xtype: 'systemsetup.overview'
            },{
                xtype: 'systemsetup.settings'
            }
        ];
        
        if (NP.Security.hasPermission(1041)) {
            this.items.push({
                xtype: 'systemsetup.workflowrules'
            });
        }
        
        if (NP.Security.hasPermission(6085)) {
            this.items.push({
                xtype: 'systemsetup.passwordconfiguration'
            });
        }
        
        if (NP.Security.hasPermission(6086)) {
            this.items.push({
                xtype: 'systemsetup.customfields'
            });
        }
        
        if (NP.Security.hasPermission(6087)) {
            this.items.push({
                xtype: 'systemsetup.picklists'
            });
        }
        
        if (NP.Security.hasPermission(6088)) {
            this.items.push({
                xtype: 'systemsetup.defaultsplits'
            });
        }
        
        this.items.push({
            xtype: 'systemsetup.loginpage'
        });

        this.items.push({
            xtype: 'systemsetup.poprintsettings'
        });

        this.callParent(arguments);
    }