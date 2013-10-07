/**
 * Unit type import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.UnitType', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
    fieldName  : 'file_upload_unit_type',

    // For localization
    tabTitle            : NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit') + ' Type',
    entityName          : NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit') + ' Type',
    sectionName         : 'Unit Type',
    intPkgColText       : 'Integration Package',
    propertyCodeColText : 'Property Code',
    nameColText         : 'Name',
    bedroomsColText     : 'Bedrooms',
    bathroomsColText    : 'Bathrooms',
    carpetYdColText     : 'Carpet Yd',
    vinylYdColText      : 'Vinyl Yd',
    tileYdColText       : 'Tile Yd',
    harwoodYdColText    : 'Harwood Yd',
    carpetFtColText     : 'Carpet Ft',
    vinylFtColText      : 'Vinyl Ft',
    tileFtColText       : 'Tile Ft',
    harwoodFtColText    : 'Harwood Ft',
    
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
    }

});