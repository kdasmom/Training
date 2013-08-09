/**
 * Invoice Export type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.InvoiceExport', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
    fieldName  : 'file_upload_invoice_export',

    // For localization
    tabTitle : 'Invoice Export',
    entityName : '',
    sectionName: '',

    getGrid: function() {
        
    }

});