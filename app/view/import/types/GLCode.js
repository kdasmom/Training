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
            columns: {
                items: [
                    { text: this.nameColText, dataIndex: 'glaccount_name' },
                    { text: this.accountNumberColText, dataIndex: 'glaccount_number' },
                    { text: this.accountTypeColText, dataIndex: 'glaccounttype_name' },
                    { text: this.categoryColText, dataIndex: 'category_name' },
                    { text: this.intPkgColText, dataIndex: 'integration_package_name' }
                ]
            }
        };
    }

});