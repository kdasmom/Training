/**
 * Unit type import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.importing.types.UnitType', {
    extend  : 'NP.view.importing.types.AbstractImportType',
    
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Translator'
    ],
    
    fieldName  : 'file_upload_unit_type',

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
                        text     : this.nameColText,
                        dataIndex: 'unittype_name'
                    },{
                        text     : this.bedroomsColText,
                        dataIndex: 'unittype_bedrooms'
                    },{
                        text     : this.bathroomsColText,
                        dataIndex: 'unittype_bathrooms'
                    },{
                        text     : this.carpetYdColText,
                        dataIndex: 'carpet_yards'
                    },{
                        text     : this.vinylYdColText,
                        dataIndex: 'vinyl_yards'
                    },{
                        text     : this.tileYdColText,
                        dataIndex: 'tile_yards'
                    },{
                        text     : this.harwoodYdColText,
                        dataIndex: 'hardwood_yards'
                    },{
                        text     : this.carpetFtColText,
                        dataIndex: 'carpet_feet'
                    },{
                        text     : this.vinylFtColText,
                        dataIndex: 'vinyl_feet'
                    },{
                        text     : this.tileFtColText,
                        dataIndex: 'tile_feet'
                    },{
                        text     : this.harwoodFtColText,
                        dataIndex: 'hardwood_feet'
                    }
                ]
            }
        };
    },

    translateText: function() {
        var me = this,
            propertyText = NP.Config.getPropertyLabel(),
            unitText     = NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit');

        me.tabTitle            = NP.Translator.translate('{unit} Type', { unit: unitText});
        me.entityName          = NP.Translator.translate('{unit} Types', { unit: unitText});
        me.sectionName         = NP.Translator.translate('{property} Setup', { property: propertyText });
        me.intPkgColText       = NP.Translator.translate('Integration Package');
        me.propertyCodeColText = NP.Translator.translate('{property} Code', { property: propertyText });
        me.nameColText         = NP.Translator.translate('Name');
        me.bedroomsColText     = NP.Translator.translate('Bedrooms');
        me.bathroomsColText    = NP.Translator.translate('Bathrooms');
        me.carpetYdColText     = NP.Translator.translate('Carpet Yd');
        me.vinylYdColText      = NP.Translator.translate('Vinyl Yd');
        me.tileYdColText       = NP.Translator.translate('Tile Yd');
        me.harwoodYdColText    = NP.Translator.translate('Harwood Yd');
        me.carpetFtColText     = NP.Translator.translate('Carpet Ft');
        me.vinylFtColText      = NP.Translator.translate('Vinyl Ft');
        me.tileFtColText       = NP.Translator.translate('Tile Ft');
        me.harwoodFtColText    = NP.Translator.translate('Harwood Ft');
    }

});