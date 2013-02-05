Ext.define('NP.view.invoice.InvoiceLineForm', function() {
	
	return {
		extend: 'Ext.form.Panel',
		alias: 'widget.invoicelineform',
		
		requires: [
			'Ux.ui.ComboBox'
			,'NP.core.Config'
		],
		
		border: 0,
		
		defaults: {
			style: 'margin: 8px'
		},
		
		buttons: [
			{ text: 'Save' },
			{ itemId: 'invoiceLineFormCancelBtn', text: 'Cancel' }
		],
		
		buildView: function(invoiceRec, invoiceItemRec) {
			var items = [
				{
					xtype: 'fieldcontainer',
					layout: 'form',
					items: []
				},{
					xtype: 'panel',
					title: 'Item Details',
					items: [
						{
							layout: 'column',
							border: 0,
							defaults: {
								style: 'margin: 8px'
							},
							items: []
						},
						{
							layout: 'column',
							border: 0,
							defaults: {
								style: 'margin: 8px'
							},
							items: []
						},
						{
							layout: 'column',
							border: 0,
							defaults: {
								style: 'margin: 8px'
							},
							items: []
						}
					]
				}
			];
			
			// Add property field to the form
			items[0].items.push({
				xtype: 'customcombo',
				type: 'autocomplete',
				itemId: 'property_id',
				fieldLabel: NP.core.Config.getSetting('PN.main.PropertyLabel', 'Property'),
				labelAlign: 'top',
				name: 'property_id',
				store: Ext.create('NP.store.invoice.LineProperties'),
				queryParam: 'property_keyword',
				allowBlank: false,
				displayField: 'property_name',
				valueField: 'property_id',
				defaultRec: {
					property_id: invoiceItemRec.get('property_id'),
					property_name: invoiceItemRec.get('property_name')
				},
				minChars: 1,
				listConfig: {
					loadingText: 'Searching...',
					emptyText: 'No matching ' + NP.core.Config.getSetting('PN.main.PropertyLabel', 'Property') + ' found.'
				},
				dependentCombos: ['unit_id','glaccount_id']
			});
			
			// Add unit field to the form if units are turned on
			if ( NP.core.Config.getSetting('PN.InvoiceOptions.AllowUnitAttach', 0) ) {
				var unitStore = Ext.create('NP.store.PropertyUnits');
				unitStore.load({
					params: { property_id: invoiceItemRec.get('property_id') }
				});
				items[0].items.push({
					xtype: 'customcombo',
					itemId: 'unit_id',
					name: 'unit_id',
					fieldLabel: 'Unit',
					labelAlign: 'top',
					store: unitStore,
					displayField: 'unit_number',
					valueField: 'unit_id',
					value: invoiceItemRec.get('unit_id')
				});
			}
			
			// Add Qty, Unit Price, and Description to second row
			items[1].items[0].items.push({
				xtype: 'numberfield',
				columnWidth: 0.15,
				name: 'invoiceitem_qty',
				fieldLabel: 'Qty',
				labelAlign: 'top',
				value: invoiceItemRec.get('invoiceitem_quantity'),
				allowDecimals: true,
				decimalPrecision: 4
			},{
				xtype: 'numberfield',
				columnWidth: 0.15,
				name: 'invoiceitem_unitprice',
				fieldLabel: 'Price',
				labelAlign: 'top',
				value: invoiceItemRec.get('invoiceitem_unitprice'),
				allowDecimals: true,
				decimalPrecision: 4
			},{
				xtype: 'textfield',
				columnWidth: 0.6,
				name: 'invoiceitem_description',
				fieldLabel: 'Description',
				labelAlign: 'top',
				value: invoiceItemRec.get('invoiceitem_description')
			});
			
			// Add Sales Tax, Amount, and GL Account to third row
			items[1].items[1].items.push({
				xtype: 'checkbox',
				columnWidth: 0.15,
                fieldLabel: 'Sales Tax?',
                name      : 'invoiceitem_taxflag',
                inputValue: 'Y',
                value: invoiceItemRec.get('invoiceitem_taxflag')
            },{
				xtype: 'numberfield',
				columnWidth: 0.15,
				name: 'invoiceitem_amount',
				fieldLabel: 'Total',
				labelAlign: 'top',
				value: invoiceItemRec.get('invoiceitem_amount'),
				allowDecimals: true,
				decimalPrecision: 4,
				editable: false
			},{
				xtype: 'customcombo',
				type: 'autocomplete',
				columnWidth: 0.6,
				itemId: 'glaccount_id',
				name: 'glaccount_id',
				fieldLabel: 'GL Account',
				labelAlign: 'top',
				store: Ext.create('NP.store.invoice.LineGLs'),
				queryParam: 'glaccount_keyword',
				allowBlank: false,
				displayField: 'glaccount_fullname',
				valueField: 'glaccount_id',
				defaultRec: {
					glaccount_id: invoiceItemRec.get('glaccount_id'),
					glaccount_name: invoiceItemRec.get('glaccount_name'),
					glaccount_number: invoiceItemRec.get('glaccount_number')
				},
				extraParams: {
					vendorsite_id: invoiceRec.get('vendorsite_id'),
					property_id: invoiceItemRec.get('property_id')
				},
				minChars: 1,
				listConfig: {
	                loadingText: 'Searching...',
	                emptyText: 'No matching GL Accounts found.'
	           }
			});
			
			// Add Item Number and Unit of Measurement to fourth row
			items[1].items[2].items.push({
				xtype: 'textfield',
				columnWidth: 0.3,
				name: 'vcitem_number',
				fieldLabel: 'Item Number',
				labelAlign: 'top',
				value: invoiceItemRec.get('vcitem_number')
			},{
				xtype: 'textfield',
				columnWidth: 0.6,
				name: 'vcitem_uom',
				fieldLabel: 'Unit of Measurement',
				labelAlign: 'top',
				value: invoiceItemRec.get('vcitem_uom')
			});
			
			// If job costing is on, add relevant fields
			if (NP.core.Config.getSetting('PN.jobcosting.jobcostingEnabled') && NP.core.Security.hasPermission(2047)) {
				items.push({
					xtype: 'panel',
					title: 'Job Costing',
					items: { layout: 'form', style: 'margin: 8px', border:0, items: [] }
				});
				
				var row = items.length-1;
				if (NP.core.Config.getSetting('pn.jobcosting.useContracts')) {
					items[row].items.items.push({
						xtype: 'customcombo',
						type: 'autocomplete',
						itemId: 'jbcontract_id',
						fieldLabel: NP.core.Config.getSetting('PN.jobcosting.contractTerm'),
						labelAlign: 'top',
						name: 'jbcontract_id',
						store: Ext.create('NP.store.jobcosting.JBContracts'),
						queryParam: 'jbcontract_keyword',
						displayField: 'jbcontract_name',
						valueField: 'jbcontract_id',
						defaultRec: {
							jbcontract_id: invoiceItemRec.get('jbcontract_id'),
							jbcontract_name: invoiceItemRec.get('jbcontract_name'),
							jbcontract_desc: invoiceItemRec.get('jbcontract_desc')
						},
						extraParams: {
							vendorsite_id: invoiceRec.get('vendorsite_id')
						},
						minChars: 1,
						listConfig: {
							loadingText: 'Searching...',
							emptyText: 'No matching ' + NP.core.Config.getSetting('PN.jobcosting.contractTerm') + ' found.'
						},
						hidden: false,
						dependentCombos: ['jbchangeorder_id','jbphasecode_id']
					});
				}
				
				if (NP.core.Config.getSetting('JB_UseChangeOrders')) {
					items[row].items.items.push({
						xtype: 'customcombo',
						type: 'autocomplete',
						itemId: 'jbchangeorder_id',
						fieldLabel: NP.core.Config.getSetting('PN.jobcosting.changeOrderTerm'),
						labelAlign: 'top',
						name: 'jbchangeorder_id_',
						store: Ext.create('NP.store.jobcosting.JBChangeOrders'),
						queryParam: 'jbchangeorder_keyword',
						displayField: 'jbchangeorder_name',
						valueField: 'jbchangeorder_id',
						defaultRec: {
							jbchangeorder_id: invoiceItemRec.get('jbchangeorder_id'),
							jbchangeorder_name: invoiceItemRec.get('jbchangeorder_name'),
							jbchangeorder_desc: invoiceItemRec.get('jbchangeorder_desc')
						},
						minChars: 1,
						listConfig: {
							loadingText: 'Searching...',
							emptyText: 'No matching ' + NP.core.Config.getSetting('PN.jobcosting.changeOrderTerm') + ' found.'
						},
						hidden: false,
						dependentCombos: ['jbphasecode_id']
					});
				}
				
				if (NP.core.Config.getSetting('pn.jobcosting.useJobCodes')) {
					items[row].items.items.push({
						xtype: 'customcombo',
						type: 'autocomplete',
						itemId: 'jbjobcode_id',
						fieldLabel: NP.core.Config.getSetting('PN.jobcosting.jobCodeTerm'),
						labelAlign: 'top',
						name: 'jbjobcode_id_',
						store: Ext.create('NP.store.jobcosting.JBJobCodes'),
						queryParam: 'jbjobcode_keyword',
						allowBlank: false,
						displayField: 'jbjobcode_name',
						valueField: 'jbjobcode_id',
						defaultRec: {
							jbjobcode_id: invoiceItemRec.get('jbjobcode_id'),
							jbjobcode_name: invoiceItemRec.get('jbjobcode_name'),
							jbjobcode_desc: invoiceItemRec.get('jbjobcode_desc')
						},
						extraParams: {
							property_id: invoiceItemRec.get('property_id')
						},
						minChars: 1,
						listConfig: {
							loadingText: 'Searching...',
							emptyText: 'No matching ' + NP.core.Config.getSetting('PN.jobcosting.jobCodeTerm') + ' found.'
						},
						hidden: false,
						dependentCombos: ['jbphasecode_id']
					});
				}
				
				if (NP.core.Config.getSetting('JB_UsePhaseCodes')) {
					var allowBlankPhase = (NP.core.Config.getSetting('PN.jobcosting.phaseCodeReq', 0)) ? false : true;
					items[row].items.items.push({
						xtype: 'customcombo',
						type: 'autocomplete',
						itemId: 'jbphasecode_id',
						fieldLabel: NP.core.Config.getSetting('PN.jobcosting.phaseCodeTerm'),
						labelAlign: 'top',
						name: 'jbphasecode_id_',
						store: Ext.create('NP.store.jobcosting.JBPhaseCodes'),
						queryParam: 'jbphasecode_keyword',
						allowBlank: allowBlankPhase,
						displayField: 'jbphasecode_name',
						valueField: 'jbphasecode_id',
						defaultRec: {
							jbphasecode_id: invoiceItemRec.get('jbphasecode_id'),
							jbphasecode_name: invoiceItemRec.get('jbphasecode_name'),
							jbphasecode_desc: invoiceItemRec.get('jbphasecode_desc')
						},
						minChars: 1,
						listConfig: {
							loadingText: 'Searching...',
							emptyText: 'No matching ' + NP.core.Config.getSetting('PN.jobcosting.phaseCodeTerm') + ' found.'
						},
						hidden: false,
						dependentCombos: ['jbcostcode_id']
					});
				}
				
				if (NP.core.Config.getSetting('pn.jobcosting.useCostCodes')) {
					items[row].items.items.push({
						xtype: 'customcombo',
						type: 'autocomplete',
						itemId: 'jbcostcode_id',
						fieldLabel: NP.core.Config.getSetting('PN.jobcosting.costCodeTerm'),
						labelAlign: 'top',
						name: 'jbcostcode_id_',
						store: Ext.create('NP.store.jobcosting.JBCostCodes'),
						queryParam: 'jbcostcode_keyword',
						allowBlank: false,
						displayField: 'jbcostcode_name',
						valueField: 'jbcostcode_id',
						defaultRec: {
							jbcostcode_id: invoiceItemRec.get('jbcostcode_id'),
							jbcostcode_name: invoiceItemRec.get('jbcostcode_name'),
							jbcostcode_desc: invoiceItemRec.get('jbcostcode_desc')
						},
						minChars: 1,
						listConfig: {
							loadingText: 'Searching...',
							emptyText: 'No matching ' + NP.core.Config.getSetting('PN.jobcosting.costCodeTerm') + ' found.'
						},
						hidden: false
					});
				}
			}
			
			this.add(items);
		}
	}
}());