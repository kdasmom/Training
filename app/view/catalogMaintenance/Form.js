/**
 * Catalog Maintenance add/edit form
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalogMaintenance.Form', {
    extend: 'NP.lib.ui.BoundForm',
    alias: 'widget.catalogmaintenance.form',
    
    requires: [
        'NP.lib.core.Config',
    	'NP.lib.core.Security',
        'NP.store.catalog.CatalogTypes',
    	'NP.lib.ui.ComboBox',
    	'NP.view.shared.button.Save',
    	'NP.view.shared.button.Cancel'
    ],

    autoScroll: true,

    initComponent: function() {
        var that = this;

    	var fieldWidth = 450;
    	var bar = [
	    	 { xtype: 'shared.button.save' },
             { xtype: 'shared.button.cancel' }
	    ];

	    this.tbar = bar;
	    this.bbar = bar;

        var catalogTypes = Ext.create('NP.store.catalog.CatalogTypes').getRange();
        var radioGroup;
        this.defaults = {
            margin: 8
        };
        this.items = [
            {
                xtype: 'fieldset',
                title: 'Catalog Information',
                items: [
                    {
                        xtype       : 'customcombo',
                        fieldLabel  : 'Vendor',
                        type        : 'autocomplete',
                        name        : 'vendor_id',
                        displayField: 'vendor_name',
                        width       : fieldWidth,
                        valueField  : 'vendor_id',
                        store       : Ext.create('NP.store.vendor.Vendor', {
                                        service     : 'VendorService',
                                        action      : 'getForCatalogDropDown'
                                    })
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
                                        that.changeCatalogType(newValue['vc_catalogtype']);
                                    }
                                },
                                items      : []
                            }
                        ]
                    }
                ]
            },{
                xtype : 'fieldset',
                itemId: 'electronicPOFieldset',
                title : 'Electronic PO Submission Instructions',
                hidden: true,
                defaults: {
                    xtype: 'textfield',
                    width: fieldWidth
                },
                items : [
                    { fieldLabel: 'URL', name: 'vc_posubmit_url' },
                    { fieldLabel: 'Username', name: 'vc_posubmit_username' },
                    { fieldLabel: 'Password', name: 'vc_posubmit_pwd', inputType: 'password' },
                    { fieldLabel: 'From DUNS', name: 'vc_posubmit_from_duns' },
                    { fieldLabel: 'To DUNS', name: 'vc_posubmit_to_duns' }
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
    },

    changeCatalogType: function(catalogType) {
        var catalogImpl = Ext.create('NP.lib.catalog.' + Ext.util.Format.capitalize(catalogType));

        var fieldset = this.query('fieldset')[0];
        var children = fieldset.query('>');
        var removable = false;
        Ext.each(children, function(comp, idx) {
            if (removable) {
                fieldset.remove(comp);
            } else if (comp.getXType() == 'fieldcontainer') {
                removable = true;
            }
        });

        fieldset.add(catalogImpl.getFields());
        var elecPOFields = this.queryById('electronicPOFieldset');
        if (catalogImpl.hasPOSubmit()) {
            elecPOFields.show();
        } else {
            elecPOFields.hide();
        }
    }
});