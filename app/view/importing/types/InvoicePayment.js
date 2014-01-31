/**
 * Invoice Payments type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.importing.types.InvoicePayment', {
    extend  : 'NP.view.importing.types.AbstractImportType',
    
    fieldName  : 'file_upload_invoice_payment',

    // For localization
    tabTitle    : 'Payments',
    entityName  : 'Invoice Payments',
    sectionName : 'Invoice Payments',
    instructions: null,
    
    colTextBusinessUnit      : 'Business Unit',
    colTextVendorID          : 'Vendor ID',
    colTextInvoiceID         : 'Invoice ID',
    colTextInvoiceDate       : 'Invoice Date',
    colTextInvoicePeriod     : 'Invoice Period',
    colTextPaymentID         : 'Payment ID',
    colTextPaymentDate       : 'Payment Date',
    colTextCheckNumber       : 'Check Number',
    colTextPaymentAmount     : 'Payment Amount',
    colTextPaymentStatus     : 'Payment Status',
    colTextIntegrationPackage: 'Integration Package',

    getGrid: function() {
        return {
            columns: {
                items: [
                    { text: this.colTextBusinessUnit, dataIndex: 'property_id_alt' },
                    { text: this.colTextVendorID, dataIndex: 'vendor_id_alt' },
                    { text: this.colTextInvoiceID, dataIndex: 'invoice_ref' },
                    { text: this.colTextInvoiceDate, dataIndex: 'invoice_datetm' },
                    { text: this.colTextInvoicePeriod, dataIndex: 'invoice_period' },
                    { text: this.colTextPaymentID, dataIndex: 'invoicepayment_id_alt' },
                    { text: this.colTextPaymentDate, dataIndex: 'invoicepayment_datetm' },
                    { text: this.colTextCheckNumber, dataIndex: 'invoicepayment_checknum' },
                    { text: this.colTextPaymentAmount, dataIndex: 'invoicepayment_amount' },
                    { text: this.colTextPaymentStatus, dataIndex: 'invoicepayment_status' },
                    { text : this.colTextIntegrationPackage, dataIndex: 'integration_package_name' }
                ]
            }
        };
    }

});