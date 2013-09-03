/**
 * Invoice Payments type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.InvoicePayments', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
    fieldName  : 'file_upload_invoice_payments',

    // For localization
    tabTitle            : 'Payments',
    entityName          : 'Invoice Payments',
    sectionName         : 'Invoice Payments',
    colTextBusinessUnit: 'Business Unit',
    colTextVendorID: 'Vendor ID',
    colTextInvoiceID: 'Invoice ID',
    colTextInvoiceDate: 'Invoice Date',
    colTextInvoicePeriod: 'Invoice Period',
    colTextPaymentID: 'Payment ID',
    colTextPaymentDate: 'Payment Date',
    colTextCheckNumber: 'Check Number',
    colTextPaymentAmount: 'Payment Amount',
    colTextPaymentStatus: 'Payment Status',
    colTextIntegrationPackage: 'Integration Package',
    getGrid: function() {
        return {
            forceFit: true,
            columns: [
                { text: this.colTextBusinessUnit, dataIndex: 'BusinessUnit', flex: 1,
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
                { text: this.colTextVendorID, dataIndex: 'VendorID', flex: 1,
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
                { text: this.colTextInvoiceID, dataIndex: 'InvoiceID', flex: 1,
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
                { text: this.colTextInvoiceDate, dataIndex: 'InvoiceDate', flex: 1 },
                { text: this.colTextInvoicePeriod, dataIndex: 'InvoicePeriod', flex: 1 },
                { text: this.colTextPaymentID, dataIndex: 'PaymentID', flex: 1,
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
                { text: this.colTextPaymentDate, dataIndex: 'PaymentDate', flex: 1 },
                { text: this.colTextCheckNumber, dataIndex: 'CheckNumber', flex: 1 },
                { text: this.colTextPaymentAmount, dataIndex: 'PaymentAmount', flex: 1 },
                { text: this.colTextPaymentStatus, dataIndex: 'PaymentStatus', flex: 1,
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
                { text : this.colTextIntegrationPackage, dataIndex: 'IntegrationPackage', flex: 1,
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
            ]
        };
    }

});