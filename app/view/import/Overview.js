/**
 * Import/Export Utility > Overview tab
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.import.Overview', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.import.overview',

    bodyPadding: 8,

    title      : 'Overview',
    
    introText  : '<b>Overview</b><br />'+
                'The Import/Export tool allows you to easily import and export key information in and from the NexusPayables system. '+
                'This tool will enable you to easily upload setup information to help you quickly get started in using the system as well'+
                'as upload additional values to these sections as your setup changes. Please note, edits to these uploaded values must be made'+
                'in the respective administration management and setup areas.' +
                '<br /><br />' +
                '<b>Instructions</b><br />' +
                'All uploads are made by using a .CSV file. A .CSV is a Comma Separated Value (CSV) file which is ' +
                'easily created by creating an Excel file and saving it as this file type. All versions of Excel ' +
                'allow you to save a workbook as a .CSV file type. The upload will not work with any other file ' +
                'types. <b>Please remember to delete the upload instruction prior to uploading the file.</b>' +
                '<br /><br />' +
                'All uploads must include the column headings EXACTLY how they are listed in the worksheet and ' +
                'will not work if these do not match.' +
                '<br /><br />' +
                'When you upload a file, the system will mark any row with an invalid entry with an X. The review ' +
                'screen of your upload will give you the option to accept the file for import as is or decline it ' +
                'to re-upload. If you choose to Accept the file, any invalid entries will be skipped and WILL NOT ' +
                'be included in the upload.' +
                '<br /><br />' +
                'Please note that there is a limit of 1000 rows per file for all imports and exports.' +
                '<br /><br />' +
                '<b>Sample Worksheets</b><br />' +
                'A sample worksheet for every import and export tool is provided below. Each worksheet ' +
                'includes the field definition and parameters. To utilize these worksheets, simply save ' +
                'the file to your computer and delete the definitions.' +
                '<br /><br />' +
                'If you are extracting this information from your GL system or another source, please ' +
                'note that the output you have must be reformatted to match the outlined file layout ' +
                'and must be a .CSV file type.',

    glSectionText         : '<b>GL Worksheets</b>' +
                            '<ul>' +
                                '<li><a href="resources/import/glcategory_template.csv" target="_blank">GL Category</a></li>' +
                                '<li><a href="resources/import/glaccounts_template.csv" target="_blank">GL Account</a></li>' +
                                '<li><a href="resources/import/budgets_template.csv" target="_blank">GL Budgets</a></li>' +
                                '<li><a href="resources/import/actuals_template.csv" target="_blank">GL Actuals</a></li>' +
                            '</ul>',
    invoiceSectionText    : '<b>Invoice Worksheets</b>' +
                            '<ul>' +
                                '<li><a href="resources/import/invoice_export_sample.csv" target="_blank">Invoice Export</a></li>' +
                                '<li><a href="resources/import/payment_template.csv" target="_blank">Invoice Payments</a></li>' +
                                '<li><a href="resources/import/invoice_items_template.csv" target="_blank">Invoice Item Import</a></li>' +
                            '</ul>',
    poSectionText         : '<b>Purchase Order Worksheets</b>' +
                            '<ul>' +
                                '<li><a href="resources/import/po_items_template.csv" target="_blank">Purchase Order Item Import</a></li>' +
                            '</ul>',
    propertySectionText   : '<b>Property Worksheets</b>' +
                            '<ul>' +
                                '<li><a href="resources/import/entity_template.csv" target="_blank">Property</a></li>' +
                                '<li><a href="resources/import/entitygl_template.csv" target="_blank">Property GL Assignment</a></li>' +
                                '<li><a href="resources/import/department_template.csv" target="_blank">Dept</a></li>' +
                                '<li><a href="resources/import/department_type_template.csv" target="_blank">Dept Type</a></li>' +
                            '</ul>',
    userSectionText       : '<b>User Worksheets</b>' +
                            '<ul>' +
                                '<li><a href="resources/import/user_template.csv" target="_blank">Users</a></li>' +
                                '<li><a href="resources/import/userentity_template.csv" target="_blank">User Property Assignment</a></li>' +
                            '</ul>',
    helpSectionText       : '<b>Help</b>' +
                            '<ul>' +
                                '<li><a href="resources/help/upload_help.pdf" target="_blank">Upload</a></li>' +
                            '</ul>',
    vendorSectionText     : '<b>Vendor Worksheets</b>' +
                            '<ul>' +
                                '<li><a href="resources/import/vendor_template.csv" target="_blank">Vendors</a></li>' +
                                '<li><a href="resources/import/vendorgl_template.csv" target="_blank">Vendor GL Assignment</a></li>' +
                                '<li><a href="resources/import/vendorfav_template.csv" target="_blank">Vendor Favorites</a></li>' +
                                '<li><a href="resources/import/vendorinsurance_template.csv" target="_blank">Vendor Insurance</a></li>' +
                                '<li><a href="resources/import/vendorutility_template.csv" target="_blank">Vendor Utility Account</a></li>' +
                            '</ul>',
    customFieldSectionText: '<b>Custom Field Worksheets</b>' +
                            '<ul>' +
                                '<li><a href="resources/import/customfields_template.csv" target="_blank">Custom Field - Header</a></li>' +
                                '<li><a href="resources/import/customfields_template.csv" target="_blank">Custom Field - Line Item</a></li>' +
                            '</ul>',
    splitSectionText      : '<b>Splits Worksheets</b>' +
                            '<ul>' +
                                '<li><a href="resources/import/split_template.csv" target="_blank">Splits</a></li>' +
                            '</ul>',

    initComponent: function() {
        this.items = [
            { xtype: 'component', html: this.introText },
            {
                xtype: 'container',
                layout: {
                    type : 'hbox',
                    align: 'stretch'
                },
                defaults: {
                    xtype   : 'container',
                    layout  : 'vbox',
                    flex    : 1,
                    cls     : 'importTemplates',
                    margin  : '8 0 0 16',
                    defaults: { xtype: 'component', margin: '12 0 0 0' }
                },
                items: [
                    {
                        items: [
                            { html: this.glSectionText },
                            { html: this.invoiceSectionText },
                            { html: this.poSectionText }
                        ]
                    },{
                        items: [
                            { html: this.propertySectionText },
                            { html: this.userSectionText },
                            { html: this.helpSectionText }
                        ]
                    },{
                        items: [
                            { html: this.vendorSectionText },
                            { html: this.customFieldSectionText },
                            { html: this.splitSectionText }
                        ]
                    }
                ]
            }
        ];
        
        this.callParent(arguments);
    }
});