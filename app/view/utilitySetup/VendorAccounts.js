/**
 * @author Baranov A.V.
 * @date 9/25/13
 */

Ext.define('NP.view.utilitySetup.VendorsAccounts', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.utilitysetup.vendorsaccounts',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
        'NP.view.utilitySetup.AccountsGrid'
    ],

    // For localization
    title : 'Utility Accounts',

    layout: 'fit',

    items: [
        {
            xtype: 'utilitysetup.accountsgrid'
        }
    ]
});