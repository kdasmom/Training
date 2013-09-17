/**
 * The property and vendor pickers for the invoice/po view page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.ViewHeaderPickers', {
    extend: 'Ext.container.Container',
    alias: 'widget.shared.invoicepo.viewheaderpickers',

    requires: [
    	'NP.lib.core.Config',
    	'NP.view.shared.VendorAutoComplete',
    	'NP.view.shared.PropertyCombo'
    ],

    margin  : '0 16 0 0',
	defaults: {},

    initComponent: function() {
    	var me = this;

    	me.defaults.labelWidth = 120;

    	me.items = [
    		{
				xtype     : 'shared.propertycombo',
				labelAlign: 'top',
				disabled  : true
			},{
				xtype     : 'shared.vendorautocomplete',
				labelAlign: 'top',
				disabled  : true
			},{
				xtype : 'component',
				itemId: 'vendor_display',
				hidden: true
			}
    	];

    	me.callParent(arguments);
    }
});