/**
 * The Shipping & Billing part of the PO view page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.po.ViewShippingBilling', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.po.viewshippingbilling',

    requires: [
    	'NP.lib.core.Config',
        'NP.lib.core.Translator',
        'NP.view.shared.PropertyCombo',
        'NP.store.property.Properties'
    ],

    layout: {
		type : 'hbox',
		align: 'stretch'
    },
    
    initComponent: function() {
    	var me = this;

    	me.title = NP.Translator.translate('Shipping & Billing');

        me.items = [
    		{
                xtype : 'container',
                flex  : 1,
                margin: '0 16 0 0',
                layout: {
                    type : 'vbox',
                    align: 'stretch'
                },
                items: [
                    {
                        xtype     : 'shared.propertycombo',
                        labelAlign: 'top',
                        fieldLabel: NP.Translator.translate('Ship To'),
                        name      : 'Purchaseorder_ship_propertyID',
                        store     : {
                            type: 'property.properties',
                            service: 'PropertyService',
                            action : 'getShipBillTo',
                            extraParams: { type: 'ship' }
                        }
                    },{
                        xtype : 'textarea',
                        name  : 'Purchaseorder_shipaddress',
                        height: 100
                    }
                ]
    		},{
                xtype : 'container',
                flex  : 1,
                layout: {
                    type : 'vbox',
                    align: 'stretch'
                },
                items: [
                    {
                        xtype     : 'shared.propertycombo',
                        labelAlign: 'top',
                        fieldLabel: NP.Translator.translate('Bill To'),
                        name      : 'Purchaseorder_bill_propertyID',
                        store     : {
                            type: 'property.properties',
                            service: 'PropertyService',
                            action : 'getShipBillTo',
                            extraParams: { type: 'bill' }
                        }
                    },{
                        xtype : 'textarea',
                        name  : 'Purchaseorder_billaddress',
                        height: 100
                    }
                ]
            }
    	];

    	me.callParent(arguments);
    }
});