/**
 * The the header part of the PO view page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.po.ViewHeader', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.po.viewheader',

    requires: [
    	'NP.lib.core.Config',
    	'NP.lib.core.Translator',
    	'NP.view.shared.invoicepo.ViewHeaderPickers',
    	'NP.store.system.PriorityFlags',
    	'Ext.layout.container.Form',
    	'Ext.form.field.Date',
    	'NP.store.system.PrintTemplates'
    ],

    layout: {
		type : 'hbox',
		align: 'stretch'
    },

    initComponent: function() {
    	var me            = this,
    		defaultColCfg = { labelWidth: 130, validateOnBlur: false, validateOnChange: false };

    	me.title = NP.Translator.translate('Header');

    	me.translateText();

    	me.defaults = { layout: 'form' };
    	me.items = [
    		{
				xtype : 'shared.invoicepo.viewheaderpickers',
				flex  : 1
    		},{
				xtype   : 'container',
				flex    : 1,
				margin  : '0 16 0 0',
				defaults: defaultColCfg,
				items   : me.buildCol2Items()
    		},{
				xtype   : 'container',
				itemId  : 'poServiceFieldContainer',
				flex    : 1,
				hidden  : true,
				defaults: defaultColCfg,
				items   : [{ xtype:'component', html: '' }]
    		}
    	];

    	me.callParent(arguments);
    },

    buildCol2Items: function() {
    	var me   = this,
    		items = [
				{
					xtype     : 'datefield',
					fieldLabel: this.createdOnLbl,
					name      : 'purchaseorder_created',
					readOnly  : true
				},{
					xtype     : 'displayfield',
					fieldLabel: this.createdByLbl,
					name      : 'userprofile_username'
				}
			];

		if (NP.Security.hasPermission(6008)) {
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
					name      : 'purchaseorder_NeededBy_datetm'
				}
			);
		}

		if (NP.Security.hasPermission(6045) && NP.Config.getSetting('PN.POOptions.POPostDate', '0') == 1) {
			items.push({
				xtype       : 'customcombo',
				fieldLabel  : this.poPeriodLbl,
				name        : 'purchaseorder_period',
				displayField: 'accounting_period_display',
				valueField  : 'accounting_period',
				allowBlank  : false,
				store       : Ext.create('Ext.data.Store', {
					fields: [
						{ name: 'accounting_period_display' },
				        { name: 'accounting_period' }
				    ]
				})
			});
		}

		if (NP.Config.getSetting('CP.RECEIVING_ON', '0') == 1) {
			items.push({
				xtype        : 'customcombo',
				fieldLabel   : NP.Translator.translate('Receipt Required'),
				name         : 'purchaseorder_rct_req',
				displayField : 'name',
				valueField   : 'val',
				hidden       : true,
				store        : Ext.create('Ext.data.Store', {
								fields: ['name','val'],
								data: [{ name: 'Yes', val: 1 }, { name: 'No', val: 0 }]
							})
			});

			if (NP.Config.getSetting('RECEIVING_FINALREVIEW', '0') == 1) {
				items.push({
					xtype     : 'displayfield',
					fieldLabel: NP.Translator.translate('Final Review'),
					name      : 'purchaseorder_rct_canReceive',
					hidden    : true,
					renderer  : function(val) {
						if (val == 1) {
							return 'Yes';
						}

						return 'No';
					}
				});
			}
		}

		if (NP.Config.getSetting('PN.POOptions.templateAssociation', '') == 'Header') {
			items.push({
				xtype        : 'customcombo',
				fieldLabel   : NP.Translator.translate('PO Terms'),
				itemId       : 'poview_print_template_id',
				name         : 'print_template_id',
				displayField : 'Print_Template_Name',
				valueField   : 'Print_Template_Id',
				allowBlank   : false,
				useSmartStore: true,
				store        : {
					type       : 'system.printtemplates',
					service    : 'PrintTemplateService',
					action     : 'getByFilter',
					extraParams: { property_id: 0 }
				}
			});
		}

		return items;
    },

    translateText: function() {
    	var me = this,
    		periodText = NP.Config.getSetting('PN.General.postPeriodTerm', 'Post Period');

		me.createdOnLbl   = NP.Translator.translate('Created On');
		me.createdByLbl   = NP.Translator.translate('Created By');
		me.remitAdviceLbl = NP.Translator.translate('Remittance Advice');
		me.priorityLbl    = NP.Translator.translate('Priority');
		me.neededByLbl    = NP.Translator.translate('Needed By');
		me.poPeriodLbl    = NP.Translator.translate('PO {postPeriod}', { postPeriod: periodText });
    }
});