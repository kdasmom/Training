/**
 * Vendor import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.importing.types.Vendor', {
    extend  : 'NP.view.importing.types.AbstractImportType',
    
    fieldName  : 'file_upload_vendor',

    // For localization
    tabTitle          : 'Vendor',
    entityName        : 'Vendor',
    sectionName       : 'Vendor Setup',
    instructions      : null,
    
    vendorIdColText   : 'Vendor ID',
    vendorNameColText : 'Name',
    fedIdColText      : 'Federal ID',
    taxReportColText  : 'Tax Report Name',
    statusColText     : 'Status',
    vendorTypeColText : 'Vendor Type',
    payPriorityColText: 'Pay Priority',
    createDateColText : 'Created Date',
    updateDateColText : 'Last Update Date',
    report1099ColText : '1099 Reportable ?',
    termDateColText   : 'Term Date Basis',
    payDateColText    : 'Pay Date Basis',
    glCodeColText     : 'Default GL code',
    phoneColText      : 'Phone',
    faxColText        : 'Fax',
    address1ColText   : 'Address 1',
    address2ColText   : 'Address 2',
    cityColText       : 'City',
    stateColText      : 'State',
    zipCodeColText    : 'Zip Code',
    lastNameColText   : 'Contact Last Name',
    firstNameColText  : 'Contact First Name',
    intPkgColText     : 'Integration Package',

    getGrid: function() {
        return {
            columns: {
                items: [
                    {
                        text     : this.vendorIdColText,
                        dataIndex: 'vendor_id_alt'
                    },{
                        text     : this.vendorNameColText,
                        dataIndex: 'vendor_name'
                    },{
                        text     : this.fedIdColText,
                        dataIndex: 'vendor_fedid'
                    },{
                        text     : this.taxReportColText,
                        dataIndex: 'vendor_tax_reporting_name'
                    },{
                        text     : this.statusColText,
                        dataIndex: 'vendor_status'
                    },{
                        text     : this.vendorTypeColText,
                        dataIndex: 'vendortype_name'
                    },{
                        text     : this.payPriorityColText,
                        dataIndex: 'vendor_paypriority'
                    },{
                        text     : this.createDateColText,
                        dataIndex: 'vendor_createddatetm'
                    },{
                        text     : this.updateDateColText,
                        dataIndex: 'vendor_lastupdate_date'
                    },{
                        text     : this.report1099ColText,
                        dataIndex: 'vendor_type1099'
                    },{
                        text     : this.termDateColText,
                        dataIndex: 'vendor_termsdatebasis'
                    },{
                        text     : this.payDateColText,
                        dataIndex: 'paydatebasis_code'
                    },{
                        text     : this.glCodeColText,
                        dataIndex: 'default_glaccount_number'
                    },{
                        text     : this.phoneColText,
                        dataIndex: 'phone_number'
                    },{
                        text     : this.faxColText,
                        dataIndex: 'fax_number'
                    },{
                        text     : this.address1ColText,
                        dataIndex: 'address_line1'
                    },{
                        text     : this.address2ColText,
                        dataIndex: 'address_line2'
                    },{
                        text     : this.cityColText,
                        dataIndex: 'address_city'
                    },{
                        text     : this.stateColText,
                        dataIndex: 'address_state'
                    },{
                        text     : this.zipCodeColText,
                        dataIndex: 'address_zip'
                    },{
                        text     : this.lastNameColText,
                        dataIndex: 'person_lastname'
                    },{
                        text     : this.firstNameColText,
                        dataIndex: 'person_firstname'
                    },{
                        text     : this.intPkgColText,
                        dataIndex: 'integration_package_name'
                    }
                ]
            }
        }
    }

});
