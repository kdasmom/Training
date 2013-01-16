Ext.define('NP.view.invoice.Header', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.invoiceHeader',
	
	requires: ['Ux.ui.AutoComplete','NP.core.Config'],
	
	layout: 'hbox',
	
	items: [
		// First column only shows the vendor combo box (dynamically below)
		{
			xtype: 'fieldcontainer',
			layout: 'form',
			flex: 1,
			itemId: 'invHeaderCol1',
			style: 'margin: 8px'
		},
		// Second column displays a bunch of fields, one of which is dynamically added at render time if needed
		{
			xtype: 'fieldcontainer',
			flex: 1,
			itemId: 'invHeaderCol2',
			style: 'margin: 8px',
			items: [
				{
					xtype: 'textfield',
					name: 'invoice_ref',
					fieldLabel: 'Invoice Number',
					allowBlank: false
				},
				{
					xtype: 'datefield',
					name: 'invoice_datetm',
					fieldLabel: 'Invoice Date',
					allowBlank: false
				},
				{
					xtype: 'datefield',
					name: 'invoice_duedate',
					fieldLabel: 'Due On',
					allowBlank: false
				},
				{
					xtype: 'displayfield',
					fieldLabel: 'Created On',
					name: 'invoice_createddatetm',
					renderer: Ext.util.Format.dateRenderer('m/d/Y')
				},
				{
					xtype: 'displayfield',
					fieldLabel: 'Created By',
					name: 'userprofile_username'
				}
				// Paid By field is dynamically placed here by code below
			]
		},
		// Third column has mostly fields that need to be added dynamically because they depend on permissions,
		// so we do it all programatically below
		{
			xtype: 'fieldcontainer',
			flex: 1,
			itemId: 'invHeaderCol3',
			style: 'margin: 8px'
		}
	],
	
	// This function is called by the Invoice controller once all data needed has been loaded
	buildView: function(invoiceRec, startDate, endDate, associatedPOStore) {
		var col1 = Ext.ComponentQuery.query('#invHeaderCol1')[0];
		var col2 = Ext.ComponentQuery.query('#invHeaderCol2')[0];
		var col3 = Ext.ComponentQuery.query('#invHeaderCol3')[0];
		
		col1.add({
			xtype: 'autocomplete',
			itemId:'invVendorCombo',
			fieldLabel: 'Vendor',
			labelAlign: 'top',
			name: 'vendorsite_id',
			store: Ext.create('NP.store.VendorComboStore'),
			queryParam: 'vendor_name',
			allowBlank: false,
			displayField: 'vendor_name',
			valueField: 'vendorsite_id',
			defaultRec: {
				vendorsite_id: invoiceRec.get('vendorsite_id'),
				vendor_id_alt: invoiceRec.get('vendor_id_alt'),
				vendor_name: invoiceRec.get('vendor_name')
			},
			extraParams: {
				property_id: invoiceRec.get('property_id')
			},
			minChars: 3,
			listConfig: {
                loadingText: 'Searching...',
                emptyText: 'No matching vendors found.',

                // Custom rendering template for each item
                getInnerTpl: function() {
                    return '{vendor_name} ({vendor_id_alt})';
                }
            }
		});
		
		// Conditionally add the pay by field depending on settings
		if ( NP.core.Config.getSetting('CP.INVOICE_PAY_BY_FIELD') == 1 ) {
			var paybyStore = Ext.create('NP.store.InvoicePaymentTypes');
			paybyStore.load();
			
			col2.add({
				xtype: 'customcombo',
				fieldLabel: 'Pay By',
				name: 'invoicepayment_type_id',
				displayField: 'data',
				valueField: 'id',
				store: paybyStore
			});
		}
		
		// Add the Invoice Total field
		var col3Items = [{
			xtype: 'numberfield',
			name: 'control_amount',
			fieldLabel: 'Invoice Total',
			allowBlank: true
		}];
		
		// Conditionally add the period field
		if ( NP.core.Security.hasPermission(2082) && NP.core.Config.getSetting('PN.InvoiceOptions.InvoicePostDate') == 1) {
			var loopEnd = NP.core.Util.dateDiff('m', endDate, startDate);
			
			var periodData = [], currentDate = startDate;
			periodData.push({
				invoice_period: '',
				invoice_period_display: ''
			});
			for (var i=0; i<=loopEnd; i++) {
				currentDate = Ext.Date.add(startDate, Ext.Date.MONTH, i);
				periodData.push({
					invoice_period: Ext.Date.format(currentDate, 'm/d/Y'),
					invoice_period_display: Ext.Date.format(currentDate, 'm/Y')
				});
			}
			var periodStore = Ext.create('Ext.data.Store', {
				fields: ['invoice_period','invoice_period_display'],
				data: periodData
			});
			
			col3Items.push({
				xtype: 'customcombo',
				itemId: 'invoice_period',
				fieldLabel: 'Invoice ' + NP.core.Config.getSetting('PN.General.postPeriodTerm'),
				name: 'invoice_period',
				displayField: 'invoice_period_display',
				valueField: 'invoice_period',
				store: periodStore
			});
		}
		
		// Add Remittance Advice field
		if (invoiceRec.get('invoice_status') == 'Paid') {
			col3Items.push({
				xtype: 'displayfield',
				fieldLabel: 'Remittance Advice',
				name: 'remit_advice',
				renderer: function(val) {
					return (val == 1) ? 'Yes' : 'No'
				}
			});
		} else {
			col3Items.push({
				xtype: 'checkbox',
				fieldLabel: 'Remittance Advice',
				name: 'remit_advice'
			});
		}
		
		// Add Priority and Needed By fields
		if ( NP.core.Security.hasPermission(6007) ) {
			var priorityStore = Ext.create('NP.store.PriorityFlags');
			priorityStore.load();
			
			col3Items.push({
				xtype: 'customcombo',
				fieldLabel: 'Priority',
				name: 'priorityflag_id_alt',
				displayField: 'data',
				valueField: 'id',
				store: priorityStore
			});
			
			col3Items.push({
				xtype: 'datefield',
				name: 'invoice_neededby_datetm',
				fieldLabel: 'Needed By',
				allowBlank: true
			});
		}
		
		// Add Associated POs field
		if (NP.core.Security.hasPermission(1026)) {
			col3Items.push({
				xtype: 'displayfield',
				fieldLabel: 'Associated POs',
				renderer: function() {
					if (associatedPOStore.getTotalCount() == 0) {
						return 'None';
					} else {
						var val = '';
						associatedPOStore.each(function(rec) {
							val += '<div>' + rec.get('purchaseorder_ref') + '</div>';
						});
						return val;
					}
				}
			});
		}
		
		// Add Vendor Code field
		if ( NP.core.Config.getSetting('PN.InvoiceOptions.AllowVendorCode') == 1 ) {
			col3Items.push({
				xtype: 'textfield',
				name: 'vendor_code',
				fieldLabel: 'Vendor Code',
				allowBlank: true,
				cls: 'expandableField',
				hidden: true
			});
		}
		
		// Add all items to the third column
		col3.add(col3Items);
	}
});