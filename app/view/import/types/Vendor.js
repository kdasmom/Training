/**
 * Vendor import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.Vendor', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
    fieldName  : 'file_upload_vendor',

    // For localization
    tabTitle : 'Vendor',
    entityName : 'Vendor',
    sectionName: 'Vendor Setup',

    renderClosure: function(val, meta, rec) {
        if(!val) {
            console.error('Arguments', arguments);
            return;
        }
        var value = val.split(';');
        if (value[1]) {
            meta.tdAttr = 'data-qtip="' + value[1] + '"';
            return "<span style='color:red;font-weight:bold' >" + value[0] + "</span>";
        } else {
            return val;
        }
    },

    getGrid: function() {
        return {
            columns: [
                {
                    text     : 'Vendor ID',
                    dataIndex: 'VendorID',
                    flex     : 1,
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

                {
                    text     : 'Name',
                    dataIndex: 'Name',
                    flex     : 1
                },

                {
                    text     : 'Federal ID',
                    dataIndex: 'FederalID',
                    flex     : 1
                },

                {
                    text     : 'Tax Report Name',
                    dataIndex: 'TaxReportName',
                    flex     : 1
                },

                {
                    text     : 'Status',
                    dataIndex: 'Status',
                    flex     : 1
                },

                {
                    text     : 'Vendor Type',
                    dataIndex: 'VendorType',
                    flex     : 1
                },

                {
                    text     : 'Pay Priority',
                    dataIndex: 'PayPriority',
                    flex     : 1
                },

                {
                    text     : 'Created Date',
                    dataIndex: 'CreatedDate',
                    flex     : 1
                },

                {
                    text     : 'Last Update Date',
                    dataIndex: 'LastUpdateDate',
                    flex     : 1
                },

                {
                    text     : '1099 Reportable ?',
                    dataIndex: '1099Reportable?',
                    flex     : 1
                },

                {
                    text     : 'Term Date Basis',
                    dataIndex: 'TermDateBasis',
                    flex     : 1
                },

                {
                    text     : 'Pay Date Basis',
                    dataIndex: 'PayDateBasis',
                    flex     : 1
                },

                {
                    text     : 'Default GL code',
                    dataIndex: 'DefaultGLcode',
                    flex     : 1
                },

                {
                    text     : 'Phone',
                    dataIndex: 'Phone',
                    flex     : 1
                },

                {
                    text     : 'Fax',
                    dataIndex: 'Fax',
                    flex     : 1
                },

                {
                    text     : 'Address 1',
                    dataIndex: 'Address1',
                    flex     : 1
                },

                {
                    text     : 'Address 2',
                    dataIndex: 'Address2',
                    flex     : 1
                },

                {
                    text     : 'City',
                    dataIndex: 'City',
                    flex     : 1
                },

                {
                    text     : 'State',
                    dataIndex: 'State',
                    flex     : 1
                },

                {
                    text     : 'Zip Code',
                    dataIndex: 'ZipCode',
                    flex     : 1
                },

                {
                    text     : 'Contact Last Name',
                    dataIndex: 'ContactLastName',
                    flex     : 1
                },

                {
                    text     : 'Contact First Name',
                    dataIndex: 'ContactFirstName',
                    flex     : 1
                },

                {
                    text     : 'IntegrationPackage',
                    dataIndex: 'IntegrationPackage',
                    flex     : 1,
                    renderer : function(val, meta, rec) {
                        var value = val.split(';');
                        if (value[1]) {
                            meta.tdAttr = 'data-qtip="' + value[1] + '"';
                            return "<span style='color:red;font-weight:bold' >" + value[0] + "</span>";
                        } else {
                            return val;
                        }

                    }
                 
                }

            ]
        }
    }

});
