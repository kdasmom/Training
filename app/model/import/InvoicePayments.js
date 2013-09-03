/**
 * Model for an InvoicePayments entity
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.import.InvoicePayments', {
    extend: 'Ext.data.Model',
        
    fields: [
    	{ name: 'BusinessUnit' },
        { name: 'VendorID' },
        { name: 'InvoiceID' },
        { name: 'InvoiceDate' },
        { name: 'InvoicePeriod' },
        { name: 'PaymentID' },
        { name: 'PaymentDate' },
        { name: 'CheckNumber' },
        { name: 'PaymentAmount' },
        { name: 'PaymentStatus' },
        { name: 'IntegrationPackage' },
        { name: 'validation_status' }
    ]
});