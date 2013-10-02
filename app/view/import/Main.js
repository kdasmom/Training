/**
 * Import/Export Utility section
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.import.Main', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.import.main',
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
        'NP.view.import.Overview',
        'NP.view.import.ImportSection'
    ],
    // For localization

    title: 'Import/Export Utility',
    glTabText: 'GL',
    vendorTabText: 'Vendor',
    invoiceTabText: 'Invoice',
    userTabText: 'User',
    customFieldTabText: 'Custom Field',
    splitsTabText: 'Splits',
    initComponent: function() {

        this.items = [
            {xtype: 'import.overview', itemId: 'overviewImportTab'},
            {xtype: 'import.importsection', itemId: 'glImportTab', title: this.glTabText, tabs: ['GLCategory', 'GLCode', 'GLBudget', 'GLActual']},
            {xtype: 'import.importsection', itemId: 'propertyImportTab', title: NP.Config.getPropertyLabel(), tabs: ['Property', 'PropertyGL', 'Unit', 'UnitType']},
            {xtype: 'import.importsection', itemId: 'vendorImportTab', title: this.vendorTabText, tabs: ['Vendor', 'VendorGL', 'VendorFavorite', 'VendorInsurance', 'VendorUtility']},
            {xtype: 'import.importsection', itemId: 'invoiceImportTab', title: this.invoiceTabText, tabs: ['InvoiceExport', 'InvoicePayment']},
            {xtype: 'import.importsection', itemId: 'userImportTab', title: this.userTabText, tabs: ['User', 'UserProperty']},
            {xtype: 'import.importsection', itemId: 'customFieldImportTab', title: this.customFieldTabText, tabs: ['CustomFieldHeader', 'CustomFieldLine']},
            {xtype: 'import.importsection', itemId: 'splitImportTab', title: this.splitsTabText, tabs: ['Split']}

        ];
        this.callParent(arguments);
    }
});
