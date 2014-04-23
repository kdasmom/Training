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
    	'Ext.form.field.Date'
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
				flex  : 1
    		},{
				xtype   : 'container',
				flex    : 1,
				margin  : '0 16 0 0',
				defaults: { labelWidth: 130, validateOnBlur: false, validateOnChange: false },
				items   : me.buildCol2Items()
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

		if (NP.Config.getSetting('PN.POOptions.templateAssociation', 'Header'))

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