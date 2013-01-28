Ext.define('Ux.ui.ComboBox', {
	extend : 'Ext.form.field.ComboBox',
	alias : 'widget.customcombo',
	
	constructor: function(cfg) {
		Ext.applyIf(cfg, {
		  type: 'normal'
		});

		var defaultCfg = {
			forceSelection: true,
			tpl: new Ext.XTemplate('<tpl for=".">' + '<li style="height:22px;" class="x-boundlist-item" role="option">' + '{'+cfg.displayField+'}' + '</li></tpl>'),
			listeners: {} 
		};
		if (cfg.type == 'autocomplete') {
			Ext.apply(defaultCfg, {
				queryMode: 'remote',
				typeAhead: false,
				hideTrigger:true
			});
		} else {
			Ext.apply(defaultCfg, {
				queryMode: 'local',
				typeAhead: true,
				allowOnlyWhitespace: true,
				editable: true
			});
		}
		Ext.applyIf(cfg, defaultCfg);
		
		Ext.apply(cfg.listeners, {
			keyup: function(field) {
				var val = field.getRawValue();
				if (val === '' || val === null) {
					field.clearValue();
				}
			}
		});

		if (cfg.type == 'autocomplete') {
			Ext.apply(cfg.listeners, {
				beforerender: function(combo) {
					// Add a blank record to the store
					combo.getStore().addListener('load', function(store) {
						var rec = {};
						rec[combo.displayField] = '';
						rec[combo.valueField] = '';
						store.insert(0, rec);
					});
					
					if ('defaultRec' in combo) {
						// Add the current value to the store, otherwise you have an empty store
						combo.getStore().add(combo.defaultRec);
						
						// Suspend events briefly to prevent change events from firing
						combo.suspendEvents(false);
						// Set the current value
						combo.setValue( combo.defaultRec[combo.valueField] );
						// Re-enable events
						combo.resumeEvents();
					}
					
					if ('extraParams' in combo) {
						var proxy = combo.getStore().getProxy();
						Ext.apply(proxy.extraParams, combo.extraParams);
					}
				}
			});
		} else {
			Ext.apply(cfg.listeners, {
				beforerender: function(combo) {
					// Add a blank record to the store
					combo.getStore().addListener('load', function(store) {
						var rec = {};
						rec[combo.displayField] = '';
						rec[combo.valueField] = '';
						store.insert(0, rec);
					});
				}
			});
		}

		// If selectFirstRecord option is included, select the first record when the field loads if value is blank
		if (cfg.selectFirstRecord) {
			Ext.apply(cfg.listeners, {
				afterrender: function(combo) {
					// Get the store associated to this combo box
					var store = combo.getStore();
					if (!cfg.value || store.find(cfg.valueField, cfg.value) == -1) {
						// Suspend events briefly to prevent change events from firing
						combo.suspendEvents(false);
						// Set the combo to the first value in the store
						combo.setValue(store.getAt(0));
						// Re-enable events
						combo.resumeEvents();
					}
				}
			});
		}

		// If dependent combos are specified, add a select event to update them when the value of their parent combo is changed
		if (cfg.dependentCombos) {
			// If a function was already set for the select event, we need to make sure we still call it
			var origSelect = (cfg.listeners.select) ? cfg.listeners.select : function() {};
			Ext.apply(cfg.listeners, {
				select: function(combo, recs) {
					// Call the function originally set for that event
					origSelect(combo, recs);

					for (var i=0; i<cfg.dependentCombos.length; i++) {
						var combo = Ext.ComponentQuery.query('#'+cfg.dependentCombos[i]);
						if (combo.length) {
							combo = combo[0];
							var store = combo.getStore();
							if (combo.queryMode == 'remote') {
								var proxy = store.getProxy();
								proxy.extraParams[cfg.valueField] = recs[0].get(cfg.valueField);
								store.load();
							} else {
								store.clearFilter(true);
								store.filter(cfg.valueField, recs[0].get(cfg.valueField));
							}
						}
					}
				}
			});
		}
		
		this.callParent(arguments);
	}
});