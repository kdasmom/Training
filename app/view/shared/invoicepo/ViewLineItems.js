/**
 * The line items part of the invoice view page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.ViewLineItems', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.shared.invoicepo.viewlineitems',

    requires: [
    	'NP.view.shared.invoicepo.ViewLines',
    	'NP.view.shared.invoicepo.ViewLineGrid',
    	'NP.store.invoice.InvoiceItems'
    ],

    layout     : 'card',
    border     : false,
    bodyPadding: 0,

    // Additional options
    type: null,             // Needs to be set to 'invoice' or 'po'

    // For localization
    title: 'Line Items',
    
    initComponent: function() {
    	var me   = this,
            capType = Ext.util.Format.capitalize(me.type);

    	var storeCfg = Ext.create('NP.store.' + me.type + '.' + capType + 'Items', {
            service  : capType + 'Service',
            action   : 'get' + capType + 'Lines',
            listeners: {
                datachanged: function(store) {
                    var form = me.up('boundform');

                    // Enable the vendor and property fields if there are no line items
                    if (store.getCount() === 0) {
                        form.findField('vendor_id').enable();
                        form.findField('property_id').enable();
                    // Otherwise, if not lines, disable them
                    } else {
                        form.findField('vendor_id').disable();
                        form.findField('property_id').disable();
                    }
                }
            }
    	});
    	
        me.defaults = { type: me.type, store: storeCfg };
    	me.items = [
            { xtype: 'shared.invoicepo.viewlines', type: me.type },
            { xtype: 'shared.invoicepo.viewlinegrid', type: me.type }
    	];

    	this.callParent(arguments);
    }
});