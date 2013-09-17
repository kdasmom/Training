/**
 * The the header part of the invoice view page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.ViewHeader', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.invoice.viewheader',

    requires: [
    	'NP.lib.core.Config',
    	'NP.view.shared.invoicepo.ViewHeaderPickers',
    	'NP.store.system.PriorityFlags',
    	'NP.store.invoice.InvoicePaymentTypes'
    ],

    // For localization
	title            : 'Header',
	createdOnLbl     : 'Created On',
	createdByLbl     : 'Created By',
	remitAdviceLbl   : 'Remittance Advice',
	priorityLbl      : 'Priority',
	neededByLbl      : 'Needed By',
	payByLbl         : 'Pay By',
	invoiceNumLbl    : 'Invoice Number',
	invoiceTotalLbl  : 'Invoice Total',
	invoiceDateLbl   : 'Invoice Date',
	invoiceDueDateLbl: 'Due Date',
	invoicePeriodLbl : 'Invoice ' + NP.Config.getSetting('PN.General.postPeriodTerm', 'Post Period'),
	associatedPOLbl  : 'Associated POs',
	vendorCodeLbl    : 'Vendor Code',
	cycleFromLbl     : 'Cycle From',
	cycleToLbl       : 'Cycle To',
    
    layout: {
		type : 'hbox',
		align: 'stretch'
    },

    initComponent: function() {
    	var me        = this,
    		col2Items = me.buildCol2Items(),
    		col3Items = me.buildCol3Items();

    	me.defaults = { layout: 'form' };
    	me.items = [
    		{
				xtype : 'shared.invoicepo.viewheaderpickers',
				flex  : 1
    		},{
				xtype   : 'container',
				flex    : 1,
				margin  : '0 16 0 0',
				defaults: { labelWidth: 130 },
				items   : col2Items
    		},{
				xtype   : 'container',
				flex    : 1,
				defaults: { labelWidth: 130 },
				items   : col3Items
    		}
    	];

    	me.callParent(arguments);
    },

    buildCol2Items: function() {
    	var me   = this,
    		items = [
				{
					xtype     : 'displayfield',
					fieldLabel: this.createdOnLbl,
					name      : 'invoice_createddatetm',
					renderer  : function() {
						var invoice = me.up('boundform').getModel('invoice.Invoice');
						return Ext.Date.format(invoice.get('invoice_createddatetm'), NP.Config.getDefaultDateFormat());
					}
				},{
					xtype     : 'displayfield',
					fieldLabel: this.createdByLbl,
					name      : 'userprofile_username'
				},{
					xtype         : 'checkbox',
					fieldLabel    : this.remitAdviceLbl,
					name          : 'remit_advice',
					inputValue    : 1,
					uncheckedValue: 0
				}
			];

		if (NP.Security.hasPermission(6007)) {
			items.push(
				{
					xtype       : 'customcombo',
					fieldLabel  : this.priorityLbl,
					name        : 'PriorityFlag_ID_Alt',
					displayField: 'PriorityFlag_Display',
					valueField  : 'PriorityFlag_ID_Alt',
					store       : { type: 'system.priorityflags' }
				},{
					xtype     : 'datefield',
					fieldLabel: this.neededByLbl,
					name      : 'invoice_NeededBy_datetm'
				}
			);
		}

		if (NP.Config.getSetting('CP.INVOICE_PAY_BY_FIELD', '0') == '1') {
			items.push({
				xtype       : 'customcombo',
				fieldLabel  : this.payByLbl,
				name        : 'invoicepayment_type_id',
				displayField: 'invoicepayment_type',
				valueField  : 'invoicepayment_type_id',
				allowBlank  : false,
				store       : {
					type       : 'invoice.invoicepaymenttypes',
					service    : 'PicklistService',
					action     : 'getList',
					autoLoad   : true,
					extraParams: {
						entityType: 'invoicePaymentType'
					}
				}
			});
		}

		return items;
    },

    buildCol3Items: function() {
    	var me    = this,
    		items = [
			{
				xtype     : 'textfield',
				fieldLabel: this.invoiceNumLbl,
				name      : 'invoice_ref',
				allowBlank: false
			},{
				xtype           : 'numberfield',
				fieldLabel      : this.invoiceTotalLbl,
				name            : 'control_amount',
				decimalPrecision: 2,
				allowBlank      : (NP.Config.getSetting('PN.InvoiceOptions.InvoiceTotalRequired', '0') == '1') ? false : true
			},{
				xtype     : 'datefield',
				fieldLabel: this.invoiceDateLbl,
				name      : 'invoice_datetm',
				allowBlank: false
			},{
				xtype     : 'datefield',
				fieldLabel: this.invoiceDueDateLbl,
				name      : 'invoice_duedate',
				allowBlank      : (NP.Config.getSetting('PN.InvoiceOptions.DueOnRequired', '0') == '1') ? false : true
			},{
				xtype       : 'customcombo',
				fieldLabel  : this.invoicePeriodLbl,
				name        : 'invoice_period',
				displayField: 'accounting_period_display',
				valueField  : 'accounting_period',
				allowBlank  : false,
				store       : Ext.create('Ext.data.Store', {
					fields: [
						{ name: 'accounting_period_display' },
				        { name: 'accounting_period' }
				    ]
				})
			}
		];

		if (NP.Security.hasPermission(1026)) {
			items.push({
				xtype: 'displayfield',
				fieldLabel: this.associatedPOLbl,
				name: 'associated_pos',
				renderer: function(val, field) {
					if (val.join) {
						return val.join(',');
					}

					return '<i>None</i>';
				}
			});
		}

		if (NP.Config.getSetting('PN.InvoiceOptions.AllowVendorCode', '0') == '1') {
			items.push({
				xtype: 'textfield',
				fieldLabel: me.vendorCodeLbl,
				name: 'vendor_code'
			});
		}

		items.push(
			{
				xtype     : 'datefield',
				fieldLabel: this.cycleFromLbl,
				name      : 'invoice_cycle_from',
				hidden    : true
			},{
				xtype     : 'datefield',
				fieldLabel: this.cycleToLbl,
				name      : 'invoice_cycle_to',
				hidden    : true
			}
		);

		return items;
    }
});