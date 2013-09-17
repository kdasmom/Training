/**
 * An AutoComplete combo box
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.ui.AutoComplete', {
	extend : 'Ext.ux.form.field.BoxSelect',
	alias : 'widget.autocomplete',
	
	forceSelection: true,
	queryMode     : 'remote',
	queryParam    : 'keyword',
	typeAhead     : false,
	triggerAction : 'query',
    multiSelect   : false,
    minChars      : 0,
    cls           : 'auto-complete',

	/**
	 * @cfg {Array}                   dependentCombos   An array of IDs for combo boxes that depend on this combo; when the value of this combo is changed, the valueField will be added as a parameter to the proxy of the dependent combos specified and reload their stores
	 */
	dependentCombos: [],

	initComponent: function() {
		this.callParent(arguments);

		// If dependent combos are specified, add a select event to update them when the value of their parent combo is changed
		if (this.dependentCombos.length) {
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
	},

	/* Override this function to fire the select event even when clearing the field */
	setValue: function(value, doSelect, skipLoad) {
		// If the store has no records, don't do anything (this is to prevent store from
		// getting loaded when setValue() gets called)
        if (this.getStore().getCount() > 0) {
			this.callParent(arguments);

			if (value && !value.length) {
				this.fireEvent('select', this, [], {});
			}
		}
	},

	addExtraParams: function(params) {
		Ext.apply(this.getStore().getProxy().extraParams, params);

		return this;
	},

	setDefaultRec: function(rec) {
		// Add the current value to the store, otherwise you have an empty store
		this.getStore().add(rec);
		
		// Suspend events briefly to prevent change events from firing
		this.suspendEvents(false);
		// Set the current value
		this.setValue( rec.get(this.valueField) );
		// Re-enable events
		this.resumeEvents();

		return this;
	}
});