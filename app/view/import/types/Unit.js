/**
 * Unit import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.Unit', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
    requires: [
        'NP.lib.core.Config'
    ],

    fieldName  : 'file_upload_unit',

    // For localization
    tabTitle           : NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit'),
    entityName         : NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit'),
    sectionName        : 'Unit',
    intPkgColText      : 'Integration Package',
    propertyCodeColText: 'Property Code',
    codeColText        : 'Code',
    nameColText        : 'Name',
    typeColText        : 'Type',
    
      getGrid: function() {
        return {
            columns: {
                items: [
                    {
                        text     : this.intPkgColText, 
                        dataIndex: 'integration_package_name'
                    },{
                        text     : this.propertyCodeColText,
                        dataIndex: 'property_id_alt'
                    },{
                        text     : this.codeColText,
                        dataIndex: 'unit_id_alt'
                    },{
                        text     : this.nameColText,
                        dataIndex: 'unit_number'
                    },{
                        text     : this.typeColText,
                        dataIndex: 'unittype_name'
                    }
                ]
            }
        };
    }

});