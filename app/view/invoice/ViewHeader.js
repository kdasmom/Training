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
    	'NP.lib.core.Translator',
    	'NP.view.shared.invoicepo.ViewHeaderPickers',
    	'NP.view.shared.CustomFieldContainer',
    	'NP.store.system.PriorityFlags',
    	'NP.store.invoice.InvoicePaymentTypes',
    	'Ext.layout.container.Form',
    	'Ext.form.field.Date',
    	'NP.view.invoice.numberPattern.Pattern',
    	'NP.view.invoice.numberPattern.Pattern2',
    	'NP.view.invoice.numberPattern.Pattern3',
    	'NP.view.invoice.numberPattern.Pattern4'
    ],

    layout: {
		type : 'hbox',
		align: 'stretch'
    },

    initComponent: function() {
    	var me = this;

    	me.title = NP.Translator.translate('Header');

    	me.translateText();

    	me.defaults = { layout: 'form' };
    	me.items = [
    		{
				xtype : 'shared.invoicepo.viewheaderpickers',
				flex  : 2
    		},{
    			xtype: 'container',
    			flex : 3,
    			layout: {
    				type : 'vbox',
    				align: 'stretch'
    			},
    			items: [
    				{
    					xtype: 'container',
    					layout: {
							type : 'hbox',
							align: 'stretch'
					    },
					    defaults: { layout: 'form' },
					    items   : [
					    	{
								xtype   : 'container',
								flex    : 1,
								margin  : '0 16 0 0',
								defaults: { labelWidth: 130, validateOnBlur: false, validateOnChange: false },
								items   : me.buildCol2Items()
				    		},{
								xtype   : 'container',
								flex    : 1,
								defaults: { labelWidth: 130, validateOnBlur: false, validateOnChange: false },
								items   : me.buildCol3Items()
				    		}
					    ]
    				},{
						xtype      : 'shared.customfieldcontainer',
						type       : 'invoice',
						labelAlign : 'left',
						border     : false,
						isLineItem : 0,
						margin     : 0,
						padding    : 0,
						bodyPadding: 0,
						fieldCfg   : { labelWidth: 130, comboUi: 'customcombo', fieldCfg: { useSmartStore: true } },
						flex       : 1
		            }
    			]
    		}
    	];

    	me.callParent(arguments);
    },

    buildCol2Items: function() {
    	var me    = this,
    		items = [];

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

		items.push(
			{
				xtype     : 'datefield',
				fieldLabel: this.createdOnLbl,
				name      : 'invoice_createddatetm',
				readOnly  : true
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
		);

		if (NP.Config.getSetting('CP.INVOICE_PAY_BY_FIELD', '0') == '1') {
			items.push({
				xtype       : 'customcombo',
				fieldLabel  : this.payByLbl,
				name        : 'invoicepayment_type_id',
				displayField: 'invoicepayment_type',
				valueField  : 'invoicepayment_type_id',
				allowBlank  : (NP.Config.getSetting('PN.InvoiceOptions.PayByRequired', '0') == 0),
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
    	var me      = this,
    		pattern = NP.Config.getSetting('PN.InvoiceOptions.OverRidealphaNumericFilter', 'pattern'),
    		items,
    		maskRe,
    		stripRe;
    	
		pattern = Ext.util.Format.capitalize(pattern);
		pattern = Ext.create('NP.view.invoice.numberPattern.' + pattern);
		stripRe = new RegExp(pattern.getPattern().replace('[', '[^'), pattern.getModifiers());

    	items = [
			{
				xtype       : 'textfield',
				fieldLabel  : this.invoiceNumLbl,
				name        : 'invoice_ref',
				allowBlank  : false,
				stripCharsRe: stripRe,
				maxLength   : 100
			},{
				xtype           : 'numberfield',
				fieldLabel      : this.invoiceTotalLbl,
				name            : 'control_amount',
				decimalPrecision: 2,
				allowBlank      : (NP.Config.getSetting('PN.InvoiceOptions.InvoiceTotalRequired', '0') == 0)
			},{
				xtype     : 'datefield',
				fieldLabel: this.invoiceDateLbl,
				name      : 'invoice_datetm',
				allowBlank: false
			},{
				xtype     : 'datefield',
				fieldLabel: this.invoiceDueDateLbl,
				name      : 'invoice_duedate',
				allowBlank: (NP.Config.getSetting('PN.InvoiceOptions.DueOnRequired', '0') == 0)
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
				hidden    : true,
				allowBlank: false
			},{
				xtype     : 'datefield',
				fieldLabel: this.cycleToLbl,
				name      : 'invoice_cycle_to',
				hidden    : true,
				allowBlank: false
			}
		);

		return items;
    },

    translateText: function() {
    	var me = this,
    		periodText = NP.Config.getSetting('PN.General.postPeriodTerm', 'Post Period');

    	me.createdOnLbl      = NP.Translator.translate('Created On');
		me.createdByLbl      = NP.Translator.translate('Created By');
		me.remitAdviceLbl    = NP.Translator.translate('Remittance Advice');
		me.priorityLbl       = NP.Translator.translate('Priority');
		me.neededByLbl       = NP.Translator.translate('Needed By');
		me.payByLbl          = NP.Translator.translate('Pay By');
		me.invoiceNumLbl     = NP.Translator.translate('Invoice Number');
		me.invoiceTotalLbl   = NP.Translator.translate('Invoice Total');
		me.invoiceDateLbl    = NP.Translator.translate('Invoice Date');
		me.invoiceDueDateLbl = NP.Translator.translate('Due Date');
		me.invoicePeriodLbl  = NP.Translator.translate('Invoice {postPeriod}', { postPeriod: periodText });
		me.associatedPOLbl   = NP.Translator.translate('Associated POs');
		me.vendorCodeLbl     = NP.Translator.translate('Vendor Code');
		me.cycleFromLbl      = NP.Translator.translate('Cycle From');
		me.cycleToLbl        = NP.Translator.translate('Cycle To');
    }
});