Ext.define('NP.view.invoice.Lines', function() {
	// Private variables
	var lineCount = 0;
	
	function isUnitOn() {
		return NP.core.Config.getSetting('PN.InvoiceOptions.AllowUnitAttach', 0);
	}
	
	function changeProperty(lineNum, newVal) {
		if (isUnitOn()) {
			var unitCombo = Ext.ComponentQuery.query('#unit_id_' + lineNum)[0];
			unitCombo.getStore().load({
				params: { property_id: newVal }
			});
		}
	}
	
	return {
		extend: 'Ext.panel.Panel',
		alias: 'widget.invoiceLineTable',
		
		requires: [
			'NP.core.Config',
			'NP.model.GLAccount',
			'NP.model.Property',
			'NP.model.Unit',
			'NP.view.invoice.LineRow'
		],
		
		title: 'Line Items',
		
		layout: {
			type: 'vbox',
			align: 'stretch'
		},
		
		buildView: function(invoiceRec, lineStore) {
			var that = this;
			this.addRow(
				'header',
				[
					{ html: '<b>Qty</b>' },
					{ html: '<b>Description</b>' },
					{ html: '<b>GL Account</b>' },
					{ html: '<b>MTD Budget</b>' },
					{ html: '<b>MTD Remaining</b>' },
					{ html: '<b>Item price</b>' },
					{ html: '<b>Amount</b>' },
					{ xtype: 'button', text: 'Add Line', handler: Ext.bind(this.clickAddLine, this, [invoiceRec, lineStore]) }
				]
			);
			
			var that = this;
			lineStore.each(function(rec, i) {
				that.addLine(invoiceRec, rec, i);
			});
			
			lineCount = lineStore.getTotalCount();
		},
		
		addRow: function(rowType, cols) {
			var colFlexValues = [7,35,25,7,7,7,7,5];
			var formattedCols = [];
			for (var i=0; i<cols.length; i++) {
				formattedCols.push({
					layout: {
						type: 'vbox',
						align: 'stretch',
						pack: 'center'
					},
					flex: colFlexValues[i],
					defaults: {
						border: false
					},
					items: cols[i]
				});
			}
			
			this.add({
				xtype: 'invoicelinerow',
				rowType: rowType,
				items: formattedCols
			});
		},
		
		clickAddLine: function(invoiceRec, lineStore) {
			var rec = Ext.create('NP.model.InvoiceItem');
			
			this.addLine(invoiceRec, rec, lineCount);
			
			lineCount++;
		},
		
		addLine: function(invoiceRec, invoiceItemRec, i) {
			// If line is new, use the property from the header
			if (invoiceItemRec.get('invoiceitem_id') == 0) {
				var line_prop_id = invoiceRec.get('property_id');
				var line_prop_name = invoiceRec.get('property_name');
			} else {
				var line_prop_id = invoiceItemRec.get('property_id');
				var line_prop_name = invoiceItemRec.get('property_name');
			}
			
			var qty = {
				xtype: 'numberfield',
				name: 'invoiceitem_qty',
				value: invoiceItemRec.get('invoiceitem_quantity'),
				allowDecimals: true,
				decimalPrecision: 4
			};
			
			var col2 = [];
			col2.push({
				xtype: 'textfield',
				name: 'invoiceitem_description',
				value: invoiceItemRec.get('invoiceitem_description')
			});
			
			// Add a hidden property column that can be expanded if needed
			col2.push({
				xtype: 'autocomplete',
				itemId: 'property_id_' + i,
				fieldLabel: NP.core.Config.getSetting('PN.main.PropertyLabel', 'Property'),
				labelAlign: 'left',
				name: 'property_id',
				store: Ext.create('NP.store.PropertyLineComboStore'),
				queryParam: 'property_keyword',
				allowBlank: false,
				displayField: 'property_name',
				valueField: 'property_id',
				defaultRec: {
					property_id: line_prop_id,
					property_name: line_prop_name
				},
				minChars: 1,
				listConfig: {
					loadingText: 'Searching...',
					emptyText: 'No matching ' + NP.core.Config.getSetting('PN.main.PropertyLabel', 'Property') + ' found.'
				},
				cls: 'expandableLineField' + i,
				hidden: true,
				listeners: {
					select: function(combo, recs) { changeProperty(i, recs[0].get('property_id')); }
				}
			});
			
			if ( isUnitOn() ) {
				var unitStore = Ext.create('NP.store.PropertyUnits');
				unitStore.load({
					params: { property_id: invoiceItemRec.get('property_id') }
				});
				col2.push({
					xtype: 'customcombo',
					itemId: 'unit_id_' + i,
					name: 'unit_id',
					fieldLabel: 'Unit',
					labelAlign: 'left',
					store: unitStore,
					displayField: 'unit_number',
					valueField: 'unit_id',
					value: invoiceItemRec.get('unit_id'),
					cls: 'expandableLineField' + i,
					hidden: true
				});
			}
			
			if (NP.core.Config.getSetting('VC_isOn', 0)) {
				col2.push({
					xtype: 'textfield',
					fieldLabel: 'Item Number',
					labelAlign: 'left',
					name: 'vcitem_number',
					value: invoiceItemRec.get('vcitem_number'),
					cls: 'expandableLineField' + i,
					hidden: true
				});
				
				col2.push({
					xtype: 'textfield',
					fieldLabel: 'UOM',
					labelAlign: 'left',
					name: 'vcitem_uom',
					value: invoiceItemRec.get('vcitem_uom'),
					cls: 'expandableLineField' + i,
					hidden: true
				});
			}
			
			var col3 = [];
			col3.push({
				xtype: 'autocomplete',
				itemId: 'glaccount_id_' + i,
				name: 'glaccount_id',
				store: Ext.create('NP.store.GLComboStore'),
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
					property_id: line_prop_id
				},
				minChars: 1,
				listConfig: {
	                loadingText: 'Searching...',
	                emptyText: 'No matching GL Accounts found.'
	           }
			});
			
			if (NP.core.Config.getSetting('PN.jobcosting.jobcostingEnabled') && NP.core.Security.hasPermission(2047)) {
				if (NP.core.Config.getSetting('pn.jobcosting.useContracts')) {
					col3.push({
						xtype: 'autocomplete',
						itemId: 'jbcontract_id_' + i,
						fieldLabel: NP.core.Config.getSetting('PN.jobcosting.contractTerm'),
						labelAlign: 'left',
						name: 'jbcontract_id_',
						store: Ext.create('NP.store.JBContracts'),
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
						cls: 'expandableLineField' + i,
						hidden: true,
						listeners: {
							select: function(combo, recs) {
								var val = combo.getValue();
								var changeOrderStore = Ext.ComponentQuery.query('#jbchangeorder_id_' + i);
								if (changeOrderStore.length) {
									changeOrderStore[0].getStore().getProxy().extraParams.jbcontract_id = val;
								}
								var phaseCodeStore = Ext.ComponentQuery.query('#jbphasecode_id_' + i);
								if (phaseCodeStore.length) {
									phaseCodeStore[0].getStore().getProxy().extraParams.jbcontract_id = val;
								}
							}
						}
					});
				}
				
				if (NP.core.Config.getSetting('JB_UseChangeOrders')) {
					col3.push({
						xtype: 'autocomplete',
						itemId: 'jbchangeorder_id_' + i,
						fieldLabel: NP.core.Config.getSetting('PN.jobcosting.changeOrderTerm'),
						labelAlign: 'left',
						name: 'jbchangeorder_id_',
						store: Ext.create('NP.store.JBChangeOrders'),
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
						cls: 'expandableLineField' + i,
						hidden: true,
						listeners: {
							select: function(combo, recs) {
								var phaseCodeStore = Ext.ComponentQuery.query('#jbphasecode_id_' + i);
								if (phaseCodeStore.length) {
									phaseCodeStore[0].getStore().getProxy().extraParams.jbchangeorder_id = combo.getValue();
								}
							}
						}
					});
				}
				
				if (NP.core.Config.getSetting('pn.jobcosting.useJobCodes')) {
					col3.push({
						xtype: 'autocomplete',
						itemId: 'jbjobcode_id_' + i,
						fieldLabel: NP.core.Config.getSetting('PN.jobcosting.jobCodeTerm'),
						labelAlign: 'left',
						name: 'jbjobcode_id_',
						store: Ext.create('NP.store.JBJobCodes'),
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
							property_id: line_prop_id
						},
						minChars: 1,
						listConfig: {
							loadingText: 'Searching...',
							emptyText: 'No matching ' + NP.core.Config.getSetting('PN.jobcosting.jobCodeTerm') + ' found.'
						},
						cls: 'expandableLineField' + i,
						hidden: true,
						listeners: {
							select: function(combo, recs) {
								var phaseCodeStore = Ext.ComponentQuery.query('#jbphasecode_id_' + i);
								if (phaseCodeStore.length) {
									phaseCodeStore[0].getStore().getProxy().extraParams.jbjobcode_id = combo.getValue();
								}
							}
						}
					});
				}
				
				if (NP.core.Config.getSetting('JB_UsePhaseCodes')) {
					var allowBlankPhase = (NP.core.Config.getSetting('PN.jobcosting.phaseCodeReq', 0)) ? false : true;
					col3.push({
						xtype: 'autocomplete',
						itemId: 'jbphasecode_id_' + i,
						fieldLabel: NP.core.Config.getSetting('PN.jobcosting.phaseCodeTerm'),
						labelAlign: 'left',
						name: 'jbphasecode_id_',
						store: Ext.create('NP.store.JBPhaseCodes'),
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
						cls: 'expandableLineField' + i,
						hidden: true,
						listeners: {
							select: function(combo, recs) {
								var costCodeStore = Ext.ComponentQuery.query('#jbcostcode_id_' + i);
								if (costCodeStore.length) {
									costCodeStore[0].getStore().getProxy().extraParams.jbphasecode_id = combo.getValue();
								}
							}
						}
					});
				}
				
				if (NP.core.Config.getSetting('pn.jobcosting.useCostCodes')) {
					col3.push({
						xtype: 'autocomplete',
						itemId: 'jbcostcode_id_' + i,
						fieldLabel: NP.core.Config.getSetting('PN.jobcosting.costCodeTerm'),
						labelAlign: 'left',
						name: 'jbcostcode_id_',
						store: Ext.create('NP.store.JBCostCodes'),
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
						cls: 'expandableLineField' + i,
						hidden: true,
						listeners: {
							select: function(combo, recs) {  }
						}
					});
				}
				
				if (NP.core.Config.getSetting('pn.jobcosting.useRetention')) {
					
				}
			}
			
			var mtdBudget = {
				html: Ext.util.Format.usMoney(invoiceItemRec.get('budget_amount'))
			};
			
			var mtdRemaining = {
				html: Ext.util.Format.usMoney(invoiceItemRec.get('budget_variance'))
			};
			
			var price = {
				xtype: 'numberfield',
				name: 'invoiceitem_unitprice',
				value: invoiceItemRec.get('invoiceitem_unitprice'),
				allowDecimals: true,
				decimalPrecision: 4
			};
			
			var amount = {
				html: Ext.util.Format.usMoney(invoiceItemRec.get('invoiceitem_amount'))
			};
			
			var toggleBtn = {
				xtype: 'button',
				itemId: 'toggle_btn_' + i,
				text: 'Expand',
				handler: Ext.bind(this.toggleLine, this, [i])
			}
			
			// Add the row
			this.addRow('line', [
				qty, 
				col2, 
				col3, 
				mtdBudget, 
				mtdRemaining, 
				price, 
				amount, 
				toggleBtn
			]);
		},
		
		toggleLine: function(lineNum) {
			var btn = Ext.ComponentQuery.query('#toggle_btn_' + lineNum)[0];
			var expandables = Ext.ComponentQuery.query('invoiceLineTable component[cls=expandableLineField' + lineNum + ']');
			
			if (btn.getText() == 'Expand') {
				var visible = true;
				var btnTxt = 'Collapse';
			} else {
				var visible = false;
				var btnTxt = 'Expand';
			}
			
			// Loop through all hidden elements that need to be shown/hidden and run setVisible
			// (disable layouts first for better performance, then resume after all elements are done)
			Ext.suspendLayouts();
			Ext.each(expandables, function(comp) {
				comp.setVisible(visible);
			});
			Ext.resumeLayouts(true);
			
			btn.setText(btnTxt);
		}
	};
});