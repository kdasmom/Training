/**
 * Vendor Utility import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.VendorUtility', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
    fieldName  : 'file_upload_vendor_utility',

    // For localization
    tabTitle : 'Vendor Utility',
    entityName : 'Vendor Utility',
    sectionName: 'Vendor Setup',
    vendorCodeColText   : 'Vendor Code',
    UtilityTypeColText : 'Utility Code',
    AccountNumberColText       : 'Account Number',
    PropertyIDColText: 'Property ID',
    UnitIdColText: 'Unit ID',
    MeterNumberColText: 'Meter Number',
    GLAccountColText: 'GL Account',

    getGrid: function() {
        return {
            columns: [
                {
                    text     : this.vendorCodeColText,
                    dataIndex: 'Vendor_ID',
                    flex     : 1,
                    renderer : function(val, meta, rec) {
                        var value = val.split(';');
                        if (value[1]) {
                            meta.tdAttr = 'data-qtip="' + value[1] + '"';
                            return "<span style='color:red;font-weight:bold' >" + value[0] + "</span>";
                        } else {
                            return val;
                        }
                    }},
                {
                    text     : this.UtilityTypeColText,
                    dataIndex: 'Utility_Type',
                    flex     : 1,
                    renderer : function(val, meta, rec) {
                        var value = val.split(';');
                        if (value[1]) {
                            meta.tdAttr = 'data-qtip="' + value[1] + '"';
                            return "<span style='color:red;font-weight:bold' >" + value[0] + "</span>";
                        } else {
                            return val;
                        }
                    }},
                {
                    text     : this.AccountNumberColText,
                    dataIndex: 'Account_Number',
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
                    text     : this.PropertyIDColText,
                    dataIndex: 'Property_ID',
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
                    text     : this.UnitIdColText,
                    dataIndex: 'Unit_Id',
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
                    text     : this.MeterNumberColText,
                    dataIndex: 'Meter_Number',
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
                    text     : this.GLAccountColText,
                    dataIndex: 'GL_Account',
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
        };
    }

});
