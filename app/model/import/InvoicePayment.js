/**
 * Model for an InvoicePayments entity
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.import.InvoicePayment', {
    extend: 'Ext.data.Model',
        
    fields: [
    	{ name: 'property_id_alt' },
        { name: 'vendor_id_alt' },
        { name: 'invoice_ref' },
        { name: 'invoice_datetm' },
        { name: 'invoice_period' },
        { name: 'invoicepayment_id_alt' },
        { name: 'invoicepayment_datetm' },
        { name: 'invoicepayment_checknum' },
        { name: 'invoicepayment_amount' },
        { name: 'invoicepayment_status' },
        { name: 'integration_package_name' },
        { name: 'validation_status' },
        { name: 'validation_errors' }
    ]
});