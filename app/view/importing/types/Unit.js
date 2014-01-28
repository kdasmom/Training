/**
 * Unit import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.importing.types.Unit', {
    extend  : 'NP.view.importing.types.AbstractImportType',
    
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Translator'
    ],

    fieldName  : 'file_upload_unit',

    constructor: function() {
        var me = this;

        me.callParent(arguments);

        me.translateText();
    },

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
    },

    translateText: function() {
        var me = this,
            propertyText = NP.Config.getPropertyLabel(),
            unitText     = NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit');

        me.tabTitle            = NP.Translator.translate('{unit}', { unit: unitText});
        me.entityName          = NP.Translator.translate('{unit}', { unit: unitText});
        me.sectionName         = NP.Translator.translate('{property} Setup', { property: propertyText });
        me.intPkgColText       = NP.Translator.translate('Integration Package');
        me.propertyCodeColText = NP.Translator.translate('{property} Code', { property: propertyText });
        me.codeColText         = NP.Translator.translate('Code');
        me.nameColText         = NP.Translator.translate('Name');
        me.typeColText         = NP.Translator.translate('Type');
    }
});