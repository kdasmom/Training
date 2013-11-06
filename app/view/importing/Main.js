/**
 * Import/Export Utility section
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.importing.Main', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.importing.main',
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
        'NP.view.importing.Overview',
        'NP.view.importing.ImportSection'
    ],
    
    // For localization
    title             : 'Import/Export Utility',
    glTabText         : 'GL',
    vendorTabText     : 'Vendor',
    invoiceTabText    : 'Invoice',
    userTabText       : 'User',
    customFieldTabText: 'Custom Field',
    splitsTabText     : 'Splits',

    initComponent: function() {

        this.items = [
            {xtype: 'importing.overview', itemId: 'overviewImportTab'},
            {xtype: 'importing.importsection', itemId: 'glImportTab', title: this.glTabText, tabs: ['GLCategory', 'GLCode', 'GLBudget', 'GLActual']},
            {xtype: 'importing.importsection', itemId: 'propertyImportTab', title: NP.Config.getPropertyLabel(), tabs: ['Property', 'PropertyGL', 'Unit', 'UnitType']},
            {xtype: 'importing.importsection', itemId: 'vendorImportTab', title: this.vendorTabText, tabs: ['Vendor', 'VendorGL', 'VendorFavorite', 'VendorInsurance', 'VendorUtility']},
            {xtype: 'importing.importsection', itemId: 'invoiceImportTab', title: this.invoiceTabText, tabs: ['InvoiceExport', 'InvoicePayment']},
            {xtype: 'importing.importsection', itemId: 'userImportTab', title: this.userTabText, tabs: ['User', 'UserProperty']},
            {xtype: 'importing.importsection', itemId: 'customFieldImportTab', title: this.customFieldTabText, tabs: ['CustomFieldHeader', 'CustomFieldLine']},
            {xtype: 'importing.importsection', itemId: 'splitImportTab', title: this.splitsTabText, tabs: ['Split']}

        ];
        this.callParent(arguments);
    }
});
