/**
 * The main form component for the Invoice view page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.View', {
    extend: 'NP.lib.ui.BoundForm',
    alias: 'widget.invoice.view',
    
    requires: [
    	'NP.lib.core.Security',
    	'NP.view.invoice.ViewToolbar',
    	'NP.view.invoice.ViewHeader',
    	'NP.view.invoice.ViewCustomFields',
    	'NP.view.invoice.ViewLineItems',
    	'NP.view.invoice.ViewNotes',
    	'NP.view.invoice.ViewReclass',
    	'NP.view.invoice.ViewHistory',
    	'NP.view.invoice.ViewPayments',
    	'NP.view.shared.invoicepo.ForwardsGrid'
    ],

    layout: 'border',

    // For localization
    title: 'Invoice: ',

    initComponent: function() {
    	var me           = this,
    		centerRegion = {
				region    : 'center',
				xtype     : 'panel',
				border    : false,
				autoScroll: true,
				defaults  : { cls: 'invoiceViewPanel', frame: true },
				items     : [
		    		{ xtype: 'invoice.viewheader' },
		    		{ xtype: 'invoice.viewlineitems' },
		    		{ xtype: 'invoice.viewcustomfields' },
		    		{ xtype: 'invoice.viewnotes' }
		    	]
			};

    	me.tbar = { xtype: 'invoice.viewtoolbar' };
    	me.bbar = { xtype: 'invoice.viewtoolbar' };

    	me.items = [
    		{
				region     : 'west',
				xtype      : 'panel',
				layout     : 'fit',
				border     : false,
				style      : 'border-right-style: solid; border-right-width: 1px',
				width      : '50%',
				collapsible: true,
				resizable  : true,
				collapsed  : true,
				items      : [{
					xtype: 'component',
					html : 'Image shows up here'
					//html: '<iframe src="clients/help.pdf" height="100%" width="100%"></iframe>'
				}]
    		}
    	];

		if (NP.Security.hasPermission(2094) || NP.Security.hasPermission(6093)) {
			centerRegion.items.push({ xtype: 'invoice.viewreclass', hidden: true });
		}

		centerRegion.items.push(
			{ xtype: 'invoice.viewhistory', hidden: true },
    		{ xtype: 'invoice.viewpayments', hidden: true },
		    { xtype: 'shared.invoicepo.forwardsgrid', title: 'Invoice Forwards', type: 'invoice' }
		);

		me.items.push(centerRegion);

    	me.callParent(arguments);

    	// This is to remove the top and bottom borders on the collapsed panel placeholder
    	me.on('render', function(panel) {
    		panel.getEl().down('.x-region-collapsed-placeholder').setStyle('border-width', '0 1px 0 1px');
    	});
    },

    getInvoiceRecord: function() {
        var me      = this,
        	invoice = me.getModel('invoice.Invoice');

        return invoice;
    },
    isInvoiceModifiable: function() {
        var me      = this,
            invoice = me.getInvoiceRecord();

        if (NP.Security.hasPermission(6076)) {
            return true;
        }

        if (NP.Security.hasPermission(6077) 
                && NP.Security.getUser().get('userprofile_id') == invoice.get('userprofile_id')) {
            return true;
        }

        return false;
    },
    isInvoiceLineEditable: function() {
        var me      = this,
            status  = me.getInvoiceRecord().get('invoice_status');

        if (
            (status == 'open' && (NP.Security.hasPermission(1032) || NP.Security.hasPermission(6076) || NP.Security.hasPermission(6077)))
            || (status == 'saved' && NP.Security.hasPermission(1068) && me.isInvoiceModifiable())
            || (status == 'paid' && NP.Security.hasPermission(2094))
        ) {
            return true;
        }

        return false;
    }
});