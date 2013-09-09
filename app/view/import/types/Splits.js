/**
 * Split import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.Splits', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
    fieldName  : 'file_upload_splits',

    // For localization
    tabTitle : 'Splits',
    entityName          : 'Split',
    sectionName         : 'Split Setup',
    colTextIntegrationPackage : 'Integration Package',
    colTextSplitName : 'Split Name',
    colTextVendorCode : 'Vendor Code',
    colTextPropertyCode : 'Property Code',
    colTextGLCode : 'GL Code',
    colTextDepartment : 'Department',
    colTextCustomField1 : 'Custom Field 1',
    colTextCustomField2 : 'Custom Field 2',
    colTextCustomField3 : 'Custom Field 3',
    colTextCustomField4 : 'Custom Field 4',
    colTextCustomField5 : 'Custom Field 5',
    colTextCustomField6 : 'Custom Field 6',
    colTextPercent : 'Percent',
    
    getGrid: function() {
        return {
            forceFit: true,
            columns: [
                { text: this.colTextIntegrationPackage, dataIndex: 'IntegrationPackage', flex: 1,
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
                { text: this.colTextSplitName, dataIndex: 'SplitName'},
                { text: this.colTextVendorCode, dataIndex: 'VendorCode', flex: 1,  
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
                { text: this.colTextPropertyCode, dataIndex: 'PropertyCode', flex: 1,
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
                { text: this.colTextGLCode, dataIndex: 'GLCode', flex: 1, 
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
                { text: this.colTextDepartment, dataIndex: 'Department', flex: 1 },
                { text: this.colTextCustomField1, dataIndex: 'CustomField1', flex: 1 },
                { text: this.colTextCustomField2, dataIndex: 'CustomField2', flex: 1 },
                { text: this.colTextCustomField3, dataIndex: 'CustomField3', flex: 1 },
                { text: this.colTextCustomField4, dataIndex: 'CustomField4', flex: 1 },
                { text: this.colTextCustomField5, dataIndex: 'CustomField5', flex: 1 },
                { text: this.colTextCustomField6, dataIndex: 'CustomField6', flex: 1 },
            ]
        };
    }

});