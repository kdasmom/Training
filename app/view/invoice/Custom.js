Ext.define('NP.view.invoice.Custom', {
	extend: 'Ext.panel.Panel',
	mixins: [ 'Deft.mixin.Injectable' ],
	alias: 'widget.invoiceCustom',
	
	inject: ['app'],
	
	requires: ['Ux.ui.CustomCombo','NP.core.Config'],
	
	title: 'Custom Fields',
	
	layout: 'hbox',
	
	items: [
		{
			xtype: 'fieldcontainer',
			layout: 'form',
			flex: 1,
			itemId: 'invCustomCol1',
			style: 'margin: 8px'
		},
		{
			xtype: 'fieldcontainer',
			layout: 'form',
			flex: 1,
			itemId: 'invCustomCol2',
			style: 'margin: 8px'
		}
	],
	
	buildView: function(position, entity, rec) {
		var customFields = NP.core.Config.getCustomFields();
		
		var cols = { 1: [], 2: [] };
		var cFields = customFields[position];
		var col = 1, fieldsShown = 0;
		var cfg;
		
		// Loop through all the custom fields
		for (var i=1; i<=8; i++) {
			var field = cFields.fields[i];
			// If the custom field is on, add it to the list to be rendered
			if (field[entity+'On']) {
				// Default field configuration
				cfg = {
					fieldLabel: field.label,
					labelAlign: 'top',
					name: 'universal_field'+field.fieldNumber,
					allowBlank: (field[entity+'Required']) ? false : true
				};
				
				// Configuration for a select/combo custom feld
				if (field.type == 'select') {
					var comboStore = Ext.create('NP.store.PNUniversalFields');
					
					comboStore.load({
						params: {
							universal_field_number: field.fieldNumber, 
							isLineItem: 0
						}
					});
					
					Ext.apply(cfg, {
						xtype: 'customcombo',
						store: comboStore,
						displayField: 'universal_field_data',
						valueField: 'universal_field_data',
						tpl: new Ext.XTemplate('<tpl for=".">' + '<li style="height:22px;" class="x-boundlist-item" role="option">' + '{universal_field_data}' + '</li></tpl>')
					});
				// Configuration for a date custom field
				} else if (field.type == 'date') {
					Ext.apply(cfg, {
						xtype: 'date'
					});
				// Configuration for a text custom field
				} else if (field.type == 'text') {
					Ext.apply(cfg, {
						xtype: 'textfield',
						maxLength: field.maxlength[rec.get('integration_package_id')],
						maxLengthText: 'You cannot enter more than {0} characters',
						enforceMaxLength: true
					});
				}
				// Add the field to its column
				cols[col].push(cfg);
				
				fieldsShown++;
				
				// If we've outputted half the fields in the first column, move to the second column
				if (fieldsShown % Math.ceil(cFields[entity+'OnCount'] / 2) == 0) {
					col++;
				}
			}
		}
		
		var col1 = Ext.ComponentQuery.query('#invCustomCol1')[0];
		var col2 = Ext.ComponentQuery.query('#invCustomCol2')[0];
		
		col1.add(cols[1]);
		col2.add(cols[2]);
	}
});