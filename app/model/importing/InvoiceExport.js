/**
 * Model for an InvoiceExport entity
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.model.importing.InvoiceExport', {
    extend: 'Ext.data.Model',
        
    fields: [
    	{ name: 'PropertyCode' },
        { name: 'InvoiceNumber' },
        { name: 'VendorCode' },
        { name: 'InvoiceDate' },
        { name: 'InvoicePeriod' },
        { name: 'DueDate'},
        { name: 'InvoiceCreatedDate' },
        { name: 'InvoiceCustomField1' },
        { name: 'InvoiceCustomField2' },
        { name: 'InvoiceCustomField3' },
        { name: 'InvoiceCustomField4' },
        { name: 'InvoiceCustomField5' },
        { name: 'InvoiceCustomField6' },
        { name: 'InvoiceLineNumber' },
        { name: 'AccountNumber' },
        { name: 'DepartmentCode' },
        { name: 'InvoiceItemQuantity' },
        { name: 'InvoiceItemUnitPrice' },
        { name: 'InvoiceItemAmount' },
        { name: 'InvoiceItemSalesTax' },
        { name: 'InvoiceItemShipping' },
        { name: 'InvoiceItemDescription' },
        { name: 'InvoiceItemContract' },
        { name: 'InvoiceItemJobCode' },
        { name: 'InvoiceItemCostCode' },
        { name: 'InvoiceItemCustomField1' },
        { name: 'InvoiceItemCustomField2' },
        { name: 'InvoiceItemCustomField3' },
        { name: 'InvoiceItemCustomField4' },
        { name: 'InvoiceItemCustomField5' },
        { name: 'InvoiceItemCustomField6' },
        { name: 'validation_status' }
    ]
});