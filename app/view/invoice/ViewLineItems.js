/**
 * The line items part of the invoice view page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.ViewLineItems', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.invoice.viewlineitems',

    requires: [
    	'NP.view.shared.invoicepo.ViewLines',
    	'NP.view.shared.invoicepo.ViewLineGrid',
    	'NP.store.invoice.InvoiceItems'
    ],

    // For localization
    title: 'Line Items',
    
    layout : 'card',
    border     : false,
    bodyPadding: 0,

    initComponent: function() {
    	var me = this;

    	var storeCfg = Ext.create('NP.store.invoice.InvoiceItems', {
    		service: 'InvoiceService',
    		action : 'getInvoiceLines'
    	});
    	
    	me.items = [
    		{ xtype: 'shared.invoicepo.viewlines', type: 'invoice', store: storeCfg },
    		{ xtype: 'shared.invoicepo.viewlinegrid', type: 'invoice', store: storeCfg }
    	];

    	this.callParent(arguments);
    }
});