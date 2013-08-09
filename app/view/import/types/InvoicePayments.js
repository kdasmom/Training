/**
 * Invoice Payments type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.InvoicePayments', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
    fieldName  : 'file_upload_invoice_payments',

    // For localization
    tabTitle : 'Payments',
    entityName : '',
    sectionName: '',

    getGrid: function() {
        
    }

});