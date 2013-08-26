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
    codeColText         : 'Code',
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
            columns: [
                {
                    text     : this.intPkgColText, 
                    dataIndex: 'IntegrationPackage',
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
                    text     : this.propertyCodeColText,
                    dataIndex: 'PropertyCode',
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
                    text     : this.codeColText,
                    dataIndex: 'Code',
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
                    text     : this.nameColText,
                    dataIndex: 'Name',
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
                    text     : this.bedroomsColText,
                    dataIndex: 'Bedrooms',
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
                    text     : this.bathroomsColText,
                    dataIndex: 'Bathrooms',
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
                    text     : this.carpetYdColText,
                    dataIndex: 'CarpetYd',
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
                    text     : this.vinylYdColText,
                    dataIndex: 'VinylYd',
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
                    text     : this.tileYdColText,
                    dataIndex: 'TileYd',
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
                    text     : this.harwoodYdColText,
                    dataIndex: 'HarwoodYd',
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
                    text     : this.carpetFtColText,
                    dataIndex: 'CarpetFt',
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
                    text     : this.vinylFtColText,
                    dataIndex: 'VinylFt',
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
                    text     : this.tileFtColText,
                    dataIndex: 'TileFt',
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
                    text     : this.harwoodFtColText,
                    dataIndex: 'HarwoodFt',
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
            ]
        };
    }

});