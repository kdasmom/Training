/**
 * The line items part of the invoice view page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.ViewLineItems', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.shared.invoicepo.viewlineitems',

    requires: [
        'NP.lib.core.Config',
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
    	var me         = this,
            capType    = Ext.util.Format.capitalize(me.type);

    	var store = Ext.create('NP.store.' + me.type + '.' + capType + 'Items', {
                service  : capType + 'Service',
                action   : 'get' + capType + 'Lines',
                listeners: {
                    add: function(store, recs, index) {
                        me.fireEvent('lineadd', store, recs, index);
                    },
                    update: function(store, rec, operation, modifiedFieldNames) {
                        me.fireEvent('lineupdate', store, rec, operation, modifiedFieldNames);
                    },
                    remove: function(store, rec, index, isMove) {
                        me.fireEvent('lineremove', store, rec, index, isMove);
                    }
                }
        	});
    	
        me.defaults = { type: me.type, store: store };
    	me.items = [
            { xtype: 'shared.invoicepo.viewlines', type: me.type },
            { xtype: 'shared.invoicepo.viewlinegrid', type: me.type }
    	];

    	this.callParent(arguments);

        this.addEvents('lineupdate','lineadd','lineremove');
    }
});