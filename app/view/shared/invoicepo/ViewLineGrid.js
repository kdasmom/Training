/**
 * The line items edit grid for the invoice or PO page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.ViewLineGrid', {
    extend: 'NP.lib.ui.Grid',
    alias: 'widget.shared.invoicepo.viewlinegrid',

    requires: [
    	
    ],

    // For localization
    quantityColName   : 'QTY',
    descriptionColName: 'Description',

    initComponent: function() {
    	var me = this;

        me.columns = [
            {
                text: me.quantityColName,
                dataIndex: 'invoiceitem_quantity'
            },{
                text: me.descriptionColName,
                dataIndex: 'invoiceitem_description'
            }
    	];

    	this.callParent(arguments);
    }
});