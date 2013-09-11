/**
 * GL Code import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.GLCode', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
    fieldName: 'file_upload_gl_code',

    // For localization
    entityName          : 'GL Codes',
    sectionName         : 'GL Account Setup',
    tabTitle            : 'GL Code',
    nameColText         : 'GL Account Name',
    accountNumberColText: 'Account Number',
    accountTypeColText  : 'Account Type',
    categoryColText     : 'Category Name',
    intPkgColText       : 'Integration Package Name',

    getGrid: function() {
        return {
            columns: [
                { text: this.nameColText, dataIndex: 'GLAccountName', flex: 1 },
                { text: this.accountNumberColText, dataIndex: 'AccountNumber', flex: 1 },
                {
                    text     : this.accountTypeColText,
                    dataIndex: 'AccountType',
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
                    text     : this.categoryColText,
                    dataIndex: 'CategoryName',
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
                    text     : this.intPkgColText, 
                    dataIndex: 'IntegrationPackageName',
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