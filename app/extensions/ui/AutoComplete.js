Ext.define('Ux.ui.AutoComplete', {
	extend : 'Ux.ui.CustomCombo',
	alias : 'widget.autocomplete',
	
	constructor: function(cfg) {
		Ext.applyIf(cfg, {
			queryMode: 'remote',
			typeAhead: false,
			forceSelection: true,
			hideTrigger:true,
			tpl: new Ext.XTemplate('<tpl for=".">' + '<li style="height:22px;" class="x-boundlist-item" role="option">' + '{'+cfg.displayField+'}' + '</li></tpl>'),
			listeners: {} 
		});
		
		Ext.apply(cfg.listeners, {
			keyup: function(field) {
				var val = field.getRawValue();
				if (val === '' || val === null) {
					field.clearValue();
				}
			},
			beforerender: function(combo) {
				// Add a blank record to the store
				combo.getStore().addListener('load', function(store) {
					var rec = {};
					rec[combo.displayField] = '';
					rec[combo.valueField] = '';
					combo.getStore().insert(0, rec);
				});
				
				if ('defaultRec' in combo) {
					// Add the current value to the store, otherwise you have an empty store
					combo.getStore().add(combo.defaultRec);
					
					// Set the current value
					combo.setValue( combo.defaultRec[combo.valueField] );
				}
				
				if ('extraParams' in combo) {
					var proxy = combo.getStore().getProxy();
					Ext.apply(proxy.extraParams, combo.extraParams);
				}
			}
		});
		
		if (cfg.dependentCombos) {
			Ext.apply(cfg.listeners, {
				select: function(combo, recs) {
					for (var i=0; i<cfg.dependentCombos.length; i++) {
						var combo = Ext.ComponentQuery.query('#'+cfg.dependentCombos[i]);
						if (combo.length) {
							combo = combo[0];
							var store = combo.getStore();
							var proxy = store.getProxy();
							proxy.extraParams[cfg.valueField] = recs[0].get(cfg.valueField);
							store.load();
						}
					}
				}
			})
		}
		
		this.callParent(arguments);
	}
});