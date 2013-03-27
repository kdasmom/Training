/**
 * A Combo Box component that extends the base Ext.form.field.ComboBox to provide some additional options.
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.ui.ComboBox', {
	extend : 'Ext.form.field.ComboBox',
	alias : 'widget.customcombo',
	
	/**
	 * @cfg {"normal"/"autocomplete"} type              The type of ComboBox; can be set to either "normal" or "autocomplete"; defaults to "normal"
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
	/**
	 * @cfg {Object}                  defaultRec        A default record to add to the store so that when the form loads the selected value shows up properly; only applies to type "autocomplete"
	 */
	/**
	 * @cfg {Object}                  extraParams       Default parameters to add to the store proxy; only applies to type "autocomplete"
	 */
	constructor: function(cfg) {
		Ext.apply(this, cfg);

		Ext.applyIf(this, {
		  type: 'normal'
		});

		var defaultCfg = {
			forceSelection: true,
			tpl           : new Ext.XTemplate('<tpl for=".">' + '<li style="height:22px;" class="x-boundlist-item" role="option">' + '{'+this.displayField+'}' + '</li></tpl>'),
			listeners     : {},
			addBlankRecord: true 
		};
		if (this.type == 'autocomplete') {
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
		Ext.applyIf(this, defaultCfg);

		// Key events must be on
		this.enableKeyEvents = true;

		this.callParent(arguments);

		// Add keyup listener so that value can be cleared
		this.addListener('keyup', function(combo) {
			var val = combo.getRawValue();
			if (val === '' || val === null) {
				combo.clearValue();
			}
		});

		// If type is autocomplete
		if (this.type == 'autocomplete') {
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
		if (this.addBlankRecord) {
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
		if (this.selectFirstRecord) {
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
					selectFirstRec(combo, this.valueField, val);
				});
			});

			this.addListener('afterrender', function(combo) {
				selectFirstRec(combo, this.valueField, this.value);
			});
		}

		// If dependent combos are specified, add a select event to update them when the value of their parent combo is changed
		if (this.dependentCombos) {
			this.addListener('select', function(combo, recs) {
				for (var i=0; i<this.dependentCombos.length; i++) {
					var combo = Ext.ComponentQuery.query('#'+this.dependentCombos[i]);
					if (combo.length) {
						combo = combo[0];
						var store = combo.getStore();
						var proxy = store.getProxy();
						proxy.extraParams[this.valueField] = recs[0].get(this.valueField);
						store.load();
					}
				}
			});
		}
	}
});