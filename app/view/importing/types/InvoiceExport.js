/**
 * Invoice Export type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.importing.types.InvoiceExport', {
    extend  : 'NP.view.importing.types.AbstractImportType',
    
    fieldName  : 'file_upload_invoice_export',

     // For localization
    tabTitle    : 'Invoice Export',
    entityName  : 'Invoice Export',
    sectionName : 'Invoice Export',
    instructions: null,
    
    colTextPropertyCode : 'Property Code',
    colTextInvoiceNumber : 'Invoice Number',
    colTextVendorCode : 'Vendor Code',
    colTextInvoiceDate : 'Invoice Date',
    colTextInvoicePeriod : 'Invoice Period',
    colTextDueDate : 'Due Date',
    colTextInvoiceCreatedDate : 'Invoice Created Date',
    colTextInvoiceCustomField1 : 'Invoice Custom Field1',
    colTextInvoiceCustomField2 : 'Invoice Custom Field2',
    colTextInvoiceCustomField3 : 'Invoice Custom Field3',
    colTextInvoiceCustomField4 : 'Invoice Custom Field4',
    colTextInvoiceCustomField5 : 'Invoice Custom Field5',
    colTextInvoiceCustomField6 : 'Invoice Custom Field6',
    colTextInvoiceLineNumber : 'Invoice Line Number',
    colTextAccountNumber : 'Account Number',
    colTextDepartmentCode : 'Department Code',
    colTextInvoiceItemQuantity : 'Invoice Item Quantity',
    colTextInvoiceItemUnitPrice : 'Invoice Item Unit Price',
    colTextInvoiceItemAmount : 'Invoice Item Amount',
    colTextInvoiceItemSalesTax : 'Invoice Item {Sales Tax}',
    colTextInvoiceItemShipping : 'Invoice Item Shipping',
    colTextInvoiceItemDescription : 'Invoice Item Description',
    colTextInvoiceItemContract : 'Invoice Item Contract',
    colTextInvoiceItemJobCode : 'Invoice Item Job Code',
    colTextInvoiceItemCostCode : 'Invoice Item Cost Code',
    colTextInvoiceItemCustomField1 : 'Invoice Item Custom Field1',
    colTextInvoiceItemCustomField2 : 'Invoice Item Custom Field2',
    colTextInvoiceItemCustomField3 : 'Invoice Item Custom Field3',
    colTextInvoiceItemCustomField4 : 'Invoice Item Custom Field4',
    colTextInvoiceItemCustomField5 : 'Invoice Item Custom Field5',
    colTextInvoiceItemCustomField6 : 'Invoice Item Custom Field6',
    getGrid: function() {
        return {
            forceFit: true,
            columns: [
                { text : this.colTextPropertyCode, dataIndex: 'PropertyCode', flex: 1,
                    renderer : function(val, meta, rec) {
                                    var value = val.split(';');
                                    if (value[1]) {
                                        meta.tdAttr = 'data-qtip="' + value[1] + '"';
                                        return "<span style='color:red;font-weight:bold' >" + value[0] + "</span>";
                                    } else {
                                        return val;
                                    }
                                }
                },
                { text: this.colTextInvoiceNumber, dataIndex: 'InvoiceNumber', flex: 1 },
                { text: this.colTextVendorCode, dataIndex: 'VendorCode', flex: 1 },
                { text: this.colTextInvoiceDate, dataIndex: 'InvoiceDate', flex: 1 },
                { text: this.colTextInvoicePeriod, dataIndex: 'InvoicePeriod', flex: 1 },
                { text: this.colTextDueDate, dataIndex: 'DueDate', flex: 1 },
                { text: this.colTextInvoiceCreatedDate, dataIndex: 'InvoiceCreatedDate', flex: 1 },
                { text: this.colTextInvoiceCustomField1, dataIndex: 'InvoiceCustomField1', flex: 1 },
                { text: this.colTextInvoiceCustomField2, dataIndex: 'InvoiceCustomField2', flex: 1 },
                { text: this.colTextInvoiceCustomField3, dataIndex: 'InvoiceCustomField3', flex: 1 },
                { text: this.colTextInvoiceCustomField4, dataIndex: 'InvoiceCustomField4', flex: 1 },
                { text: this.colTextInvoiceCustomField5, dataIndex: 'InvoiceCustomField5', flex: 1 },
                { text: this.colTextInvoiceCustomField6, dataIndex: 'InvoiceCustomField6', flex: 1 },
                { text: this.colTextInvoiceLineNumber, dataIndex: 'InvoiceLineNumber', flex: 1 },
                { text: this.colTextAccountNumber, dataIndex: 'AccountNumber', flex: 1 },
                { text: this.colTextDepartmentCode, dataIndex: 'DepartmentCode', flex: 1 },
                { text: this.colTextInvoiceItemQuantity, dataIndex: 'InvoiceItemQuantity', flex: 1 },
                { text: this.colTextInvoiceItemUnitPrice, dataIndex: 'InvoiceItemUnitPrice', flex: 1 },
                { text: this.colTextInvoiceItemAmount, dataIndex: 'InvoiceItemAmount', flex: 1 },
                { text: this.colTextInvoiceItemSalesTax, dataIndex: 'InvoiceItemSalesTax', flex: 1 },
                { text: this.colTextInvoiceItemShipping, dataIndex: 'InvoiceItemShipping', flex: 1 },
                { text: this.colTextInvoiceItemDescription, dataIndex: 'InvoiceItemDescription', flex: 1 },
                { text: this.colTextInvoiceItemContract, dataIndex: 'InvoiceItemContract', flex: 1 },
                { text: this.colTextInvoiceItemJobCode, dataIndex: 'InvoiceItemJobCode', flex: 1 },
                { text: this.colTextInvoiceItemCostCode, dataIndex: 'InvoiceItemCostCode', flex: 1 },
                { text: this.colTextInvoiceItemCustomField1, dataIndex: 'InvoiceItemCustomField1', flex: 1 },
                { text: this.colTextInvoiceItemCustomField2, dataIndex: 'InvoiceItemCustomField2', flex: 1 },
                { text: this.colTextInvoiceItemCustomField3, dataIndex: 'InvoiceItemCustomField3', flex: 1 },
                { text: this.colTextInvoiceItemCustomField4, dataIndex: 'InvoiceItemCustomField4', flex: 1 },
                { text: this.colTextInvoiceItemCustomField5, dataIndex: 'InvoiceItemCustomField5', flex: 1 },
                { text: this.colTextInvoiceItemCustomField6, dataIndex: 'InvoiceItemCustomField6', flex: 1 }
            ]
        };
    }

});