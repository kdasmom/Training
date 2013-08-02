/**
 * Catalog Maintenance add/edit form
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalogMaintenance.CatalogFormInfo', {
    extend: 'Ext.container.Container',
    alias: 'widget.catalogmaintenance.catalogforminfo',
    
    requires: [
        'NP.lib.core.Config',
    	'NP.lib.core.Security',
        'NP.store.catalog.CatalogTypes',
    	'NP.lib.ui.ComboBox',
        'NP.lib.ui.AutoComplete'
    ],

    title: 'Catalog Information',

    autoScroll: true,

    initComponent: function() {
        var that = this;

    	var fieldWidth = 450;
    	
        var catalogTypes = Ext.create('NP.store.catalog.CatalogTypes').getRange();
        var radioGroup;
        
        this.addEvents('selectvendor','changetype');

        this.items = [
            {
                xtype       : 'customcombo',
                fieldLabel  : 'Vendor',
                type        : 'autocomplete',
                name        : 'vendor_id',
                displayField: 'vendor_name',
                width       : fieldWidth,
                valueField  : 'vendor_id',
                allowBlank  : false,
                store       : Ext.create('NP.store.vendor.Vendors', {
                                service     : 'VendorService',
                                action      : 'getForCatalogDropDown'
                            }),
                listeners   : {
                    select: function(combo, records, eOpts) {
                        that.fireEvent('selectvendor', combo, records, eOpts);
                    }
                }
            },{
                xtype     : 'textfield',
                fieldLabel: 'Catalog Name',
                name      : 'vc_catalogname',
                width     : fieldWidth
            },{
                xtype: 'fieldcontainer',
                fieldLabel: 'Catalog Type',
                items: [
                    radioGroup = {
                        xtype: 'radiogroup',
                        defaults: {
                            xtype: 'radio',
                            style: 'white-space: nowrap;margin-right:12px;'
                        },
                        listeners: {
                            change: function(field, newValue, oldValue) {
                                that.fireEvent('changetype', that, newValue['vc_catalogtype'], oldValue['vc_catalogtype']);
                            }
                        },
                        items      : []
                    }
                ]
            }
        ];

        for (var i=0; i<catalogTypes.length; i++) {
            radioGroup.items.push({
                name      : 'vc_catalogtype',
                boxLabel  : catalogTypes[i].get('name'),
                inputValue: catalogTypes[i].get('id')
            });
        }

    	this.callParent(arguments);
    }
});