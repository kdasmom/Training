/**
 * The Config class is used to control everything that relates to configuration settings, either at the
 * application level or the user level.
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.ui.ComboBox', {
	extend : 'Ext.form.field.ComboBox',
	alias : 'widget.customcombo',
	
	/**
	 * @cfg {"normal"/"autocomplete"} type The type of ComboBox; can be set to either "normal" or "autocomplete"; defaults to "normal"
	 */
	/**
	 * @cfg {boolean}                 addBlankRecord    Set to true if you want a blank record to be added as the first record of this combo box's store
	 */
	/**
	 * @cfg {boolean}                 selectFirstRecord Set to true if you want the first record of the store to be selected by default
	 */
	/**
	 * @cfg {Array}                   dependentCombos   An array of IDs for combo boxes that depend on this combo; when the value of this combo is changed, the valueField will be added as a parameter to the proxy of the dependent combos specified and reload their stores
	 */
	constructor: function(cfg) {
		Ext.applyIf(cfg, {
		  type: 'normal'
		});

		var defaultCfg = {
			forceSelection: true,
			tpl           : new Ext.XTemplate('<tpl for=".">' + '<li style="height:22px;" class="x-boundlist-item" role="option">' + '{'+cfg.displayField+'}' + '</li></tpl>'),
			listeners     : {},
			addBlankRecord: true 
		};
		if (cfg.type == 'autocomplete') {
			Ext.apply(defaultCfg, {
				queryMode  : 'remote',
				typeAhead  : false,
				hideTrigger:true,
				triggerAction:'query'
			});
		} else {
			Ext.apply(defaultCfg, {
				queryMode          : 'local',
				typeAhead          : true,
				allowOnlyWhitespace: true,
				editable           : true
			});
		}
		Ext.applyIf(cfg, defaultCfg);

		// Key events must be on
		cfg.enableKeyEvents = true;

		this.callParent(arguments);

		// Add keyup listener so that value can be cleared
		this.addListener('keyup', function(combo) {
			var val = combo.getRawValue();
			if (val === '' || val === null) {
				combo.clearValue();
			}
		});

		// If type is autocomplete
		if (cfg.type == 'autocomplete') {
			this.addListener('beforerender', function(combo) {
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
			});
		}

		// If addBlankRecord is true, add a blank record at the beginning of the store to make it easy for the user to select
		// a blank value
		if (cfg.addBlankRecord) {
			this.addListener('beforerender', function(combo) {
				// Add a blank record to the store
				combo.getStore().addListener('load', function(store) {
					var rec = {};
					rec[combo.displayField] = '';
					rec[combo.valueField] = '';
					store.insert(0, rec);
				});
			});
		}

		// If selectFirstRecord option is included, select the first record when the field loads if value is blank
		if (cfg.selectFirstRecord) {
			function selectFirstRec(combo, valueField, value) {
				// Get the store associated to this combo box
				var store = combo.getStore();
				if (!value || store.find(valueField, value) == -1) {
					// Suspend events briefly to prevent change events from firing
					combo.suspendEvents(false);
					// Set the combo to the first value in the store
					combo.setValue(store.getAt(0));
					// Re-enable events
					combo.resumeEvents();
				}
			}

			this.addListener('beforerender', function(combo) {
				combo.getStore().addListener('load', function(store) {
					var val = combo.getValue();
					selectFirstRec(combo, cfg.valueField, val);
				});
			});

			this.addListener('afterrender', function(combo) {
				selectFirstRec(combo, cfg.valueField, cfg.value);
			});
		}

		// If dependent combos are specified, add a select event to update them when the value of their parent combo is changed
		if (cfg.dependentCombos) {
			this.addListener('select', function(combo, recs) {
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
			});
		}
	}
});