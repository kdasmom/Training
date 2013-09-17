/**
 * The custom fields part of the invoice view page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.ViewCustomFields', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.invoice.viewcustomfields',

    requires: [
    	'NP.view.shared.CustomFieldContainer'
    ],

    layout: 'fit',

    // For localization
    title: 'Custom Fields',
    
    initComponent: function() {
    	this.items = [{ xtype: 'shared.customfieldcontainer', type: 'invoice', isLineItem: 0 }];

    	this.callParent(arguments);
    }
});