/**
 * A Combo Box component that extends the base Ext.form.field.ComboBox to provide some additional options.
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.ui.ComboBox', {
	extend : 'Ext.form.field.ComboBox',
	alias : 'widget.customcombo',
	
	forceSelection     : true,
	queryMode          : 'local',
	typeAhead          : true,
	allowOnlyWhitespace: true,
	editable           : true,

	/**
	 * @cfg {Boolean}                 addBlankRecord    Set to true if you want a blank record to be added as the first record of this combo box's store
	 */
	addBlankRecord: false,
	/**
	 * @cfg {Boolean}                 selectFirstRecord Set to true if you want the first record of the store to be selected by default
	 */
	selectFirstRecord: false,
	/**
	 * @cfg {Boolean}                 loadStoreOnFirstQuery Set to true if you want the store to run its load method the first time a query is run on the combo
	 */
	loadStoreOnFirstQuery: false,

	useSmartStore: false,

	/**
	 * @cfg {Array}                   dependentCombos   An array of IDs for combo boxes that depend on this combo; when the value of this combo is changed, the valueField will be added as a parameter to the proxy of the dependent combos specified and reload their stores
	 */
	/**
	 * @cfg {Object}                  defaultRec        A default record to add to the store so that when the form loads the selected value shows up properly; only applies to type "autocomplete"
	 */
	/**
	 * @cfg {Object}                  extraParams       Default parameters to add to the store proxy; only applies to type "autocomplete"
	 */
	/**
	 * @cfg {String}					blankRecordDisplayValue Set blank record display value
	 */
	blankRecordDisplayValue: '',

	iconClsField: null,

	constructor: function(cfg) {
		if (cfg.displayField) {
			this.displayField = cfg.displayField;
		}
		
		Ext.applyIf(this, {
			tpl: '<tpl for="."><li class="x-boundlist-item" role="option">' + '{'+this.displayField+'}' + '</li></tpl>'
		});
		
		this.callParent(arguments);
	},

	initComponent: function() {
		var me = this;

		// Key events must be on
		this.enableKeyEvents = true;

		// Option for adding an icon to the combo
		if (!Ext.isEmpty(this.iconClsField)) {
			Ext.apply(this, {
				scope:this,
				listConfig: {
					scope       : this,
					iconClsField: this.iconClsField,
					itemTpl     : '<tpl for=".">' +
							'<div class="x-combo-list-item ux-icon-combo-item ' +
							'{' + this.iconClsField + '}">' +
							'{' + this.displayField + '}' +
							'</div></tpl>'
				},
				fieldSubTpl: [
					'<div class="{hiddenDataCls}" role="presentation"></div>',
					'<input id="{id}" type="{type}" {inputAttrTpl}',
					'<tpl if="value"> value="{value}"</tpl>',
					'<tpl if="name"> name="{name}"</tpl>',
					'<tpl if="placeholder"> placeholder="{placeholder}"</tpl>',
					'<tpl if="size"> size="{size}"</tpl>',
					'<tpl if="maxLength !== undefined"> maxlength="{maxLength}"</tpl>',
					'<tpl if="readOnly"> readonly="readonly"</tpl>',
					'<tpl if="disabled"> disabled="disabled"</tpl>',
					'<tpl if="tabIdx"> tabIndex="{tabIdx}"</tpl>',
					'<tpl if="fieldStyle"> style="{fieldStyle}"</tpl>',
					'class="ux-icon-combo-input {fieldCls} {typeCls}" autocomplete="off" />',
					{
						compiled      : true,
						disableFormats: true
					}
				]
			});
		}

		this.callParent(arguments);

		// We set a keyup event to allow us to clear the field when the value is blank and we hit escape,
		// even if forceSelection is true
		this.on('specialkey', function(combo, e) {
			if (
				e.getKey() === Ext.EventObject.ESC
				|| e.getKey() === Ext.EventObject.ENTER
				|| e.getKey() === Ext.EventObject.TAB
			) {
				var val = combo.getRawValue();
				
				if ((val === '' || val === null) && combo.getFocusValue() !== null) {
					combo.clearValue();
				}
			}
		});

		// 
		this.on('focus', function(combo) {
			combo.setFocusValue(combo.getValue());
		});

		// Run a few things before rendering if the options are set
		this.on('beforerender', function(combo) {
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

		// If loadStoreOnFirstQuery is true, set a listener on beforequery to load a store only the first time the
		// user tries to expand the field or types text for autocomplete
		if (this.loadStoreOnFirstQuery) {
			this.on('beforequery', function() {
				this.getStore().load(function() {
					me.expand();
				});
			}, this, { single: true });
		}

		// If addBlankRecord is true, add a blank record at the beginning of the store to make it easy for the user to select
		// a blank value
		if (this.addBlankRecord) {
			this.on('beforerender', function(combo) {
				// Add a blank record to the store
				combo.getStore().on('load', function(store) {
					var rec = {};
					rec[combo.displayField] = me.blankRecordDisplayValue;
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

			this.on('beforerender', function(combo) {
				combo.getStore().on('load', function(store) {
					var val = combo.getValue();
					selectFirstRec(combo, this.valueField, val);
				});
			});

			this.on('afterrender', function(combo) {
				selectFirstRec(combo, this.valueField, this.value);
			});
		}

		// If dependent combos are specified, add a select event to update them when the value of their parent combo is changed
		if (this.dependentCombos) {
			this.on('select', function(combo, recs) {
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

		if (me.useSmartStore) {
			me.on('change', function() {
				if (me.getStore().extraParamsHaveChanged()) {
					function loadComboStore() {
						me._queryRunning = true;
						me.getStore().load();
					}
					if (me.getStore().isLoading()) {
						me.getStore().on('load', function() {
							loadComboStore();
						}, me, { single: true });
					} else {
						loadComboStore();
					}
	            }
			});
		}
	},

	doRawQuery: function() {
		var me = this;

		if (me.useSmartStore) {
			me.doQuery(me.getRawValue(), true);
        } else {
        	me.callParent();
        }
    },

	onTriggerClick: function() {
		var me    = this,
            store = me.getStore();

        if (!me.readOnly && me.useSmartStore && !me.isExpanded) {
	        function expandCombo() {
                me.onFocus({});
                me.doQuery(me.allQuery, true);
                me.inputEl.focus();
            }

        	if (me.getStore().extraParamsHaveChanged()) {
        		me.getStore().load(function() {
                    expandCombo();
                });
            } else {
                me.callParent();
            }
	    } else {
	    	me.callParent();
	    }
	},

	onLoad: function(store, records, success) {
		var me = this,
			raw;

		if (me.useSmartStore && me._queryRunning) {
			raw = me.getRawValue();
		}

		me.callParent(arguments);

		if (me.useSmartStore && me._queryRunning) {
			me.setRawValue(raw);
			me._queryRunning = false;
		}
	},

	getFocusValue: function() {
		return this.focusValue;
	},

	setFocusValue: function(value) {
		this.focusValue = value;
	},

	setDefaultRec: function(rec) {
		var val = (rec.get) ? rec.get(this.valueField) : rec[this.valueField];

		// Add the current value to the store, otherwise you have an empty store
		this.getStore().add(rec);
		
		// Suspend events briefly to prevent change events from firing
		this.suspendEvents(false);
		// Set the current value
		this.setValue(val);
		// Re-enable events
		this.resumeEvents();

		return this;
	},

	setIconCls: function() {
		if (this.rendered) {
			var rec  = this.store.findRecord(this.valueField, this.getValue()),
				icon = Ext.get(this.el.down('input'));

			if (rec) {
				var iconCls = rec.get(this.iconClsField);

				if (this.currentIconCls) {
					icon.replaceCls(this.currentIconCls, iconCls);
				} else {
					icon.addCls(iconCls);
				}

				this.currentIconCls = iconCls;
			}
		} else {
			this.on('render', this.setIconCls, this, {
				single: true
			});
		}
	},

	setValue: function(value) {
		this.callParent(arguments);

		// If icon was specified, we need to set it
		if (!Ext.isEmpty(this.iconClsField)) {	
			this.setIconCls();
		}
	},

	addExtraParams: function(params) {
		Ext.apply(this.getStore().getProxy().extraParams, params);

		return this;
	}
});